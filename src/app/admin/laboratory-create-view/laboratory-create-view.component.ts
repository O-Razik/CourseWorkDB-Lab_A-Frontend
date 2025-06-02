import {Component, inject, Input, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { GenericObjectCreateViewComponent } from '../../shared/generics/object-create/generic-object-create-view/generic-object-create-view.component';
import { LaboratoryService } from '../../data/services/laboratory.service';
import { Laboratory } from '../../data/models/laboratory';
import { LaboratoryScheduleCreateViewComponent } from '../../shared/generics/object-create/laboratory-schedule-create-view/laboratory-schedule-create-view.component';
import {CityService} from '../../data/services/city.service';
import {City} from '../../data/models/city';
import {LaboratoryViewComponent} from '../../shared/views/model-view/object-models/laboratory-view/laboratory-view.component';
import {LaboratorySchedule} from '../../data/models/laboratory-schedule';

@Component({
  selector: 'app-laboratory-create-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenericObjectCreateViewComponent,
    LaboratoryScheduleCreateViewComponent,
    LaboratoryViewComponent
  ],
  templateUrl: './laboratory-create-view.component.html',
  styleUrls: ['./laboratory-create-view.component.css']
})
export class LaboratoryCreateViewComponent implements OnInit {
  @ViewChild('scheduleComponent')
  scheduleComponent!: LaboratoryScheduleCreateViewComponent;

  private fb = inject(FormBuilder);

  isLoading = false;
  createdLaboratory: Laboratory | null = null;
  showConfirmation = false;
  laboratorySchedules: LaboratorySchedule[] = [];
  @Input() cityOptions: City[] = [];

  laboratoryForm: FormGroup = this.fb.group({
    address: ['', Validators.required],
    cityId: [null, Validators.required],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
  });

  constructor(
    private laboratoryService: LaboratoryService,
    private cityService: CityService) {}

  ngOnInit(): void {
    if (this.cityOptions.length === 0) {
      this.loadCities();
    }
  }

  loadCities(): void {
    this.cityService.getCities().subscribe({
      next: (cities) => {
        this.cityOptions = cities;
      }
    });
  }

  getCityName(cityId: number): string {
    const city = this.cityOptions.find(c => c.cityId === cityId);
    return city ? city.cityName : '';
  }

  canSubmit(): boolean {
    return this.laboratoryForm.valid && this.getSchedules().length > 0;
  }

  getSchedules(): LaboratorySchedule[] {
    if (!this.scheduleComponent) {
      return [];
    }

    const scheduleData = this.scheduleComponent.getSchedules();
    return scheduleData.map(schedule => ({
      laboratoryScheduleId: 0,
      laboratoryId: 0,
      scheduleId: schedule.scheduleId,
      schedule: {
        scheduleId: schedule.scheduleId,
        dayId: schedule.dayId,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        collectionEndTime: schedule.collectionEndTime,
        day: {
          dayId: schedule.dayId,
          dayName: this.scheduleComponent.days.find(d => d.dayId === schedule.dayId)?.dayName || ''
        }
      }
    }));
  }

  onSubmit(): void {
    if (this.laboratoryForm.valid) {
      // Update schedules before submission
      this.laboratorySchedules = this.getSchedules();

      if (this.laboratorySchedules.length === 0) {
        alert('Будь ласка, налаштуйте графік роботи');
        return;
      }

      this.isLoading = true;
      const formValue = this.laboratoryForm.value;

      // Create the laboratory data with proper typing
      const laboratoryData = {
        laboratoryId: 0,
        address: formValue.address,
        cityId: formValue.cityId,
        phoneNumber: formValue.phoneNumber,
        city: { cityId: formValue.cityId, cityName: this.getCityName(formValue.cityId) },
        laboratorySchedules: this.laboratorySchedules
      };

      this.laboratoryService.addLaboratory(laboratoryData).subscribe({
        next: (created) => {
          this.createdLaboratory = created;
          this.showConfirmation = true;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  onConfirmationClosed(): void {
    this.showConfirmation = false;
    this.laboratoryForm.reset();
    this.laboratorySchedules = [];
  }
}
