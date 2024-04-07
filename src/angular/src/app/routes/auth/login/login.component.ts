import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap } from 'rxjs/operators';
import { tap } from '@node_modules/rxjs/internal/operators';
import { TokenStorageService } from '@app/routes/auth/services/token.service';
import { AccountServiceProxy, Body } from '@service-proxies/danh-muc-service-proxies';
import { Store } from '@node_modules/@ngxs/store';
import { GetUserSession } from '@app/stores/app-session/action';
import { UrlServices } from '@app/shared/service-proxies/service-url-config/url-services';
import { TitleService } from '@delon/theme';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading$ = new BehaviorSubject(false);
  passwordVisible = false;
  linkForgotPassword = UrlServices.identityUrl() + '/Account/ForgotPassword';
  linkVanDeThuongGap = 'http://qcc-web.orenda.vn/vi/faqs/';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private account_SP: AccountServiceProxy,
    private store: Store,
    private titleSrv: TitleService,
  ) {}

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.titleSrv.setTitle('Đăng nhập');
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      userName: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  submit() {
    ora.ui.setBusy();
    const input: Body = new Body();
    const value = this.loginForm.getRawValue();
    input.userName = value.userName;
    input.password = value.password;
    this.account_SP
      .login(input)
      .pipe(
        tap((result) => {
          if (result.isSuccessful) {
            this.tokenStorageService.saveToken(result.authJwtDto.access_token);
            this.tokenStorageService.saveRefreshToken(result.authJwtDto.refresh_token);
          } else {
            ora.notify.error(result.errorMessage, 'Đăng nhập thất bại');
          }
        }),
        switchMap(() => {
          return this.store.dispatch(new GetUserSession());
        }),
        finalize(() => {
          ora.ui.clearBusy();
        }),
      )
      .subscribe(
        () => {
          this.router.navigateByUrl('/');
        },
        (error) => {
          ora.notify.error('Tên đăng nhập hoặc mật khẩu không đúng!', 'Đăng nhập thất bại');
          throw error;
        },
      );
    // this.isLoading$.next(true);
    // const input = new Body();
    // input.userName = this.loginForm.value.userName;
    // input.password = this.loginForm.value.password;
    // this.account_SP.login(input).pipe(tap(result => {
    //   this.tokenStorageService.saveToken(result.access_token);
    //   this.tokenStorageService.saveRefreshToken(result.refresh_token);
    // }), switchMap(() => {
    //   return this.userSessionService.getAccountBootstrap();
    // }), finalize(() => {
    //   this.isLoading$.next(false);
    // })).subscribe(() => {
    //   this.router.navigateByUrl('/');
    //
    // });
  }

  keyDownHandler(event) {
    if (event.which === 32) {
      event.preventDefault();
    }
  }
}
