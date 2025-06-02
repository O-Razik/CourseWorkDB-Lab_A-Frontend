// client-list-view.component.ts
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Client} from '../../../../data/models/client';
import {ClientFilter} from '../../../../data/filters/client-filter';
import {GenericListViewComponent} from '../../../generics/generic-list-view/generic-list-view.component';
import {ClientViewComponent} from '../../model-view/object-models/client-view/client-view.component';
import {ClientService} from '../../../../data/services/client.service';
import {MatButton} from '@angular/material/button';
import {SelectFilterComponent} from '../../../filters/select-filter/select-filter.component';
import {Sex} from '../../../../data/models/sex';
import {AuthService} from '../../../../data/services/auth.service';
import {UserRole} from '../../../../data/models/user-role';
import {ClientCreateViewComponent} from '../../../../admin/client-create-view/client-create-view.component';

@Component({
  selector: 'app-client-list-view',
  imports: [
    GenericListViewComponent,
    ClientViewComponent,
    MatButton,
    SelectFilterComponent,
    ClientCreateViewComponent
  ],
  templateUrl: './client-list-view.component.html',
  styleUrls: ['./client-list-view.component.css'],
  standalone: true,
})
export class ClientListViewComponent implements OnInit {
  // Configuration for generic list
  pageName: string = 'Клієнти';
  searchPlaceholder: string = 'Пошук за клієнтом';
  filtersTitle: string = 'Фільтри';
  emptyListMessage: string = 'Клієнтів не знайдено';

  // Data
  clients: Client[] = [];
  sexes: Sex[] = [];

  // Filters
  filter: ClientFilter = {
    pageNumber: 1,
    pageSize: 50,
    search: undefined,
    sexId: undefined
  };
  searchTerm: string = '';

  // Loading state
  isLoading = false;
  ifBeginLoading = true;

  // Pagination
  hasMore = true;

  // Getters
  @Input() filterShown: boolean = true;
  @Input() showOrders: boolean = true;
  @Output() clientSelected = new EventEmitter<Client>();

  get sexItems(): {id: number, name: string}[] {
    return this.sexes.map(sex => ({
      id: sex.sexId,
      name: sex.sexName
    }));
  }

  constructor(
    private clientService: ClientService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadSexes();
    this.loadClients();
  }

  loadClients() {
    this.isLoading = true;
    this.clientService.getClients(this.filter).subscribe({
      next: (newClients) => {
        this.clients = [...this.clients, ...newClients];
        this.hasMore = newClients.length === this.filter.pageSize;
        this.isLoading = false;
        if (this.ifBeginLoading) {
          this.ifBeginLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.ifBeginLoading = false;
      }
    });
  }

  loadSexes() {
    this.clientService.getSexes().subscribe({
      next: (sexes) => {
        this.sexes = sexes;
      },
      error: (error) => {
        console.error('Error loading sexes:', error);
      }
    });
  }

  loadMore() {
    if (this.hasMore && !this.isLoading) {
      this.filter.pageNumber++;
      this.loadClients();
    }
  }

  onSearch(searchTerm: string) {
    this.filter.search = searchTerm;
    this.filter.pageNumber = 1;
    this.clients = [];
    this.loadClients();
  }

  trackByClientId(index: number, client: Client): number {
    return client.clientId;
  }

  applyFilters() {
    this.filter.pageNumber = 1;
    this.clients = [];
    this.loadClients();
  }

  toggleSexes($event: number | string | null) {
    this.filter.sexId = $event === null ? undefined : Number($event);
    this.applyFilters();
  }

  onClientSelected(client: Client) {
    this.clientSelected.emit(client);
  }

  canCreate() {
    return this.authService.getCurrentUserRole() === UserRole.ADMIN;
  }
}
