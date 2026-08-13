// register 云函数 - 用户注册
// 输入: { username, password }
// 输出: { ok: true, ticket, uid } 或 { ok: false, error }

const tcb = require('@cloudbase/node-sdk');
const bcrypt = require('bcryptjs');

// 云函数中 init() 可自动识别当前环境；如失败则改为 tcb.init({ env: '你的环境ID' })
const app = tcb.init();
const db = app.database();

// 用户名规则：3-20位字母数字下划线
const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 小时窗口
const RATE_LIMIT_MAX = 5; // 同一用户名 1 小时内最多 5 次注册尝试

exports.main = async (event, context) => {
  const { username, password } = event || {};

  // 1. 参数校验
  if (!username || !password) {
    return { ok: false, error: '用户名和密码不能为空' };
  }
  if (!USERNAME_RE.test(username)) {
    return { ok: false, error: '用户名需为3-20位字母、数字或下划线' };
  }
  if (password.length < 6) {
    return { ok: false, error: '密码至少6位' };
  }

  try {
    // 2. 限流：同一用户名近 1 小时注册尝试次数
    const since = Date.now() - RATE_LIMIT_WINDOW;
    const attemptRes = await db.collection('audit_logs')
      .where({ username, action: 'register_attempt', timestamp: db.command.gte(since) })
      .count();
    if (attemptRes.total >= RATE_LIMIT_MAX) {
      return { ok: false, error: '尝试过于频繁，请稍后再试' };
    }

    // 3. 查重
    const existing = await db.collection('users').where({ username }).get();
    if (existing.data && existing.data.length > 0) {
      await db.collection('audit_logs').add({
        username, action: 'register_attempt', timestamp: Date.now(), detail: { reason: 'duplicate' }
      });
      return { ok: false, error: '用户名已存在' };
    }

    // 4. 哈希密码
    const password_hash = await bcrypt.hash(password, 10);

    // 5. 写入 users
    const now = Date.now();
    const addRes = await db.collection('users').add({
      username,
      password_hash,
      role: 'user',
      status: 'active',
      created_at: now,
      last_login_at: now
    });
    const uid = addRes.id;

    // 6. 审计日志
    await db.collection('audit_logs').add({
      user_id: uid,
      username,
      action: 'register',
      timestamp: now,
      detail: {}
    });

    // 7. 生成自定义登录 ticket
    // 注意：createTicket 的确切 API 以 @cloudbase/node-sdk 文档为准
    // 若此方法不可用，需改用控制台下载私钥的自定义登录方式
    const ticket = await app.auth().createTicket(uid, { refresh: 3600 });

    return { ok: true, ticket, uid };
  } catch (err) {
    console.error('register error', err);
    return { ok: false, error: '服务器异常，请稍后再试' };
  }
};
