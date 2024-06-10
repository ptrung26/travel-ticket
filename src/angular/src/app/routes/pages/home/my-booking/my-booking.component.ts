import { Component, Injector, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PagedListingComponentBase, PagedRequestDto } from "@app/shared/common/paged-listing-component-base";
import { BookingServiceProxy, HuyBookingRequest, PagingListBookingRequest, ThongTinChungBookingDto } from "@app/shared/service-proxies/danh-muc-service-proxies";
import { UserSessionDto } from "@app/shared/service-proxies/tai-khoan-service-proxies";
import { ReuseTabService } from "@delon/abc/reuse-tab";
import { TitleService } from "@delon/theme";
import { DateTime } from 'luxon';
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
@Component({
    selector: 'my-booking',
    templateUrl: './my-booking.component.html',
    styleUrls: ['./my-booking.component.scss'],
})
export class MyBookingCompoennt extends PagedListingComponentBase<any> implements OnInit {
    rfForm: FormGroup;
    confirmModal?: NzModalRef;
    constructor(injector: Injector, private _bookingService: BookingServiceProxy, private fb: FormBuilder, private titleService: TitleService,
        private reuseService: ReuseTabService, private modal: NzModalService
    ) {
        super(injector);
        this.rfForm = this.fb.group({
            filter: "",
        })

        this.titleService.setTitle("Phiếu booking");
        this.reuseTabService.title = "Phiếu booking";
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.refresh();
        }, 1000)
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        const userSession = JSON.parse(sessionStorage.getItem("userSession")) as UserSessionDto
        if (userSession?.sysUserId) {
            const input = new PagingListBookingRequest();
            const formValue = this.rfForm.value;
            input.skipCount = this.skipCount;
            input.sorting = this.sorting;
            input.maxResultCount = request.maxResultCount;
            input.filter = formValue.filter;
            input.sysUerId = userSession.sysUserId;
            this._bookingService.paginglist(input).subscribe(res => {
                this.dataList = res.items;
                this.totalItems = res.totalCount;
                this.isTableLoading = false;
            })
        }

    }


    showConfirm(dataItem: ThongTinChungBookingDto): void {
        let datenow = DateTime.now();
        if (!dataItem.ngayLap) {
            dataItem.ngayLap = datenow;
        }
        let diffInHours = datenow.diff(dataItem.ngayLap, 'hours').hours;

        let message = diffInHours > 24 ? "Theo chính sách công ty, do bạn huỷ booking sau 24h nên chỉ được hoàn trả 80% thôi nhé!" : "Bạn được hoàn trả 100% phí dịch vụ, vui không nào!";
        this.confirmModal = this.modal.confirm({
            nzTitle: 'Bạn có chắc chắn muốn huỷ tour này?',
            nzContent: message,
            nzOnOk: () =>
                new Promise((resolve, reject) => {
                    const input = new HuyBookingRequest();
                    input.dto = dataItem;
                    input.isQuaHan = diffInHours > 24;
                    ora.notify.success("Chúng tôi sẽ gửi email trong giây lát!");
                    this._bookingService.xacnhanhuybooking(input).subscribe(
                        res => {
                            if (!res.isSuccessful) {
                                ora.notify.error(res.errorMessage);
                                reject(new Error(res.errorMessage));
                            }
                        },
                        error => {
                            reject(error);
                        }
                    );
                    resolve(true);
                }).then(() => {
                    this.confirmModal.destroy();
                }).catch(() => {

                })
        });

    }
}