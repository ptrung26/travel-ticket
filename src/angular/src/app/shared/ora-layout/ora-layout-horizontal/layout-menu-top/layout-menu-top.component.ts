import { AfterViewChecked, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CurrentUserDto } from '@app/shared/service-proxies/danh-muc-service-proxies';
import { NavigationEnd, Router } from '@node_modules/@angular/router';

@Component({
  selector: 'layout-menu-top',
  templateUrl: './layout-menu-top.component.html',
  styleUrls: ['./layout-menu-top.component.scss'],
})
export class LayoutMenuTopComponent implements OnInit, AfterViewChecked, OnChanges {
  @ViewChild('btnRight') btnRight: any;
  @ViewChild('btnLeft') btnLeft: any;
  @Input() menusCongViec: any[];
  @Input() menusDM: any[]; // danh mục
  @Input() menusQT: any[]; // quản trị 
  @Input() menusSP: any[]; // sản phẩm
  @Input() menusKH: any[]; // khách hàng
  @Input() menusBK: any[]; // khách hàng
  @Input() currentUser: CurrentUserDto;
  isAdmin: boolean = false;
  isClient: boolean = false;
  listMenuActive = [
    {
      key: 5,
      url: '/cong-viec/',
    },
    {
      key: 6,
      url: '/danh-muc/',
    },
    {
      key: 5,
      url: '/admin/',
    },
    {
      key: 1,
      url: '/san-pham/',
    },
    {
      key: 2,
      url: '/khach-hang/',
    },
    {
      key: 3,
      url: '/booking/',
    },
    {
      key: 7,
      url: '/home'
    },
    {
      key: 8,
      url: '/home/filter-tour'
    },
    {
      key: 9,
      url: '/home/about-me'
    },
    {
      key: 10,
      url: '/home/my-booking'
    },
    {
      key: 11,
      url: '/dashboard'
    }

  ];
  keyActive = null;

  constructor(private _router: Router) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.currentUser) {
      this.checkRole();
    }
  }

  ngOnInit(): void {
    this.activeMenuInit();
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const findItem = this.listMenuActive.find((x) => event.url.includes(x.url));
        console.log(findItem, event, this.listMenuActive);
        if (findItem) {
          this.keyActive = findItem.key;
        } else {
          this.keyActive = null;
        }
      }
    });

    this.checkRole();


  }

  ngAfterViewChecked(): void {
    this.showHideButton();
    window.onresize = this.showHideButton;
  }

  activeMenuInit() {
    const findItem = this.listMenuActive.find((x) => document.location.pathname.includes(x.url));
    if (findItem) {
      this.keyActive = findItem.key;
    }
  }

  //Prev/Next button
  showHideButton() {
    const menu = document.querySelector('ul[menulayouthorizontal]') as HTMLUListElement;
    const clientWidth = menu.clientWidth;
    const scrollWidth = menu.scrollWidth;
    const scrollLeft = menu.scrollLeft;
    const width = menu.offsetWidth;
    if (scrollLeft) {
      this.hiddenButtonLeft(false);
      if (scrollWidth - width <= scrollLeft) {
        this.hiddenButtonRight(true);
      } else {
        this.hiddenButtonRight(false);
      }
    } else {
      if (clientWidth < scrollWidth) {
        this.hiddenButtonRight(false);
      } else {
        this.hiddenButtonRight(true);
      }
      this.hiddenButtonLeft(true);
    }
  }

  hiddenButtonLeft(hidden: boolean) {
    if (hidden) {
      this.btnLeft.elementRef.nativeElement.classList.remove('active');
    } else {
      this.btnLeft.elementRef.nativeElement.classList.add('active');
    }
  }

  hiddenButtonRight(hidden: boolean) {
    if (hidden) {
      this.btnRight.elementRef.nativeElement.classList.remove('active');
    } else {
      this.btnRight.elementRef.nativeElement.classList.add('active');
    }
  }

  handleButtonLeft() {
    const menu = document.querySelector('ul[menulayouthorizontal]') as HTMLUListElement;
    menu.scrollTo({
      top: 0,
      left: menu.scrollLeft - 400,
      behavior: 'smooth',
    });
    this.showHideButton();
  }

  handleButtonRight() {
    const menu = document.querySelector('ul[menulayouthorizontal]') as HTMLUListElement;
    menu.scrollTo({
      top: 0,
      left: menu.scrollLeft + 400,
      behavior: 'smooth',
    });
    this.showHideButton();
  }

  checkRole() {
    if (!this.currentUser) {
      this.isClient = false;
      this.isAdmin = false;
    } else {
      if (this.currentUser.roles.includes("KhachHang")) {
        this.isClient = true;
      }
      if (this.currentUser.roles.includes('admin')) {
        this.isAdmin = true;
      }
    }
  }
}
