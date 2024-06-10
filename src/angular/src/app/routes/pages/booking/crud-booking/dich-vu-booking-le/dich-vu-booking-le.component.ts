import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { PagedListingComponentBase, PagedRequestDto } from "@app/shared/common/paged-listing-component-base";
import { BookingServiceProxy, ChiTietDichVuLeBookingDto, PagingDichVuLeRequest, SendEmailLienHeNCCRequest } from "@app/shared/service-proxies/danh-muc-service-proxies";
import _ from "lodash";
import { finalize } from "rxjs/operators";
import { TemplateEmailDVCompoennt } from "../../lien-he-dat-dich-vu/template-email-dv/template-email-dv.component";

export interface NhaCungCapDVNode {
    nhaCungCapId: number | undefined;
    tenNhaCungCap: string | undefined;
    email: string | undefined;
    soDienThoai: string | undefined;
    ghiChu: string | undefined;
    trangThai: number;
    childrens: DichVuNCC[];
    expand?: boolean;
    nhaCungCapCode: string;
}

export interface DichVuNCC {
    tenDichVu: string;
    dichVuId: number;
    gia: number;
    loaiXe?: string;
    ngayThu: number;
    nhaCungCapCode: string;
    soCho?: string;

}
@Component({
    selector: 'dich-vu-booking-le',
    templateUrl: './dich-vu-booking-le.component.html',
    styleUrls: ['./dich-vu-booking-le.component.scss']
})
export class DichVuBookingLeComponent extends PagedListingComponentBase<any> implements OnInit, OnChanges {
    @Input() bookingId: number;
    nhaCungCapTree: NhaCungCapDVNode[];
    constructor(injector: Injector, private _bookingService: BookingServiceProxy) {
        super(injector);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.bookingId > 0) {
            this.refresh();
        }
    }

    ngOnInit(): void {
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        if (this.bookingId > 0) {
            const input = new PagingDichVuLeRequest();
            input.bookingid = this.bookingId;
            input.maxResultCount = request.maxResultCount;
            input.skipCount = request.skipCount;
            input.sorting = request.sorting;

            this._bookingService.paginglistdichvule(input).pipe(finalize(() => {
                ora.ui.clearBusy();
            })).subscribe(res => {
                this.dataList = res.items;
                this.totalItems = res.totalCount;

                this.generateTree();
            })
        }


    }

    generateTree() {
        const tree: NhaCungCapDVNode[] = [];
        this.dataList.forEach((item: ChiTietDichVuLeBookingDto) => {
            let existingNode = tree.find(node => node.nhaCungCapId === item.nhaCungCapId && node.nhaCungCapCode == item.nhaCungCapCode);
            if (existingNode) {
                const cNode: DichVuNCC = {
                    gia: item.donGia,
                    tenDichVu: item.tenDichVu,
                    dichVuId: item.dichVuId,
                    ngayThu: item.ngaythu,
                    nhaCungCapCode: item.nhaCungCapCode,
                    soCho: item.soChoNgoi,
                }
                existingNode.childrens.push(cNode);
            } else {
                const cNode: DichVuNCC = {
                    gia: item.donGia,
                    tenDichVu: item.tenDichVu,
                    dichVuId: item.dichVuId,
                    ngayThu: item.ngaythu,
                    nhaCungCapCode: item.nhaCungCapCode,
                    soCho: item.soChoNgoi,
                }

                const node: NhaCungCapDVNode = {
                    nhaCungCapId: item.nhaCungCapId,
                    tenNhaCungCap: item.tenNhaCungCap,
                    email: item.email,
                    soDienThoai: item.soDienThoai,
                    ghiChu: item.ghiChu,
                    trangThai: item.trangThai,
                    childrens: [cNode],
                    expand: false,
                    nhaCungCapCode: item.nhaCungCapCode,
                }

                tree.push(node);
            }
        });

        this.nhaCungCapTree = _.cloneDeep(tree);
    }


    sendEmail(nhaCungCapId: number, nhaCungCapCode: string) {
        const nhaCungCap = this.nhaCungCapTree.find(x => x.nhaCungCapId == nhaCungCapId && x.nhaCungCapCode == nhaCungCapCode);
        if (nhaCungCap) {
            this.modalHelper.create(
                TemplateEmailDVCompoennt,
                {
                    bookingId: this.bookingId,
                    dichVuNCC: nhaCungCap
                },
                {
                    size: 'xl',
                    includeTabs: false,
                    modalOptions: {
                        nzTitle: "Gửi email đặt dịch vụ nhà cung cấp"
                    },
                },
            ).subscribe((result) => {
                if (result) {
                    const input = new SendEmailLienHeNCCRequest();
                    input.email = nhaCungCap.email;
                    input.templateEmail = result;
                    input.bookingId = this.bookingId;
                    ora.ui.setBusy();
                    this._bookingService.sendemaillienhencc(input).subscribe(res => {
                        ora.ui.clearBusy();
                        if (res.isSuccessful) {
                            ora.notify.success("Liên hệ đặt dịch vụ nhà cung cấp thành công!");
                            nhaCungCap.trangThai = 2;

                        } else {
                            ora.notify.error(res.errorMessage);
                        }
                    })
                }
            });
        }

    }



}