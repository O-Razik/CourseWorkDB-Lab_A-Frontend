import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Client } from '../../../../../data/models/client';
import {OrderViewComponent} from "../../process-models/order-view/order-view.component";
import {ClientOrder} from '../../../../../data/models/client-order';
import {ClientOrderService} from '../../../../../data/services/client-order.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Sex } from '../../../../../data/models/sex';
import { ClientService } from '../../../../../data/services/client.service';
import { AuthService } from '../../../../../data/services/auth.service';
import { UserRole } from '../../../../../data/models/user-role';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';

@Component({
  selector: 'app-client-view',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    OrderViewComponent,
    FormsModule,
    ReactiveFormsModule,
    MatGridList,
    MatGridTile
  ],
  templateUrl: './client-view.component.html',
  styleUrls: ['./client-view.component.css'],
})
export class ClientViewComponent implements OnInit{
  @Input() client!: Client;
  @Output() clientUpdated = new EventEmitter<Client>();
  emptyListMessage: string = 'Клієнт не має жодного замовлення';
  cols: number = 2;

  clientOrders: ClientOrder[] = [];
  ordersStillLoading: boolean = true;
  @Input() showOrders: boolean = true;
  @Output() selected = new EventEmitter<Client>();

  isEditMode = false;
  editForm!: FormGroup;
  sexOptions: Sex[] = [];

  constructor(
    private clientOrderService: ClientOrderService,
    private clientService: ClientService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.cols = Math.floor(window.innerWidth / 300);
  }

  ngOnInit() {
    if(this.showOrders) {
      this.loadClientOrders();
    }
    this.cols = Math.floor(window.innerWidth / 300);
    this.initializeForm();
  }

  canEdit(): boolean {
    return this.authService.getCurrentUserRole() === UserRole.ADMIN  && this.showOrders;
  }

  initializeForm() {
    this.editForm = this.fb.group({
      firstName: [this.client.firstName, Validators.required],
      lastName: [this.client.lastName, Validators.required],
      sexId: [this.client.sex.sexId, Validators.required],
      birthdate: [this.formatDateForInput(this.client.birthdate), Validators.required],
      phoneNumber: [this.client.phoneNumber, [Validators.required, Validators.pattern(/^\+380\d{9}$/)]],
      email: [this.client.email, [Validators.required, Validators.email]]
    });
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  toggleEditMode(event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.loadSexOptions();
      this.initializeForm();
    }
  }

  loadSexOptions() {
    this.clientService.getSexes().subscribe({
      next: (sexes) => {
        this.sexOptions = sexes;
      },
      error: (err) => console.error('Failed to load sexes', err)
    });
  }

  saveChanges() {
    if (this.editForm.invalid) return;

    const formValue = this.editForm.value;
    const selectedSex = this.sexOptions.find(s => s.sexId == formValue.sexId);

    const updatedClient: Client = {
      ...this.client,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      sex: selectedSex || this.client.sex,
      birthdate: this.formatDateForInput(new Date(formValue.birthdate)),
      phoneNumber: formValue.phoneNumber,
      email: formValue.email
    };

    this.clientService.updateClient(updatedClient).subscribe({
      next: (updatedClient) => {
        this.client = updatedClient;
        this.isEditMode = false;
        this.clientUpdated.emit(updatedClient);
      },
      error: (err) => console.error('Failed to update client', err)
    });
  }

  loadClientOrders() {
    if (this.client) {
      this.clientOrderService.getClientOrdersByClientId(this.client.clientId).subscribe((orders) => {
        this.clientOrders = orders;
        this.ordersStillLoading = false;
      });
    }
  }

  onResize(event: any) {
    this.cols = Math.floor(event.target.innerWidth / 300);
  }

  trackByOrderId($index: number, order: ClientOrder) {
    return order.clientOrderId;
  }

  onClientClick() {
    this.selected.emit(this.client);
  }
}
