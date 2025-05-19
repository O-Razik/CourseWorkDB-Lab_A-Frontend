import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Day } from '../../../data/models/day';
import { DayService } from '../../../data/services/day.service';
import { Schedule } from '../../../data/models/schedule';
import { map } from 'rxjs';

export interface ScheduleFilter {
  dayId: number | null;
  startTime: string | null;
  endTime: string | null;
  collectionEndTime: string | null;
}

@Component({
  selector: 'app-schedule-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './schedule-filter.component.html',
  styleUrls: ['./schedule-filter.component.css']
})
export class ScheduleFilterComponent implements OnInit {
  @Input({ required: true }) sectionName = 'Графік роботи:';
  @Input({ required: true }) schedules: Schedule[] = [];
  @Output() filterChanged = new EventEmitter<any>();

  days: Day[] = [];
  isLoading = true;

  // Filter values
  selectedSchedule: number = 0;
  selectedDayId: number = 0;
  selectedStartTime: string = '';
  selectedEndTime: string = '';
  selectedCollectionEndTime: string = '';

  // Time options
  timeOptions: string[] = this.generateTimeOptions();

  constructor(
    private dayService: DayService
  ) {}

  ngOnInit(): void {
    this.fetchDays();
  }

  private generateTimeOptions(): string[] {
    const options: string[] = [];
    for (let hour = 8; hour <= 20; hour++) {
      options.push(`${hour.toString().padStart(2, '0')}:00`);
      options.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return options;
  }

  fetchDays(): void {
    this.dayService.getDays().pipe(
      map((days: Day[]) => {
        return [
          { dayId: 0, dayName: 'Всі дні' },
          ...days
        ];
      })
    ).subscribe({
      next: (days: Day[]) => {
        this.days = days;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching days:', err);
        this.days = this.getDefaultDays();
        this.isLoading = false;
      }
    });
  }

  private getDefaultDays(): Day[] {
    return [
      { dayId: 0, dayName: 'Всі дні' },
      { dayId: 1, dayName: 'Неділя' },
      { dayId: 2, dayName: 'Понеділок' },
      { dayId: 3, dayName: 'Вівторок' },
      { dayId: 4, dayName: 'Середа' },
      { dayId: 5, dayName: 'Четвер' },
      { dayId: 6, dayName: 'П\'ятниця' },
      { dayId: 7, dayName: 'Субота' }
    ];
  }

  getSchedulesByDayId(dayId: number): Schedule[] {
    return this.schedules.filter(schedule => schedule.dayId === dayId);
  }

  getStartTimeOptionsByDayId(dayId: number): string[] {
    return this.getSchedulesByDayId(dayId).map(schedule => schedule.startTime);
  }

  getEndTimeOptionsByDayId(dayId: number): string[] {
    return this.getSchedulesByDayId(dayId).map(schedule => schedule.endTime);
  }

  getCollectionEndTimeOptionsByDayId(dayId: number): string[] {
    return this.getSchedulesByDayId(dayId).map(schedule => schedule.collectionEndTime);
  }

  getToHM(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  }

  findScheduleByFilter(filter: ScheduleFilter): Schedule | null {
    let filteredSchedules = this.schedules;

    if ( filter.dayId !== null) {
      filteredSchedules = filteredSchedules.filter(schedule => schedule.dayId === filter.dayId);
    }

    if (
      (filter.startTime === null || filter.startTime === '') &&
      (filter.collectionEndTime === null || filter.collectionEndTime === '') &&
      (filter.endTime === null || filter.endTime === '')) {
      return null;
    }

    if (filter.startTime !== null) {
      filteredSchedules = filteredSchedules.filter(schedule => schedule.startTime === filter.startTime);
    }

    if (filter.endTime !== null) {
      filteredSchedules = filteredSchedules.filter(schedule => schedule.endTime === filter.endTime);
    }

    if (filter.collectionEndTime !== null) {
      filteredSchedules = filteredSchedules.filter(schedule => schedule.collectionEndTime === filter.collectionEndTime);
    }

    if (filteredSchedules.length === 0) {
      return null;
    } else if (filteredSchedules.length > 1) {
      console.warn('Multiple schedules found for the given filter:', filter, filteredSchedules);
    }

    return filteredSchedules[0];
  }


  clearFilters(): void {
    this.selectedDayId = 0;
    this.selectedStartTime = '';
    this.selectedEndTime = '';
    this.selectedCollectionEndTime = '';
  }

  applyFilter(): void {
    if (this.selectedDayId === 0) {
      this.clearFilters();
      this.filterChanged.emit(0);
      return;
    }

    const filter: ScheduleFilter = {
      dayId: this.selectedDayId === 0 ? null : this.selectedDayId,
      startTime: this.selectedStartTime === '' ? null : this.selectedStartTime,
      endTime: this.selectedEndTime === '' ? null : this.selectedEndTime,
      collectionEndTime: this.selectedCollectionEndTime === '' ? null : this.selectedCollectionEndTime
    };

    const foundSchedule = this.findScheduleByFilter(filter);
    this.filterChanged.emit(foundSchedule?.scheduleId || null);
  }
}
