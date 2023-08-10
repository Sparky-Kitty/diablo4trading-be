import { Request } from '@nestjs/common';
import { User } from 'src/users/users.entity';

export interface RequestModel extends Request {
    token?: string;
    user: User;
}
