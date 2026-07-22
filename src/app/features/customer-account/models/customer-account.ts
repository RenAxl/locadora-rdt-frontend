export interface CustomerAccountRegistration {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CustomerAccountPassword {
  password: string;
  passwordConfirmation: string;
}
