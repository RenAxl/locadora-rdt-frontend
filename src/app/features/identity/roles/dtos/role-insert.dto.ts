export class RoleInsertDTO {
  authority: string = '';

  constructor(init?: Partial<RoleInsertDTO>) {
    Object.assign(this, init);
  }
}