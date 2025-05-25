import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Day } from '../../../../data/models/day';
import { Schedule } from '../../../../data/models/schedule';
import { ScheduleService } from '../../../../data/services/schedule.service';
import { DayService } from '../../../../data/services/day.service';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

type TimeProperty = 'startTime' | 'endTime' | 'collectionEndTime';

@Component({
  selector: 'app-laboratory-schedule-create-view',
  templateUrl: './laboratory-schedule-create-view.component.html',
  styleUrls: ['./laboratory-schedule-create-view.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe]
})
export class LaboratoryScheduleCreateViewComponent implements OnInit {
  @Output() scheduleSubmit = new EventEmitter<any>();

  days: Day[] = [];
  enabledDays: { [key: number]: boolean } = {};
  selectedSchedules: { [key: number]: number | null } = {};
  scheduleTimes: { [key: number]: { startTime: string, endTime: string, collectionEndTime: string } } = {};
  allSchedules: Schedule[] = [];

  timeRows = [
    { label: 'Початок роботи', property: 'startTime' as TimeProperty },
    { label: 'Кінець роботи', property: 'endTime' as TimeProperty },
    { label: 'Кінець прийому', property: 'collectionEndTime' as TimeProperty }
  ];

  constructor(
    private dayService: DayService,
    private scheduleService: ScheduleService,
  ) {}

  ngOnInit(): void {
    this.loadDays();
    this.loadExistingSchedules();
  }

  loadDays() {
    this.dayService.getDays().subscribe((days: Day[]) => {
      this.days = days.sort((a, b) => a.dayId - b.dayId);
      days.forEach(day => {
        this.enabledDays[day.dayId] = true;
        this.selectedSchedules[day.dayId] = null;
        this.scheduleTimes[day.dayId] = { startTime: '', endTime: '', collectionEndTime: '' };
      });
    });
  }

  loadExistingSchedules() {
    this.scheduleService.getSchedules().subscribe((schedules: Schedule[]) => {
      this.allSchedules = schedules;
    });
  }

  getSchedulesForDay(dayId: number): Schedule[] {
    return this.allSchedules.filter(s => s.day.dayId === dayId);
  }

  toggleDay(dayId: number) {
    this.enabledDays[dayId] = !this.enabledDays[dayId];
    if (!this.enabledDays[dayId]) {
      this.clearDaySelection(dayId);
    }
  }

  formatTimeForInput(timeString: string): string {
    if (!timeString) return '';

    // Extract just hours and minutes (HH:mm)
    const timeParts = timeString.split(':');
    if (timeParts.length >= 2) {
      return `${timeParts[0]}:${timeParts[1]}`;
    }
    return timeString;
  }

  clearDaySelection(dayId: number) {
    this.selectedSchedules[dayId] = null;
    this.scheduleTimes[dayId] = { startTime: '', endTime: '', collectionEndTime: '' };
  }

  onScheduleChange(dayId: number) {
    if (this.selectedSchedules[dayId] === 0) { // New schedule
      this.scheduleTimes[dayId] = { startTime: '', endTime: '', collectionEndTime: '' };
    } else if (this.selectedSchedules[dayId]) { // Existing schedule
      const schedule = this.allSchedules.find(s => s.scheduleId === this.selectedSchedules[dayId]);
      if (schedule) {
        this.scheduleTimes[dayId] = {
          startTime: this.formatTimeForInput(schedule.startTime),
          endTime: this.formatTimeForInput(schedule.endTime),
          collectionEndTime: this.formatTimeForInput(schedule.collectionEndTime)
        };
      }
    }
  }


  updateTime(dayId: number, property: TimeProperty, value: string) {
    this.scheduleTimes[dayId][property] = value;
  }

  onSubmit() {
    const result = this.days
      .filter(day => this.enabledDays[day.dayId])
      .map(day => ({
        dayId: day.dayId,
        scheduleId: this.selectedSchedules[day.dayId] === 0 ? null : this.selectedSchedules[day.dayId],
        isNewSchedule: this.selectedSchedules[day.dayId] === 0,
        ...this.scheduleTimes[day.dayId]
      }));

    this.scheduleSubmit.emit(result);
  }

  isAtLeastOneDayEnabled(): boolean {
    return Object.values(this.enabledDays).some(enabled => enabled);
  }
}
