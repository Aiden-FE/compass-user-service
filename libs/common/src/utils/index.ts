import * as path from 'path';
import * as process from 'process';

export { default as validateMultipleDto } from './validate-mutiple-dto';
export { default as wrapUnknownError } from './wrap-unknown-error';
export * from './http-response';
export * from './cryptographic';

export function resolve(...pathStr: string[]) {
  return path.join(process.cwd(), ...pathStr);
}

/**
 * @param str
 * @param params
 * @example
 * replaceStringParams('/test/:id', { id: '1' }); // return '/test/1'
 */
export function replaceStringParams(str: string, params: Record<string, string>) {
  return Object.keys(params).reduce((lastStr, currentKey) => {
    const currentValue = params[currentKey];
    const reg = new RegExp(`:${currentKey}`, 'g');
    return lastStr.replace(reg, currentValue);
  }, str);
}

/**
 * @param templateString 'test {{ name }} test'
 * @param params
 */
export function replaceVariablesInString(templateString: string, params: Record<string, string>) {
  return Object.keys(params).reduce((lastString, currentKey) => {
    const currentValue = params[currentKey];
    // eslint-disable-next-line no-useless-escape
    const reg = new RegExp(`{{[\s\x20]*(${currentKey})[\s\x20]*}}`, 'g');
    // eslint-disable-next-line no-param-reassign
    lastString = lastString.replace(reg, currentValue);
    return lastString;
  }, templateString);
}

/**
 * @description 将对象转换为sql条件
 * @param params
 * @param [option]
 * @param [option.prefix] 在字段前追加前缀
 * @example
 * // SELECT * FROM `demo` WHERE phone = '*****' AND enabled = true
 * query(`SELECT * FROM \`demo\` WHERE ${convertObjectToSQLWhere({ phone: '*****', enabled: true })}`)
 * // SELECT * FROM `demo` u WHERE u.phone = '*****' AND u.enabled = true
 * query(`SELECT * FROM \`demo\` u WHERE ${convertObjectToSQLWhere({ phone: '*****', enabled: true }, { prefix: 'u.' })}`)
 */
export function convertObjectToSQLWhere(
  params: Record<string, unknown>,
  option?: {
    prefix?: string;
  },
) {
  const { prefix } = { ...option };
  return Object.keys(params)
    .map((key) => {
      return `${prefix}${key} = ${typeof params[key] === 'string' ? `'${params[key]}'` : params[key]}`;
    })
    .join(' AND ');
}
