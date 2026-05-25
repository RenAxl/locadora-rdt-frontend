export class Profile {
  name: string = '';
  email: string = '';
  telephone: string = '';
  address: string = '';

   constructor(init?: Partial<Profile>) {
    Object.assign(this, init);
  }

}