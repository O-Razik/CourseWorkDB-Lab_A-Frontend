import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-generic-object-create-view',
  imports: [
    ReactiveFormsModule,
    MatIcon
  ],
  templateUrl: './generic-object-create-view.component.html',
  styleUrl: './generic-object-create-view.component.css',
  standalone: true,
})
export class GenericObjectCreateViewComponent {
  @Input() title: string = 'Create Object';
  @Input() submitText: string = 'Submit';
  @Input() objectName: string = 'object';
  @Input() formGroup!: FormGroup;
  @Input() isLoading: boolean = false;
  @Input() createdObject: any = null;
  @Input() showConfirmation: boolean = false;
  @Input() canSubmit: boolean = true;

  @Output() formSubmit = new EventEmitter<any>();
  @Output() confirmationClosed = new EventEmitter<void>();

  onSubmit() {
    if (this.formGroup.valid) {
      this.formSubmit.emit(this.formGroup.value);
    }
  }

  closeConfirmation() {
    this.showConfirmation = false;
    this.confirmationClosed.emit();
  }
}
