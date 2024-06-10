import { Component, Injector, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppComponentBase } from "@app/shared/common/AppComponentBase";
import { LEVEL } from "@app/shared/service-proxies/danh-muc-service-proxies";
import { GetTop5TourSanPhamRequest, TourSanPhamDto, TourSanPhamServiceProxy } from "@app/shared/service-proxies/san-pham-service-proxies";
import { ReuseTabService } from "@delon/abc/reuse-tab";
import { TitleService } from "@delon/theme";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends AppComponentBase implements OnInit {
    topFiveTours: TourSanPhamDto[];
    constructor(private injector: Injector, private activatedRoute: ActivatedRoute, private _tourSanPham: TourSanPhamServiceProxy,
        private reuseService: ReuseTabService, private titleService: TitleService) {
        super(injector);
    }

    lyDoChons: {
        icon: string;
        title: string;
        desc: string;
    }[] = [{
        icon: './assets/images/vi-sao-chon/ly-do-1.webp',
        title: 'Vô vàn lựa chọn',
        desc: 'Tìm kiếm niềm vui với gần nửa triệu điểm tham quan, phòng khách sạn và nhiều trải nghiệm thú vị',
    }, {
        icon: '/assets/images/vi-sao-chon/ly-do-2.webp',
        title: 'Chơi vui, giá tốt',
        desc: 'Trải nghiệm chất lượng với giá tốt. Tích luỹ càng nhiều để được thêm nhiều ưu đãi',
    }, {
        icon: '/assets/images/vi-sao-chon/ly-do-3.webp',
        title: 'Dễ dàng và tiện lợi',
        desc: 'Đặt vé xác nhận ngay, miễn xếp hàng, miễn phí hủy, tiện lợi cho bạn tha hồ khám phá',
    }, {
        icon: 'assets/images/vi-sao-chon/ly-do-4.webp',
        title: 'Đáng tin cậy',
        desc: 'Tham khảo đánh giá chân thực. Dịch vụ hỗ trợ tận tình, đồng hành cùng bạn mọi lúc, mọi nơi',
    }]

    uuDais: {
        img: string;
    }[] = [
            { img: './assets/images/uu-dai/uu-dai-1.webp' },
            { img: './assets/images/uu-dai/uu-dai-2.webp' },
            { img: './assets/images/uu-dai/uu-dai-3.webp' }
        ]

    ngOnInit(): void {
        this.setTitleTab('Trang chủ');
        this.activatedRoute.data.subscribe(({ hero }) => {
        });

        this._tourSanPham.top5tourSanPham(new GetTop5TourSanPhamRequest()).subscribe(res => {
            this.topFiveTours = res.slice(0, 4);
        })

        this.reuseService.clear(true);
        this.titleService.setTitle("Trang chủ");
    }
}