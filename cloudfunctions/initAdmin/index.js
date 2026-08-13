// initAdmin 云函数 - 一次性引导创建管理员账号
// 输入: { username, password }
// 输出: { ok: true, uid } 或 { ok: false, error }
// 调用方式: 通过 tcb CLI 或控制台云函数测试入口手动调用一次
//           例: tcb fn invoke initAdmin --params '{"username":"admin","password":"你的密码"}'

const tcb = require('@cloudbase/node-sdk');
const bcrypt = require('bcryptjs');

const app = tcb.init();
const db = app.database();

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;

exports.main = async (event, context) => {
  const { username, password } = event || {};

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
    // 1. 防重复：已有 admin 则拒绝
    const existAdmin = await db.collection('users').where({ role: 'admin' }).get();
    if (existAdmin.data && existAdmin.data.length > 0) {
      return { ok: false, error: '管理员账号已存在，如需重置请直接改数据库或写专用函数' };
    }

    // 2. 防止用户名与普通用户冲突
    const existUser = await db.collection('users').where({ username }).get();
    if (existUser.data && existUser.data.length > 0) {
      return { ok: false, error: '该用户名已被占用' };
    }

    // 3. 哈希密码并写入
    const password_hash = await bcrypt.hash(password, 10);
    const now = Date.now();
    const addRes = await db.collection('users').add({
      username,
      password_hash,
      role: 'admin',
      status: 'active',
      created_at: now,
      last_login_at: 0
    });

    // 4. 审计日志
    await db.collection('audit_logs').add({
      user_id: addRes.id,
      username,
      action: 'register',
      timestamp: now,
      detail: { role: 'admin', source: 'initAdmin' }
    });

    return { ok: true, uid: addRes.id, username };
  } catch (err) {
    console.error('initAdmin error', err);
    return { ok: false, error: '服务器异常，请稍后再试' };
  }
};
