import {LaboratorySchedule} from './laboratory-schedule';
import {City} from './city';

export interface Laboratory {
  laboratoryId: number;
  address: string;
  cityId: number;
  phoneNumber: string;
  city: City;
  laboratorySchedules: LaboratorySchedule[];
}
