import { SetMetadata } from '@nestjs/common';

export const SkipResponse = () => SetMetadata('RESPONSE_SKIP', true);
