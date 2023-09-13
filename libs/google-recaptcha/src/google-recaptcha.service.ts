import { Injectable } from '@nestjs/common';
import { GRModuleOptions, GRModuleVerifyOptions } from './interfaces';

@Injectable()
export class GoogleRecaptchaService {
  constructor(private option: GRModuleOptions) {}

  async verifyRecaptcha(params: GRModuleVerifyOptions) {
    const { response, score, remoteip } = {
      score: 0.9,
      ...params,
    };
    const result = await fetch('https://recaptcha.net/recaptcha/api/siteverify', {
      method: 'post',
      body: JSON.stringify({
        response,
        remoteip,
        secret: this.option.secret,
      }),
    }).then((data) => data.json());
    if (!result) {
      return false;
    }
    return !!result.success || result.score > score;
  }
}
