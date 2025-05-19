import {Schedule} from "./schedule";

export interface LaboratorySchedule {
  laboratoryScheduleId: number;
  laboratoryId: number;
  scheduleId: number;
  schedule: Schedule;
}
