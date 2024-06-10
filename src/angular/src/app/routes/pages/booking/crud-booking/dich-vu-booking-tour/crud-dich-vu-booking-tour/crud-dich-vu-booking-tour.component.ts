import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThanhTienKhoangNguoi } from "@app/routes/pages/san-pham/tour-san-pham/chiet-tinh-tour/chiet-tinh-xe/chiet-tinh-xe.component";
import { ISelectOption } from "@app/shared/data-common/ora-select/model";
import { BookingServiceProxy, ChiTietDichVuBookingTourDto, DichVuBookingTourDto, ThongTinChungBookingDto } from "@app/shared/service-proxies/danh-muc-service-proxies";
import { GetTourSanPhamByIdRequest, TourSanPhamDto, TourSanPhamServiceProxy } from "@app/shared/service-proxies/san-pham-service-proxies";
import { Observable } from "rxjs";
import { DateTime } from 'luxon';
import { finalize } from "rxjs/operators";
export interface KhoangNguoi {
    khoangNguoi: number;
    khoangNguoiCode: string;
    giaNett: number;
}

@Component({
    selector: 'crud-dich-vu-booking-tour',
    templateUrl: './crud-dich-vu-booking-tour.component.html',
    styleUrls: ['./crud-dich-vu-booking-tour.component.scss'],
})
export class CrudDichVuBookingTourComponent implements OnInit {
    @Input() dichVuTour: DichVuBookingTourDto;
    @Input() tourSp: TourSanPhamDto;
    @Input() thongTinChung: ThongTinChungBookingDto;
    @Output() navigateEvt = new EventEmitter<DichVuBookingTourDto>();
    @Output() saveEvt = new EventEmitter<DichVuBookingTourDto>();
    isShowForm: boolean = false;
    khoangNguoi: KhoangNguoi[] = [];
    khoangNguoiCbb: Observable<ISelectOption[]>;
    rfForm: FormGroup;

    constructor(private fb: FormBuilder, private _dataService: BookingServiceProxy, private _tourService: TourSanPhamServiceProxy) {
    }

    get currentData() {
        this.patchValue();
        return this.dichVuTour;
    }

    get listChiTietDV(): FormArray {
        return this.rfForm.get("listChiTiet") as FormArray;
    }


    ngOnInit(): void {
        if (this.dichVuTour?.tourId) {
            ora.ui.setBusy();
            const input = new GetTourSanPhamByIdRequest();
            input.id = this.dichVuTour.tourId;
            this._tourService.getbyid(input).pipe(finalize(() => {
                ora.ui.clearBusy();
            })).subscribe(res => {
                if (res.isSuccessful) {
                    const tour = res.dataResult;
                    const khoangNguoiArr = JSON.parse(tour.thanhTienKhoangNguoiJson) as ThanhTienKhoangNguoi[];
                    this.processKhoangNguoiArr(khoangNguoiArr);
                    this.isShowForm = true;
                }
            });
        } else {
            const khoangNguoiArr = JSON.parse(this.tourSp?.thanhTienKhoangNguoiJson) as ThanhTienKhoangNguoi[];
            this.processKhoangNguoiArr(khoangNguoiArr);
            this.isShowForm = true;
        }

    }


    processKhoangNguoiArr(khoangNguoiArr: ThanhTienKhoangNguoi[]) {
        khoangNguoiArr.forEach(it => {
            let kn: KhoangNguoi = {
                khoangNguoi: 0,
                khoangNguoiCode: "",
                giaNett: 0,
            };
            switch (it.khoangNguoiCode) {
                case "1Nguoi": {
                    kn.khoangNguoi = 1;
                    break;
                }
                case "5Nguoi": {
                    kn.khoangNguoi = 5;
                    break;
                }
                case "10Nguoi": {
                    kn.khoangNguoi = 10;
                    break;
                }
            }
            kn.khoangNguoiCode = it.khoangNguoiCode;
            kn.giaNett = it.thanhTien;
            this.khoangNguoi.push(kn);
        });
        this.khoangNguoi.sort((a, b) => b.khoangNguoi - a.khoangNguoi);
        this.initForm();
    }


