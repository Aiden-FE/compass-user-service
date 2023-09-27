import { BusinessStatus, HttpResponse } from '@app/common';

/**
 * @description 包裹特定错误的返回值,不匹配的错误则继续抛出异常
 * @param err
 */
export default function wrapUnknownError(err: unknown) {
  if (err instanceof Error && (err as { code?: string })?.code) {
    switch ((err as { code?: string }).code) {
      case 'ER_DUP_ENTRY':
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw new HttpResponse({
          statusCode: BusinessStatus.ER_DUP_ENTRY,
          message: 'The unique column is duplicate',
        });
      default:
        break;
    }
  }
  throw err;
}
