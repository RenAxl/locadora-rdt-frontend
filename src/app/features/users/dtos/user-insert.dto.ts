export class UserInsertDTO {
  name: string = '';

  email: string = '';

  telephone: string = '';

  address?: string;

  roleIds: number[] = [];

  constructor(init?: Partial<UserInsertDTO>) {
    Object.assign(this, init);

    this.roleIds = init?.roleIds || [];
  }
}