import * as crypto from 'crypto';

// 加密函数
export function hashPassword(password: string) {
  // 生成随机盐值
  const salt = crypto.randomBytes(16).toString('hex');
  // 使用 SHA256 算法进行哈希
  const hash = crypto
    .pbkdf2Sync(password, salt, 100, 32, 'sha256')
    .toString('hex');
  return `${salt}:${hash}`;
}

// 验证函数
export function verifyPassword(password: string, hashedPassword: string) {
  const [salt, hash] = hashedPassword.split(':');
  const verifyHash = crypto
    .pbkdf2Sync(password, salt, 100, 32, 'sha256')
    .toString('hex');
  return hash === verifyHash;
}
