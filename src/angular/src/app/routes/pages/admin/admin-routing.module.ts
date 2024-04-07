import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationUnitsComponent } from './organization-units/organization-units.component';
import { RoleCoSoComponent } from './quan-tri-role-user/role-co-so/role-co-so.component';
import { UserCoSoComponent } from './quan-tri-role-user/user-co-so/user-co-so.component';
import { SettingManagementComponent } from '@app/routes/pages/admin/setting-management/setting-management.component';

const routes: Routes = [
  {
    path: 'users',
    component: UserCoSoComponent,
    data: { permission: 'AbpIdentity.Users' },
  },
  {
    path: 'roles',
    component: RoleCoSoComponent,
    data: { permission: 'AbpIdentity.Roles' },
  },
  {
    path: 'organization-units',
    component: OrganizationUnitsComponent,
    data: { permission: 'AbpIdentity.OrganizationUnits' },
  },
  {
    path: 'setting-management',
    component: SettingManagementComponent,
    data: { permission: 'AbpIdentity.SettingManagement' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {
}
