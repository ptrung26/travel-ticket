import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RegisterComponent } from './register/register.component';
import { DataCommonModule } from '@app/shared/data-common/data-common.module';
import { SharedModule } from '@app/shared/shared.module';
import {ForgotPasswordComponent, } from '@app/routes/auth/forgotpassword/forgotpassword.component';
import { ResetPasswordComponent } from '@app/routes/auth/resetpassword/resetpassword.component';

@NgModule({
  declarations: [LoginComponent, AuthComponent, RegisterComponent, ForgotPasswordComponent, ResetPasswordComponent],
  imports: [
    CommonModule,
    DataCommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NzSpinModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    SharedModule,
  ],

  providers: [],
})
export class AuthModule {}
