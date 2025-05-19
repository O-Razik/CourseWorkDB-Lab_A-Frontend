import {Laboratory} from "./laboratory";

import {Position} from './position';
import {City} from './city';

export interface Employee {
  employeeId: number;
  positionId: number;
  laboratoryId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  laboratory: {
    laboratoryId: number;
    address: string;
    cityId: number;
    phoneNumber: string;
    city: City;
  };
  position: Position;
}
