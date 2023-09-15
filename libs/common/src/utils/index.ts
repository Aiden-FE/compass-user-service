import * as path from 'path';
import * as process from 'process';

export { default as validateMultipleDto } from './validate-mutiple-dto';
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
