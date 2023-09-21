import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '@app/common';

const Public = () => {
  return SetMetadata(IS_PUBLIC_KEY, true);
};

export default Public;
