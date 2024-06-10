import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppConsts } from '@app/shared/AppConsts';
import {
    CreateOrUpdateTourSanPhamRequest,
    GetTourSanPhamByIdRequest,
    TourSanPhamDto,
    TourSanPhamServiceProxy,
} from '@app/shared/service-proxies/san-pham-service-proxies';
import { ApiNameConfig } from '@app/shared/service-proxies/service-url-config/url-services';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'crud-tour-san-pham',
    templateUrl: './crud-tour-san-pham.component.html',
    styleUrls: ['./crud-tour-san-pham.component.scss']
})
export class CrudTourSanPhamComponent implements OnInit {
    rfForm: FormGroup;
    @Input() id?: number;
    @Output() closeEvent = new EventEmitter();
    private _title: string = 'Thêm mới tour du lịch';
    public get title(): string {
        return this._title;
    }
    public set title(value: string) {
        this._title = value;
    }
    data?: TourSanPhamDto;
    oldFileUrl = '';
    uploadUrl = "";
    path = '';
    imageUrl?: string;
    loadingImg = false;

    constructor(private fb: FormBuilder, private _dataService: TourSanPhamServiceProxy, private _httpClient: HttpClient) {
        this.rfForm = this.fb.group({
            ma: [''],
            ten: [''],
            loaiHinhDuLichCode: [''],
            soNgay: [null],
            soDem: [null],
            quocGiaId: [null],
            tinhId: [null],
            diemKhoiHanh: [''],
            diemDen: [''],
            ghiChu: [''],
            tinhTrang: [1],
            loaiTourCode: [''],
            tepDinhKemJson: [''],
            urlAnhBia: [''],
        });
    }
    ngOnInit(): void {
        this.uploadUrl = AppConsts.abpEnvironment.apis.sanPham.url + `/api/${ApiNameConfig.sanPham.apiName}/file/UploadAnhV2?oldFileUrl=${this.oldFileUrl}`;
        if (this.id) {
            this.title = 'Chỉnh sửa thông tin tour';
            const input = new GetTourSanPhamByIdRequest();
            input.id = this.id;
            ora.ui.setBusy();
            this._dataService.getbyid(input).subscribe((res) => {
                ora.ui.clearBusy();
                if (res.isSuccessful) {
                    this.data = res.dataResult;
                    this.rfForm.patchValue(this.data);
                    this.oldFileUrl = this.data.urlAnhBia;
                    this.viewImageInit();

                    this.rfForm.patchValue(this.data);
                } else {
                    ora.notify.error(res.errorMessage);
                }
            });
        }
    }

    close() {
        this.closeEvent.emit();
    }

    save() {
        if (this.rfForm.invalid) {
            for (let i in this.rfForm.controls) {
                this.rfForm.controls[i].markAsDirty();
                this.rfForm.controls[i].updateValueAndValidity();
            }
            ora.notify.error('Vui lòng xem lại thông tin!');
        } else {
            const input = new CreateOrUpdateTourSanPhamRequest();
            Object.assign(input, this.rfForm.value);
            input.urlAnhBia = this.oldFileUrl;
            if (this.data?.id > 0) {
                input.id = this.data.id;
                input.thanhTienKhoangNguoiJson = this.data.thanhTienKhoangNguoiJson;
            }
            ora.ui.setBusy();
            this._dataService
                .createorupdate(input)
                .pipe(
                    finalize(() => {
                        ora.ui.clearBusy();
                    }),
                )
                .subscribe((res) => {
                    if (res.isSuccessful) {
                        if (this.id) {
                            ora.notify.success('Chỉnh sửa thành công');
                        } else {
                            ora.notify.success('Thêm mới thành công');
                            this.close()
                        }
                        this.close();
                    } else {
                        ora.notify.error(res.errorMessage);
                    }
                });
        }
    }

    viewImageInit() {
        const type = this.getFileType();
        this._dataService
            .viewimage(this.data.urlAnhBia, type)
            .pipe(
                finalize(() => {
                    ora.ui.clearBusy();
                }),
            )
            .subscribe((res) => {
                if (res.isSuccessful) {
                    this.getPathAndUpdateUrl(this.oldFileUrl);
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
        return this.data.urlAnhBia.substring(this.data.urlAnhBia.lastIndexOf('.') + 1);
    }

    getPathAndUpdateUrl(oldFilePath: string) {
        this.oldFileUrl = oldFilePath;
        this.uploadUrl = AppConsts.abpEnvironment.apis.sanPham.url + `/api/${ApiNameConfig.sanPham.apiName}/file/uploadhinhanhv2?oldFileUrl=${this.oldFileUrl}`;
    }

    beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
        new Observable((observer: Observer<boolean>) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                ora.notify.error('Vui lòng tải lên ảnh có định dạng png, jpg');
                observer.complete();
                return;
            }
            const isLt2M = file.size! / 1024 / 1024 <= 2;
            if (!isLt2M) {
                ora.notify.error('Hình ảnh tải lên không quá 2MB!');
                observer.complete();
                return;
            }
            observer.next(isJpgOrPng && isLt2M);
            observer.complete();
        });


    private getBase64(img: File, callback: (img: string) => void): void {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result!.toString()));
        reader.readAsDataURL(img);
    }


    handleChange(info: { file: NzUploadFile }): void {
        switch (info.file.status) {
            case 'uploading':
                this.loadingImg = true;
                break;
            case 'done':
                this.getPathAndUpdateUrl(info.file?.response?.result?.lstDataResult[0]?.path);
                this.getBase64(info.file!.originFileObj!, (img: string) => {
                    this.loadingImg = false;
                    this.imageUrl = img;

                    this.oldFileUrl = info.file?.response?.result?.lstDataResult[0]?.path;
                });
                break;
            case 'error':
                ora.notify.error('Tài liệu tải lên không thành công!');
                break;
        }
    }
}
