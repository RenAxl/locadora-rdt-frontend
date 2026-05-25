export class UserUpdateDTO {
  id?: number;

  name: string = '';

  email: string = '';

  active: boolean = true;

  telephone: string = '';

  address?: string;

  roleIds: number[] = [];

  constructor(init?: Partial<UserUpdateDTO>) {
    Object.assign(this, init);

    this.roleIds = init?.roleIds || [];
  }
}