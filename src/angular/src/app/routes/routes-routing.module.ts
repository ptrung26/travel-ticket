import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '@app/routes/auth-guard.service';
// layout
import { LayoutBasicComponent } from '../shared/layout/basic/basic.component';
// pages
import { NotHavePermissionComponent } from '@app/routes/not-have-permission/not-have-permission.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotificationsComponent } from '@app/routes/notifications/notifications.component';
import { DashboardResolver } from './dashboard/dashboard.resolver';

const routes: Routes = [
  {
    path: '',
    component: LayoutBasicComponent,
    // component: OraLayoutVerticalComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        resolve: {
          hero: DashboardResolver,
        },
      },
      {
        path: 'admin',
        loadChildren: () => import('./pages/admin/admin.module').then((m) => m.AdminModule),
      },
      {
        path: 'danh-muc',
        loadChildren: () => import('./pages/danh-muc/danh-muc.module').then((m) => m.DanhMucModule),
        data: {
          preload: true,
          //  permission: 'DanhMucPermission'
        },
        canLoad: [AuthGuardService],
      },
      { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard', titleI18n: 'dashboard' } },
      { path: 'notifications', component: NotificationsComponent, data: { title: 'Thông báo' } },
      {
        path: 'not-permission',
        component: NotHavePermissionComponent,
        data: { title: 'Dashboard', titleI18n: 'dashboard' },
      },
      { path: 'exception', loadChildren: () => import('./exception/exception.module').then((m) => m.ExceptionModule) },
      {
        path: 'cong-viec',
        loadChildren: () => import('./pages/cong-viec/cong-viec.module').then((m) => m.CongViecModule),
        data: {
          preload: true,
        },
        canLoad: [AuthGuardService],
      },
    ],
  },
  {
    path: 'account',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [
    // RouterModule.forChild(routes),
    RouterModule.forRoot(routes, {
      useHash: false,
      // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // Pls refer to https://ng-alain.com/components/reuse-tab
      // scrollPositionRestoration: 'top',
      scrollPositionRestoration: 'disabled',
    }),
  ],
  exports: [RouterModule],
})
export class RouteRoutingModule {}
