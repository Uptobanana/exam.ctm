// login 云函数 - 用户登录
// 输入: { username, password }
// 输出: { ok: true, ticket, uid, role } 或 { ok: false, error }

const tcb = require('@cloudbase/node-sdk');
const bcrypt = require('bcryptjs');

const app = tcb.init();
const db = app.database();
const _ = db.command;

const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 分钟窗口
const RATE_LIMIT_MAX = 5; // 同一用户名 10 分钟内最多 5 次失败

exports.main = async (event, context) => {
  const { username, password } = event || {};

  // 1. 参数校验
  if (!username || !password) {
    return { ok: false, error: '用户名和密码不能为空' };
  }

  try {
    // 2. 限流：近 10 分钟该用户名失败次数
    const since = Date.now() - RATE_LIMIT_WINDOW;
    const failRes = await db.collection('audit_logs')
      .where({ username, action: 'login_fail', timestamp: _.gte(since) })
      .count();
    if (failRes.total >= RATE_LIMIT_MAX) {
      return { ok: false, error: '尝试过于频繁，请稍后再试' };
    }

    // 3. 查用户
    const userRes = await db.collection('users').where({ username }).get();
    const user = userRes.data && userRes.data[0];

    // 4. 校验密码（用户不存在或密码错统一报错，防探测）
    let passwordOk = false;
    if (user) {
      passwordOk = await bcrypt.compare(password, user.password_hash);
    }
    if (!user || !passwordOk) {
      await db.collection('audit_logs').add({
        username, action: 'login_fail', timestamp: Date.now(),
        detail: { reason: user ? 'wrong_password' : 'no_user' }
      });
      return { ok: false, error: '用户名或密码错误' };
    }

    // 5. 状态检查
    if (user.status === 'disabled') {
      await db.collection('audit_logs').add({
        user_id: user._id, username, action: 'login_fail', timestamp: Date.now(),
        detail: { reason: 'disabled' }
      });
      return { ok: false, error: '账号已禁用，请联系管理员' };
    }

    // 6. 更新登录时间 + 写审计日志
    const now = Date.now();
    await db.collection('users').doc(user._id).update({ last_login_at: now });
    await db.collection('audit_logs').add({
      user_id: user._id, username, action: 'login', timestamp: now, detail: {}
    });

    // 7. 生成自定义登录 ticket
    const ticket = await app.auth().createTicket(user._id, { refresh: 3600 });

    return { ok: true, ticket, uid: user._id, role: user.role };
  } catch (err) {
    console.error('login error', err);
    return { ok: false, error: '服务器异常，请稍后再试' };
  }
};
