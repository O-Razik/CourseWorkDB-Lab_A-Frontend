import {Day} from "./day";

export interface Schedule {
  scheduleId: number;
  dayId: number;
  startTime: string;
  endTime: string;
  collectionEndTime: string;
  day: Day;
}
