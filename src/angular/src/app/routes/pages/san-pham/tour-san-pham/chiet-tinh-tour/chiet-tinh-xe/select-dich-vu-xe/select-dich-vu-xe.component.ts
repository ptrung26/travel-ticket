import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@app/shared/common/AppComponentBase';
import {
    DichVuXeDto,
    DichVuXeServiceProxy,
    GetNhaCungCapDichVuXeRequest,
    NhaCungCapDichVuXeDto,
} from '@app/shared/service-proxies/danh-muc-service-proxies';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import _ from "lodash";

interface NhaCungCapNode {
    id: number;
    ten: string;
    quocGiaId: number;
    quocGia: string;
    tinhId: number;
    tinh: string;
    fax: string;
    email: string;
    isHasThueVAT: boolean;
    childrens: DichVuXeDto[];
    expand?: boolean;
}

@Component({
    selector: 'select-dich-vu-xe',
    templateUrl: './select-dich-vu-xe.component.html',
})
export class SelectDichVuXeComponent extends AppComponentBase implements OnInit {
    nhaCungCapList: NhaCungCapDichVuXeDto[] = [];
    nhaCungCapTree: NhaCungCapNode[] = [];
    oldTree: NhaCungCapNode[] = [];
    @Output() luaChonEvent = new EventEmitter<DichVuXeDto>();
    @Input() nhaCungCapId?: number;
    tenNhaCungCap: string = "";
    isShow: boolean = false;
    isLoading: boolean = true;
    constructor(injector: Injector, private _dichVuXeService: DichVuXeServiceProxy) {
        super(injector);
    }
    searchSubject = new Subject<string>();

    log(value: any) {
        console.log(value);
    }

    ngOnInit(): void {
        const input = new GetNhaCungCapDichVuXeRequest();
        const key = 'dichVuXeKey';
        this.searchSubject.pipe(debounceTime(300)).subscribe((val) => {
            this.filter(val);
        });

        if (sessionStorage.getItem(key)) {
            this.isLoading = false;
            const { value, expiry } = JSON.parse(sessionStorage.getItem(key));
            const now = new Date();
            if (now.getTime() > expiry) {
                sessionStorage.removeItem(key);
            } else {
                this.nhaCungCapList = value as NhaCungCapDichVuXeDto[];
                if (this.nhaCungCapId) {
                    const filter = this.nhaCungCapList.filter(x => x.id == this.nhaCungCapId);
                    this.nhaCungCapList = _.cloneDeep(filter);
                    this.tenNhaCungCap = filter[0].ten;
                }
                this.generateTree();
                return;
            }
        }

        this._dichVuXeService.getnhacungcapdichvuxe(input).subscribe((res) => {
            this.isLoading = false;
            if (res.isSuccessful) {
                this.nhaCungCapList = res.dataResult;
                if (this.nhaCungCapId) {
                    const filter = this.nhaCungCapList.filter(x => x.id == this.nhaCungCapId);
                    this.nhaCungCapList = _.cloneDeep(filter);
                    this.tenNhaCungCap = filter[0].ten;
                }
                const now = new Date();
                const expiryTime = now.getTime() + 3 * 60 * 60 * 1000;
                const item = {
                    value: res.dataResult,
                    expiry: expiryTime,
                };
                sessionStorage.setItem(key, JSON.stringify(item));
                this.generateTree();
            } else {
                ora.notify.error(res.errorMessage);
            }
        });

    }

    filter(val: string) {
        this.isShow = true;
        if (!val) {
            this.nhaCungCapTree = _.cloneDeep(this.oldTree);
            return;
        }
        const filter = this.nhaCungCapTree.filter((item) => item.ten.includes(val.trim()));
        this.nhaCungCapTree = _.cloneDeep(filter);
    }

    onInputChange(event: any) {
        this.searchSubject.next(event.target.value);
    }

    generateTree() {
        const tree: NhaCungCapNode[] = [];
        this.nhaCungCapList.forEach((item) => {
            const node: NhaCungCapNode = {
                ...item,
                childrens: item.listDichVuXe,
                expand: false,
            };
            tree.push(node);
        });

        this.nhaCungCapTree = _.cloneDeep(tree);
        this.oldTree = _.cloneDeep(tree);
    }

    cauHinh(nhaCungCap: NhaCungCapNode, item: DichVuXeDto) {
        this.luaChonEvent.emit(item);
        this.tenNhaCungCap = item.ten;
        item.nhaCungCapXeId = nhaCungCap.id;
    }
}
