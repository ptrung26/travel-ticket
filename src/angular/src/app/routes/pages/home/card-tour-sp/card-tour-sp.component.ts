import { HttpClient } from "@angular/common/http";
import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { AppConsts } from "@app/shared/AppConsts";
import { TourSanPhamDto, TourSanPhamServiceProxy } from "@app/shared/service-proxies/san-pham-service-proxies";
import { ApiNameConfig } from "@app/shared/service-proxies/service-url-config/url-services";
import { ThanhTienKhoangNguoi } from "../../san-pham/tour-san-pham/chiet-tinh-tour/chiet-tinh-xe/chiet-tinh-xe.component";

@Component({
    selector: 'card-tour-san-pham',
    templateUrl: './card-tour-sp.component.html',
    styleUrls: ['./card-tour-sp.component.scss'],
})
export class CardTourSanPhamComponent implements OnChanges, OnInit {
    @Input() tour: TourSanPhamDto;
    imageUrl: string = "";
    giaTien: number = 0;
    constructor(private _dataService: TourSanPhamServiceProxy, private _httpClient: HttpClient) {

    }
    ngOnInit(): void {
        this.giaTien = this.getTongTien1Nguoi(this.tour);
    }

    getTongTien1Nguoi(data: TourSanPhamDto): number {
        if (!data || !data.thanhTienKhoangNguoiJson) {
            return 0;
        }

        const thanhTien: ThanhTienKhoangNguoi[] = JSON.parse(data.thanhTienKhoangNguoiJson) as ThanhTienKhoangNguoi[];
        const khoangNguoi1 = thanhTien?.find(x => x.khoangNguoiCode == "1Nguoi");
        if (khoangNguoi1) {
            return khoangNguoi1.thanhTien;
        }

        return 0;
    }


    ngOnChanges(changes: SimpleChanges): void {
        if (this.tour?.urlAnhBia) {
            this.viewImageInit();
        }
    }


    viewImageInit() {
        const type = this.getFileType();
        this._dataService
            .viewimage(this.tour.urlAnhBia, type)
            .subscribe((res) => {
                if (res.isSuccessful) {
                    const imageViewUrl = AppConsts.abpEnvironment.apis.sanPham.url + `/api/${ApiNameConfig.sanPham.apiName}/file/gotoview/${res.dataResult.fileToken}`;
                    this._httpClient.get(imageViewUrl, { responseType: 'arraybuffer' })
                        .subscribe((data) => {
                            const blob = new Blob([data], { type: res.dataResult.fileType });
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                this.imageUrl = reader.result as string;
                            };
                            reader.readAsDataURL(blob);
                        });
                }
            })
    }

    getFileType() {
        return this.tour.urlAnhBia.substring(this.tour.urlAnhBia.lastIndexOf('.') + 1);
    }
}