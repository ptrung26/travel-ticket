import { Component, EventEmitter, Injector, Input, OnInit, Output } from "@angular/core";
import { PagedListingComponentBase, PagedRequestDto } from "@app/shared/common/paged-listing-component-base";
import { KhachHangDto, KhachHangServiceProxy, PagingListKhachHangRequest } from "@app/shared/service-proxies/san-pham-service-proxies";
import _ from "lodash";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
    selector: 'select-khach-hang',
    templateUrl: './select-khach-hang.component.html'
})
export class SelectKhachHangComponent extends PagedListingComponentBase<any> implements OnInit {

    @Output() luaChonEvent = new EventEmitter<KhachHangDto>();
    @Input() khachHangId?: number;
    tenKhachHang: string = "";
    isShow: boolean = false;
    isLoading: boolean = true;
    constructor(injector: Injector, private _dataService: KhachHangServiceProxy) {
        super(injector);
    }
    searchSubject = new Subject<string>();

    log(value: any) {
        console.log(value);
    }

    ngOnInit(): void {
        this.searchSubject.pipe(debounceTime(300)).subscribe((val) => {
            this.refresh();
        });

        const key = "listKhachHangKey"
        if (sessionStorage.getItem(key)) {
            this.isLoading = false;
            const { value, expiry } = JSON.parse(sessionStorage.getItem(key));
            const now = new Date();
            if (now.getTime() > expiry) {
                sessionStorage.removeItem(key);
                this.refresh();
            } else {
                this.dataList = _.cloneDeep(value);
                if (this.khachHangId) {
                    const filter = this.dataList.filter(x => x.id == this.khachHangId);
                    this.dataList = _.cloneDeep(filter);
                    this.tenKhachHang = filter[0].ten;
                }
                return;
            }
        } else {
            this.refresh();
        }
    }

    onInputChange(event: any) {
        this.searchSubject.next(event.target.value);
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        const input = new PagingListKhachHangRequest();
        input.filter = this.tenKhachHang;
        input.skipCount = this.skipCount;
        input.sorting = this.sorting;
        input.maxResultCount = request.maxResultCount;

        this._dataService.getlist(input).subscribe(res => {
            this.isLoading = false;
            this.dataList = _.cloneDeep(res.items);
            this.totalItems = res.totalCount;

            if (this.khachHangId) {
                const filter = this.dataList.filter(x => x.id == this.khachHangId);
                this.dataList = _.cloneDeep(filter);
                this.tenKhachHang = filter[0].ten;
                this.totalItems = filter.length;
            }
        })
    }

    luaChon(data: KhachHangDto) {
        this.tenKhachHang = data.ten;
        this.luaChonEvent.emit(data);
        this.isShow = false;
    }
}