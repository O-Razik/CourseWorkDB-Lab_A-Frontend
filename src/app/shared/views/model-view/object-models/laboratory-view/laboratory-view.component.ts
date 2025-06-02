import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Laboratory } from '../../../../../data/models/laboratory';
import { TitleCasePipe } from '@angular/common';
import { Schedule } from '../../../../../data/models/schedule';
import { Day } from '../../../../../data/models/day';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CityService } from '../../../../../data/services/city.service';
import { City } from '../../../../../data/models/city';
import { LaboratoryService } from '../../../../../data/services/laboratory.service';
import { AuthService } from '../../../../../data/services/auth.service';
import { UserRole } from '../../../../../data/models/user-role';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { LaboratoryScheduleCreateViewComponent } from '../../../../generics/object-create/laboratory-schedule-create-view/laboratory-schedule-create-view.component';

@Component({
  selector: 'app-laboratory-view',
  standalone: true,
  imports: [
    TitleCasePipe,
    FormsModule,
    ReactiveFormsModule,
    MatGridList,
    MatGridTile,
    MatIcon,
    LaboratoryScheduleCreateViewComponent
  ],
  templateUrl: './laboratory-view.component.html',
  styleUrls: ['./laboratory-view.component.css']
})
export class LaboratoryViewComponent implements OnInit, AfterViewInit {
  @Input() laboratory?: Laboratory;
  @Output() laboratoryUpdated = new EventEmitter<Laboratory>();
  @ViewChild('scheduleComponent') scheduleComponent?: LaboratoryScheduleCreateViewComponent;

  isEditMode = false;
  editForm!: FormGroup;
  cityOptions: City[] = [];

  scheduleData: { time: string; [key: string]: any }[] = [];
  displayedColumns: string[] = ['time'];
  days: Day[] = [];

  constructor(
    private fb: FormBuilder,
    private cityService: CityService,
    private laboratoryService: LaboratoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.prepareScheduleData();
    if (this.laboratory) {
      this.initializeForm();
    }
  }

  canEdit(): boolean {
    return this.authService.getCurrentUserRole() === UserRole.ADMIN;
  }

  initializeForm() {
    if (!this.laboratory) return;

    this.editForm = this.fb.group({
      address: [this.laboratory.address, Validators.required],
      cityId: [this.laboratory.city?.cityId, Validators.required],
      phoneNumber: [this.laboratory.phoneNumber, [Validators.required, Validators.pattern(/^\+380\d{9}$/)]]
    });
  }

  ngAfterViewInit(): void {
    if (this.isEditMode && this.scheduleComponent) {
      this.scheduleComponent.setSchedules(this.getLabSchedules());
    }
  }

  toggleEditMode(event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    this.isEditMode = !this.isEditMode;

    if (this.isEditMode) {
      this.loadCityOptions();
      this.initializeForm();
      // Use setTimeout to ensure child is available after view updates
      setTimeout(() => {
        this.scheduleComponent?.setSchedules(this.getLabSchedules());
      });
    }
  }


  loadCityOptions() {
    this.cityService.getCities().subscribe({
      next: (cities) => {
        this.cityOptions = cities;
      },
      error: (err) => console.error('Failed to load cities', err)
    });
  }

  saveChanges() {
    if (this.editForm.invalid || !this.laboratory || !this.scheduleComponent) return;

    const formValue = this.editForm.value;
    const selectedCity = this.cityOptions.find(c => c.cityId == formValue.cityId);
    const schedules = this.scheduleComponent.getSchedules();

    const updatedLaboratory: Laboratory = {
      ...this.laboratory,
      address: formValue.address,
      city: selectedCity || this.laboratory.city,
      phoneNumber: formValue.phoneNumber,
      laboratorySchedules: schedules.map(schedule => ({
        laboratoryScheduleId: 0,
        laboratoryId: this.laboratory!.laboratoryId,
        scheduleId: schedule.scheduleId,
        schedule: schedule
      }))
    };

    this.laboratoryService.updateLaboratory(updatedLaboratory).subscribe({
      next: (updatedLaboratory) => {
        this.laboratory = updatedLaboratory;
        this.isEditMode = false;
        this.prepareScheduleData();
        this.laboratoryUpdated.emit(updatedLaboratory);
      },
      error: (err) => console.error('Failed to update laboratory', err)
    });
  }

  private prepareScheduleData(): void {
    if (!this.laboratory?.laboratorySchedules?.length) {
      this.scheduleData = [];
      return;
    }

    // Extract and sort unique days
    this.days = this.extractUniqueDays();
    this.displayedColumns = ['time', ...this.days.map(day => `day-${day.dayId}`)];

    // Prepare schedule data rows
    this.scheduleData = [
      this.createTimeRow('Початок роботи', 'startTime'),
      this.createTimeRow('Кінець роботи', 'endTime'),
      this.createTimeRow('Кінець прийому', 'collectionEndTime')
    ];
  }

  private extractUniqueDays(): Day[] {
    return (this.laboratory?.laboratorySchedules || [])
      .map(ls => ls.schedule.day)
      .filter((day, index, self) =>
        index === self.findIndex(d => d.dayId === day.dayId)
      )
      .sort((a, b) => a.dayId - b.dayId);
  }

  private createTimeRow(timeLabel: string, timeProperty: keyof Schedule):
    { time: string; [key: string]: any } {
    const row: { time: string; [key: string]: any } = { time: timeLabel };

    this.days.forEach(day => {
      const schedule = this.getScheduleForDay(day.dayId);
      const timeValue = schedule?.[timeProperty];

      row[`day-${day.dayId}`] = {
        value: timeValue ? this.formatTime(timeValue.toString()) : '—',
        dayName: day.dayName
      };
    });

    return row;
  }

  private getScheduleForDay(dayId: number): Schedule | undefined {
    if (!this.laboratory?.laboratorySchedules) return undefined;

    const foundSchedule = this.laboratory.laboratorySchedules
      .find(ls => ls?.schedule?.day?.dayId === dayId);

    return foundSchedule?.schedule;
  }

  private formatTime(timeString: string): string {
    if (!timeString) return '—';

    try {
      // Extract just hours and minutes (HH:mm)
      return timeString.split(':').slice(0, 2).join(':');
    } catch {
      return timeString; // Return original if formatting fails
    }
  }

  getDayName(column: string): string {
    if (column === 'time') return '';
    const dayId = parseInt(column.replace('day-', ''));
    return this.days.find(day => day.dayId === dayId)?.dayName || '';
  }

  getLabSchedules(): Schedule[] {
    return this.laboratory?.laboratorySchedules?.map(ls => ({
      ...ls.schedule,
      day: ls.schedule.day // Ensure day object is preserved
    })) || [];
  }
}
