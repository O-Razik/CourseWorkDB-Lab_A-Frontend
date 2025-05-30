import { Component, Output, OnInit } from '@angular/core';
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
    if (this.selectedSchedules[dayId] === 0) {
      // User chose to create a new schedule – reset times
      this.scheduleTimes[dayId] = {
        startTime: '',
        endTime: '',
        collectionEndTime: ''
      };
    } else if (this.selectedSchedules[dayId]) {
      // User selected an existing schedule – populate times
      const schedule = this.allSchedules.find(s => s.scheduleId === this.selectedSchedules[dayId]);
      if (schedule) {
        this.scheduleTimes[dayId] = {
          startTime: this.formatTimeForInput(schedule.startTime ?? ''),
          endTime: this.formatTimeForInput(schedule.endTime ?? ''),
          collectionEndTime: this.formatTimeForInput(schedule.collectionEndTime ?? '')
        };
      }
    } else {
      // No valid selection – clear
      this.scheduleTimes[dayId] = {
        startTime: '',
        endTime: '',
        collectionEndTime: ''
      };
    }
  }

  updateTime(dayId: number, property: TimeProperty, value: string) {
    this.scheduleTimes[dayId][property] = value;
  }

  @Output() getSchedules() : Schedule[]{
    const schedules: Schedule[] = [];
    for (const day of this.days) {
      if (this.enabledDays[day.dayId]) {
        const scheduleId = this.selectedSchedules[day.dayId];
        const times = this.scheduleTimes[day.dayId];

        if (times.startTime.length != 0 || times.endTime.length != 0 || times.collectionEndTime.length != 0) {
          schedules.push({
            scheduleId: scheduleId || 0,
            dayId: day.dayId,
            startTime: times.startTime,
            endTime: times.endTime,
            collectionEndTime: times.collectionEndTime,
            day: day
          });
        }
      }
    }
    return schedules;
  }
}