    initForm() {
        this.rfForm = this.fb.group({
            tenTour: [this.tourSp?.ten],
            tourId: [this.tourSp?.id],
            ngayBatDau: [null],
            ngayKetThuc: [{ value: null, disabled: true }],
            soNgay: [{ value: this.tourSp?.soNgay, disabled: true }],
            soLuongNguoiLon: [{ value: 1, disabled: this.thongTinChung.loaiKhachHangCode == "CaNhan" }, [Validators.required]],
            diemDen: [null],
            gioDon: [null],
            listChiTiet: this.fb.array([])
        });

        // Khởi tạo form và các chi tiết
        if (this.dichVuTour?.id > 0) {
            this.rfForm.patchValue(this.dichVuTour);

            if (this.rfForm.value.ngayBatDau) {
                let ngayBatDau = this.rfForm.value.ngayBatDau as DateTime;
                let soNgay = +this.rfForm.get("soNgay").value;
                let ngayKetThuc = ngayBatDau.plus({ days: soNgay });
                this.rfForm.get('ngayKetThuc').setValue(ngayKetThuc)
            }
        }
        this.initChiTiet();

        // Cập nhật giá tiền mỗi khi số lượng người thay đổi
        this.rfForm.get("soLuongNguoiLon").valueChanges.subscribe(val => {
            let giaNett = 0;
            for (let i = this.khoangNguoi.length - 1; i >= 0; i--) {
                if (+val <= +this.khoangNguoi[i].khoangNguoi) {
                    giaNett = this.khoangNguoi[i].giaNett;
                    break;
                }
            }
            this.updateThanhTien(giaNett, +val);
        })

        // Cập nhật "Ngày kết thúc" theo "Ngày bắt đầu" và số ngày của tour
        this.rfForm.get("ngayBatDau").valueChanges.subscribe((val: DateTime) => {
            let soNgay = +this.rfForm.get("soNgay").value;
            let ngayKetThuc = val.plus({ days: soNgay });
            this.rfForm.get("ngayKetThuc").setValue(ngayKetThuc);
        })


    }

    updateThanhTien(giaNett: number, sl: number) {
        this.listChiTietDV.controls.forEach(it => {
            if (giaNett > 0) {
                it.get("giaNett").setValue(giaNett);
                it.get("giaBan").setValue(giaNett);
            }

            let gia = it.get("giaBan").value;
            it.get("soLuong").setValue(sl);
            it.get("thanhTien").setValue(gia * sl);
        })
    }

    initChiTiet() {
        if (this.dichVuTour?.id > 0) {
            this.dichVuTour.listChiTiet.forEach(ct => {
                const group = this.fb.group({
                    id: [ct.id],
                    giaNett: [{ value: ct.giaNett, disabled: true }],
                    giaBan: [ct.giaBan, [Validators.required]],
                    loaiDoTuoi: [ct.loaiDoTuoi, [Validators.required]],
                    soLuong: [{ value: ct.soLuong, disabled: true }],
                    thanhTien: [ct.thanhTien],
                });

                group.get('giaBan').valueChanges.subscribe(giaBan => {
                    if (giaBan > 0) {
                        const soLuong = group.get('soLuong').value;
                        group.get('thanhTien').setValue(soLuong * giaBan);
                    }
                });

                this.listChiTietDV.push(group);
            });
        } else {
            const group = this.fb.group({
                id: [0],
                giaNett: [this.khoangNguoi[0].giaNett],
                giaBan: [this.khoangNguoi[0].giaNett],
                loaiDoTuoi: ["Người lớn"],
                soLuong: [{ value: 1, disabled: true }],
                thanhTien: [this.khoangNguoi[0].giaNett],
            });

            // Cập nhật thành tiền mỗi khi giá bán thay đổi
            group.get('giaBan').valueChanges.subscribe(giaBan => {
                if (giaBan > 0) {
                    const soLuong = group.get('soLuong').value;
                    group.get('thanhTien').setValue(soLuong * giaBan);
                }
            });

            // Cập nhật giá tiền ban đầu
            let giaNett = 0;
            let sl = group.getRawValue().soLuong;
            for (let i = this.khoangNguoi.length - 1; i >= 0; i--) {
                if (+sl <= +this.khoangNguoi[i].khoangNguoi) {
                    giaNett = this.khoangNguoi[i].giaNett;
                    break;
                }
            }
            if (giaNett > 0) {
                group.get('giaBan').setValue(giaNett);
                group.get('giaNett').setValue(giaNett);
                group.get('thanhTien').setValue(sl * giaNett);
            }

            this.listChiTietDV.push(group);
        }

    }

    navigate() {
        this.patchValue();
        this.navigateEvt.emit(this.dichVuTour);
    }



    save() {
        this.patchValue();
        this.saveEvt.emit(this.dichVuTour);
    }

    patchValue() {
        if (!this.dichVuTour) {
            this.dichVuTour = new DichVuBookingTourDto();
        }
        Object.assign(this.dichVuTour, this.rfForm.value as DichVuBookingTourDto);
        const listChiTiet: ChiTietDichVuBookingTourDto[] = [];
        this.rfForm.getRawValue().listChiTiet.forEach(it => {
            const ct = new ChiTietDichVuBookingTourDto();
            if (it.id > 0) {
                ct.id = it.id;
            }
            ct.giaBan = it.giaBan;
            ct.giaNett = it.giaNett;
            ct.thanhTien = it.thanhTien;
            ct.loaiDoTuoi = it.loaiDoTuoi;
            ct.soLuong = it.soLuong;

            if (this.dichVuTour.id > 0) {
                ct.bookingId = this.dichVuTour.bookingId;
                ct.bookingTourId = this.dichVuTour.id;
            }
            listChiTiet.push(ct);
        });

        this.dichVuTour.listChiTiet = listChiTiet;
    }

}