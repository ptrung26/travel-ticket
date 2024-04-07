import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ListUserNotInOrganizationunitModalComponent } from '@app/routes/pages/admin/organization-units/organization-units-user/modal/list-user-not-in-organizationunit-modal.component';
import { OraTableModule } from '@app/shared/customize-comp/ora-table/ora-table.module';
// import { CreateOrEditRoleComponent } from '@app/routes/pages/admin/roles/create-or-edit.component';
// import { UsersComponent } from '@app/routes/pages/admin/users/users.component';
import { NzEmptyModule } from '@node_modules/ng-zorro-antd/empty';
import { NzSwitchModule } from '@node_modules/ng-zorro-antd/switch';
import { NzTreeModule } from '@node_modules/ng-zorro-antd/tree';
import { CustomizeCompModule } from '@shared/customize-comp/customize-comp.module';
// import { CreateOrEditUserComponent } from './users/create-or-edit.component';
// import { RolesCheckBoxComponent } from './users/roles-check-box/roles-check-box.component';
// import { RolesComponent } from './roles/roles.component';
// import { UpdatePermissionsComponent } from './update-permissions/update-permissions.component';
// import { PermissionTreeComponent } from './update-permissions/permission-tree/permission-tree.component';
// import { ChangePasswordModalComponent } from './users/change-password-modal/change-password-modal.component';
import { OrganizationUnitsServicesService } from '@app/routes/pages/admin/organization-units/organization-units-services.service';
import { SettingManagementComponent } from '@app/routes/pages/admin/setting-management/setting-management.component';
import { CreateOrEditTextTemplateComponent } from '@app/routes/pages/admin/setting-management/text-template/create-or-edit.component';
import { TextTemplateComponent } from '@app/routes/pages/admin/setting-management/text-template/text-template.component';
import { MenuService } from '@node_modules/ng-zorro-antd/menu';
import { NzUploadModule } from '@node_modules/ng-zorro-antd/upload';
import { DataCommonModule } from '@shared/data-common/data-common.module';
import { SharedModule } from '@shared/shared.module';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { TreeModule } from 'primeng/tree';
import { AdminRoutingModule } from './admin-routing.module';
import { CreateOrUpdateOrganizationUnitsModalComponent } from './organization-units/modal/create-or-update-modal.component';
import { OrganizationUnitUserComponent } from './organization-units/organization-units-user/organization-units-user.component';
import { OrganizationUnitsComponent } from './organization-units/organization-units.component';
import { PermissionGrantForRoleComponent } from './quan-tri-role-user/role-co-so/permission-grant-for-role/permission-grant-for-role.component';
import { PermissionTreeComponent } from './quan-tri-role-user/role-co-so/permission-tree/permission-tree.component';
import { RoleCoSoComponent } from './quan-tri-role-user/role-co-so/role-co-so.component';
import { UpsertRoleCoSoComponent } from './quan-tri-role-user/role-co-so/upsert-role-co-so/upsert-role-co-so.component';
import { ChangePwdUserAdminComponent } from './quan-tri-role-user/user-co-so/modal/change-pwd-user-admin.component';
import { CreateOrUpdateUserModalComponent } from './quan-tri-role-user/user-co-so/modal/create-or-update-user-modal.component';
import { PermissionTreeUserComponent } from './quan-tri-role-user/user-co-so/modal/permission-tree-user/permission-tree-user.component';
import { ChangePwdComponent } from './quan-tri-role-user/user-co-so/user-co-so-detail-right/change-pwd.component';
import { PermissionForRoleModalComponent } from './quan-tri-role-user/user-co-so/user-co-so-detail-right/phan-quyen-user/permission-for-role-modal.component';
import { PhanQuyenUserComponent } from './quan-tri-role-user/user-co-so/user-co-so-detail-right/phan-quyen-user/phan-quyen-user.component';
import { UserCoSoComponent } from './quan-tri-role-user/user-co-so/user-co-so.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    CustomizeCompModule,
    NzEmptyModule,
    NzTreeModule,
    NzTreeViewModule,
    DataCommonModule,
    NzSwitchModule,
    TreeModule,
    OraTableModule,
    NzUploadModule,
  ],
  declarations: [
    PermissionForRoleModalComponent,
    ChangePwdComponent,
    PermissionTreeComponent,
    RoleCoSoComponent,
    PermissionGrantForRoleComponent,
    UpsertRoleCoSoComponent,
    UserCoSoComponent,
    PhanQuyenUserComponent,
    CreateOrUpdateUserModalComponent,
    ChangePwdUserAdminComponent,
    CreateOrUpdateOrganizationUnitsModalComponent,
    OrganizationUnitsComponent,
    OrganizationUnitUserComponent,
    ListUserNotInOrganizationunitModalComponent,
    PermissionTreeUserComponent,
    SettingManagementComponent,
    TextTemplateComponent,
    CreateOrEditTextTemplateComponent,
  ],
  providers: [MenuService, OrganizationUnitsServicesService],
})
export class AdminModule {}
