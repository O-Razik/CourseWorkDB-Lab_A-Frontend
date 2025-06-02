import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { GenericObjectCreateViewComponent } from '../../shared/generics/object-create/generic-object-create-view/generic-object-create-view.component';
import { Sex } from '../../data/models/sex';
import { ClientService } from '../../data/services/client.service';
import {Client} from '../../data/models/client';
import {ClientViewComponent} from '../../shared/views/model-view/object-models/client-view/client-view.component';

@Component({
  selector: 'app-client-create-view',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericObjectCreateViewComponent, ClientViewComponent],
  templateUrl: './client-create-view.component.html',
  styleUrls: ['./client-create-view.component.css']
})
export class ClientCreateViewComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);

  @Input() sexes: Sex[] = [];

  isLoading = false;
  createdClient: any = null;

  clientForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    sexId: [null, Validators.required],
    birthdate: ['', Validators.required],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit(): void {
    if (this.sexes.length === 0) {
      this.clientService.getSexes().subscribe({
        next: (sexes) => {
          this.sexes = sexes;
        }
      });
    }
  }

  get sexOptions(): { value: number; label: string }[] {
    return this.sexes.map(sex => ({ value: sex.sexId, label: sex.sexName }));
  }

  showConfirmation = false;

  onSubmit(): void {
    if (this.clientForm.valid) {
      this.isLoading = true;
      const data = this.clientForm.value;
      const client: Client = {
        clientId: 0,
        firstName: data.firstName,
        lastName: data.lastName,
        sexId: data.sexId,
        birthdate: data.birthdate,
        phoneNumber: data.phoneNumber,
        email: data.email,
        sex: this.sexes[data.sexId-1],
      }

      this.clientService.addClient(client).subscribe({
        next: (created) => {
          this.createdClient = created;
          this.showConfirmation = true;
          this.clientForm.reset();
          this.isLoading = false;
        },
        error: () => {
          // handle error as needed
          this.isLoading = false;
        }
      });
    }
  }

  onConfirmationClosed(): void {
    this.showConfirmation = false;
    this.clientForm.reset();
  }
}
