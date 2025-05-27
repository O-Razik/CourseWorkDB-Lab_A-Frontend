import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-generic-object-create-view',
  imports: [
    ReactiveFormsModule,
    JsonPipe,
  ],
  templateUrl: './generic-object-create-view.component.html',
  styleUrl: './generic-object-create-view.component.css',
  standalone: true,
})
export class GenericObjectCreateViewComponent implements OnChanges {
  @Input() title: string = 'Create Object';
  @Input() submitText: string = 'Submit';
  @Input() objectName: string = 'object';
  @Input() initialFormValue: any = {};
  @Input() isLoading: boolean = false;

  @Output() formSubmit = new EventEmitter<any>();
  @Output() formChange = new EventEmitter<any>();

  objectForm: FormGroup;
  createdObject: any = null;

  constructor(private fb: FormBuilder) {
    this.objectForm = this.fb.group({});
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.initialFormValue) {
      if (this.objectForm) {
        this.objectForm.patchValue(this.initialFormValue);
      }
    }
  }

  onSubmit() {
    if (this.objectForm.valid) {
      this.formSubmit.emit(this.objectForm.value);
    }
  }

  setCreatedObject(obj: any) {
    this.createdObject = obj;
    this.objectForm.reset();
  }

  resetForm() {
    this.objectForm.reset();
    this.createdObject = null;
  }
}
