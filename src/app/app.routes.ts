import {Routes} from '@angular/router';
import {AuthGuard} from './data/guards/auth.guard';
import {RoleGuard} from './data/guards/role.guard';
import {UserRole} from './data/models/user-role';

import {AnalysisListViewComponent} from './shared/views/list-views/analysis-list-view/analysis-list-view.component';
import {LaboratoryListViewComponent} from './shared/views/list-views/laboratory-list-view/laboratory-list-view.component';
import {OrderListViewComponent} from './shared/views/list-views/order-list-view/order-list-view.component';
import {EmployeeListViewComponent} from './shared/views/list-views/employee-list-view/employee-list-view.component';
import {ClientListViewComponent} from './shared/views/list-views/client-list-view/client-list-view.component';
import {AnalysisResultListViewComponent} from './shared/views/list-views/analysis-result-list-view/analysis-result-list-view.component';
import {InventoryInLaboratoryListViewComponent} from './shared/views/list-views/inventory-in-laboratory-list-view/inventory-in-laboratory-list-view.component';
import {InventoryOrderListViewComponent} from './shared/views/list-views/inventory-order-list-view/inventory-order-list-view.component';
import {BiomaterialCollectionListViewComponent} from './shared/views/list-views/biomaterial-collection-list-view/biomaterial-collection-list-view.component';
import {BiomaterialDeliveryListViewComponent} from './shared/views/list-views/biomaterial-delivery-list-view/biomaterial-delivery-list-view.component';
import {AuthPageComponent} from './shared/auth/auth-page/auth-page.component';
import {AdminDashboardComponent} from './admin/admin-dashboard/admin-dashboard.component';
import {AdminPageComponent} from './admin/admin-page/admin-page.component';
import {CashierPageComponent} from './cashier/cashier-page/cashier-page.component';
import {CashierDashboardComponent} from './cashier/cashier-dashboard/cashier-dashboard.component';
import {IManagerPageComponent} from './i-manager/i-manager-page/i-manager-page.component';
import {IManagerDashboardComponent} from './i-manager/i-manager-dashboard/i-manager-dashboard.component';
import {BmOperatorPageComponent} from './bm-operator/bm-operator-page/bm-operator-page.component';
import {BmOperatorDashboardComponent} from './bm-operator/bm-operator-dashboard/bm-operator-dashboard.component';
import {
  LaboratoryScheduleCreateViewComponent
} from './shared/generics/object-create/laboratory-schedule-create-view/laboratory-schedule-create-view.component';
import {
  AnalysisBiomaterialCreateViewComponent
} from './shared/generics/object-create/analysis-biomaterial-create-view/analysis-biomaterial-create-view.component';
import {InventoryListViewComponent} from './shared/views/list-views/inventory-list-view/inventory-list-view.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth'
  },
  {
    path: '1',
    pathMatch: 'full',
    component: LaboratoryScheduleCreateViewComponent,
  },
  {
    path: '2',
    pathMatch: 'full',
    component: AnalysisBiomaterialCreateViewComponent,
  },
  {
    path: 'auth',
    component: AuthPageComponent,
    data: { title: 'Авторизація' }
  },
  {
    path: 'admin',
    component: AdminPageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN] }, // Only allow access to admin role
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'analyses', component: AnalysisListViewComponent, data: { title: 'Аналізи' } },
      { path: 'laboratories', component: LaboratoryListViewComponent, data: { title: 'Лабораторії' } },
      { path: 'client-orders', component: OrderListViewComponent, data: { title: 'Замовлення клієнтів' } },
      { path: 'employees', component: EmployeeListViewComponent, data: { title: 'Співробітники' } },
      { path: 'clients', component: ClientListViewComponent, data: { title: 'Клієнти' } },
      { path: 'analysis-results', component: AnalysisResultListViewComponent, data: { title: 'Результати аналізів' } },
      { path: 'laboratory-inventory', component: InventoryInLaboratoryListViewComponent, data: { title: 'Інвентар лабораторій' } },
      { path: 'inventory', component: InventoryListViewComponent, data: { title: 'Інвентар' } },
      { path: 'inventory-orders', component: InventoryOrderListViewComponent, data: { title: 'Замовлення інвентарю' } },
      { path: 'biomaterial-collections', component: BiomaterialCollectionListViewComponent, data: { title: 'Збори біоматеріалів' } },
      { path: 'biomaterial-deliveries', component: BiomaterialDeliveryListViewComponent, data: { title: 'Доставки біоматеріалів' } },
      { path: 'dashboard', component: AdminDashboardComponent, data: { title: 'Панель адміністратора' } }
    ]
  },
  {
    path: 'cashier',
    component: CashierPageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.CASHIER] }, // Only allow access to cashier role
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: CashierDashboardComponent, data: { title: 'Панель касира' } },
      { path: 'analyses', component: AnalysisListViewComponent, data: { title: 'Аналізи' } },
      { path: 'laboratories', component: LaboratoryListViewComponent, data: { title: 'Лабораторії' } },
      { path: 'client-orders', component: OrderListViewComponent, data: { title: 'Замовлення' } },
      { path: 'clients', component: ClientListViewComponent, data: { title: 'Клієнти' } },
      { path: 'analysis-results', component: AnalysisResultListViewComponent, data: { title: 'Результати аналізів' } },
      { path: 'laboratory-inventory', component: InventoryInLaboratoryListViewComponent, data: { title: 'Лабораторні запаси' } }
    ]
  },
  {
    path: 'i-manager',
    component: IManagerPageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.INVENTORY_MANAGER] }, // Only allow access to inventory manager role
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: IManagerDashboardComponent, data: { title: 'Панель інвентарного менеджера' } },
      { path: 'inventory-orders', component: InventoryOrderListViewComponent, data: { title: 'Замовлення інвентарю' } },
      { path: 'laboratory-inventory', component: InventoryInLaboratoryListViewComponent, data: { title: 'Інвентар лабораторій' } },
      { path: 'laboratories', component: LaboratoryListViewComponent, data: { title: 'Лабораторії' } },
      { path: 'inventory', component: InventoryListViewComponent, data: { title: 'Інвентар' } },
    ]
  },
  {
    path: 'bm-operator',
    component: BmOperatorPageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.BIOMATERIAL_OPERATOR] }, // Only allow access to biomaterial operator role
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: BmOperatorDashboardComponent, data: { title: 'Панель транспортера біоматеріалів' } },
      { path: 'biomaterial-collections', component: BiomaterialCollectionListViewComponent, data: { title: 'Збори біоматеріалів' } },
      { path: 'biomaterial-deliveries', component: BiomaterialDeliveryListViewComponent, data: { title: 'Доставки біоматеріалів' } },
      { path: 'laboratories', component: LaboratoryListViewComponent, data: { title: 'Лабораторії' } }
    ]
  }

];

