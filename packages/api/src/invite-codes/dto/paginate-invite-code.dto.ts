import { PaginateQueryDto } from '../../common/paginate-query.dto';
import { CreateInviteCodeDto } from './create-invite-code.dto';

export class PaginateInviteCodeDto extends PaginateQueryDto {
  where?: Partial<CreateInviteCodeDto>;
}