import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupService {
  async create(
    userId: string,
    name: string,
    visibility: string,
  ): Promise<string> {
    return '';
  }
}
