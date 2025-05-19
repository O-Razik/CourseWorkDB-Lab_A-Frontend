import {Sex} from './sex';

export interface Client {
  clientId: number;
  firstName: string;
  lastName: string;
  sexId: number;
  birthdate: string;
  phoneNumber: string;
  email: string;
  sex: Sex;
}
