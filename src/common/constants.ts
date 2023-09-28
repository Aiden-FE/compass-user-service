export const SYSTEM_EMAIL_DISPLAY_ACCOUNT = 'aiden_fe@outlook.com';

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum REDIS_KEYS {
  /**
   * @description 验证码key
   * @param {'email' | 'sms'} type 验证码类型
   * @param {string} account 对应的email或手机账号
   * @return {string} 验证码的值
   */
  CAPTCHA = 'captcha/:type/:account',
  /**
   * @description 锁定验证码,防止频繁发送
   * @param {'email' | 'sms'} type 验证码类型
   * @param {string} account 对应的email或手机账号
   * @return {'true'}
   */
  CAPTCHA_LOCK = 'captcha/lock/:type/:account',
  /**
   * @description 角色对应的权限信息
   * @param {number} roleId
   */
  ROLE_PERMISSIONS = 'role/:roleId',
}
