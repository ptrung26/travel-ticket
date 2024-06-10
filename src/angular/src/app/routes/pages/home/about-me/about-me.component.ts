import { Component, OnInit } from "@angular/core";
import { ReuseTabService } from "@delon/abc/reuse-tab";
import { TitleService } from "@delon/theme";

@Component({
    selector: 'about-me',
    templateUrl: './about-me.component.html',
    styleUrls: ['./about-me.component.scss'],
})
export class AboutMeComponent implements OnInit {
    constructor(private resuseTabService: ReuseTabService, private titleService: TitleService) {

    }
    ngOnInit(): void {
        this.resuseTabService.title = "Về chúng tôi";
        this.titleService.setTitle("Về chúng tôi");
    }


}