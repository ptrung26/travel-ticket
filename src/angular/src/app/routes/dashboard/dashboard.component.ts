import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LEVEL } from '@app/shared/service-proxies/danh-muc-service-proxies';
import { UserExtensionServiceProxy } from '@service-proxies/tai-khoan-service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/AppComponentBase';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent extends AppComponentBase implements OnInit, AfterViewInit {
  test = AppConsts.abpEnvironment;
  rfFormGroup: FormGroup;
  dataChiPhiXetNghiem = [
    {
      title: 'Vi sinh',
      count: 6680000,
    },
    {
      title: 'Hóa sinh',
      count: 66680000,
    },
    {
      title: 'Miễn dịch',
      count: 38680000,
    },
    {
      title: 'Khí máu',
      count: 68680000,
    },
    {
      title: 'Huyết Học',
      count: 568680000,
    },
    {
      title: 'Huyết thanh học',
      count: 86680000,
    },
    {
      title: 'HBV-DNA',
      count: 168680000,
    },
    {
      title: 'Định nhóm máu',
      count: 468680000,
    },
    {
      title: 'Giang mai',
      count: 268680000,
    },
    {
      title: 'Hóa sinh',
      count: 668680000,
    },
    {
      title: 'Miễn dịch',
      count: 38680000,
    },
    {
      title: 'Khí máu',
      count: 68680000,
    },
    {
      title: 'Huyết Học',
      count: 568680000,
    },
  ];
  dataSoPhieuXetNghiem = [
    {
      title: 'Vi sinh',
      count: 68,
    },
    {
      title: 'Hóa sinh',
      count: 668,
    },
    {
      title: 'Miễn dịch',
      count: 38,
    },
    {
      title: 'Khí máu',
      count: 68,
    },
    {
      title: 'Huyết Học',
      count: 568,
    },
    {
      title: 'Huyết thanh học',
      count: 86,
    },
    {
      title: 'HBV-DNA',
      count: 168,
    },
    {
      title: 'Định nhóm máu',
      count: 468,
    },
    {
      title: 'Giang mai',
      count: 268,
    },
    {
      title: 'Hóa sinh',
      count: 668,
    },
    {
      title: 'Miễn dịch',
      count: 38,
    },
    {
      title: 'Khí máu',
      count: 68,
    },
    {
      title: 'Huyết Học',
      count: 568,
    },
  ];
  isAdmin = false;
  constructor(private injector: Injector, private activatedRoute: ActivatedRoute, private fb: FormBuilder) {
    super(injector);
    this.rfFormGroup = this.fb.group({
      denNgay: [],
    });
  }

  ngOnInit(): void {
    this.setTitleTab('Dashboard');
    this.activatedRoute.data.subscribe(({ hero }) => {
      if (hero?.listLevel.includes(LEVEL.ADMIN)) {
        this.isAdmin = true;
      }
    });
  }

  ngAfterViewInit() {
    this.getChart('chiphixetnghiem', this.dataChiPhiXetNghiem);
    this.getChart('sophieuxetnghiem', this.dataSoPhieuXetNghiem);
  }

  getChart(selector: string, data: any[]) {
    am4core.useTheme(am4themes_animated);
    let chartDiv = am4core.create(selector, am4charts.XYChart);
    chartDiv.logo.disabled = true;
    chartDiv.data = data;
    let categoryAxis = chartDiv.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'title';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.grid.template.strokeWidth = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.baseGrid.disabled = true;
    categoryAxis.renderer.grid.template.strokeOpacity = 0;

    let valueAxis = chartDiv.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.strokeDasharray = '8,5';
    let columnSeries = chartDiv.series.push(new am4charts.ColumnSeries());
    columnSeries.dataFields.valueY = 'count';
    columnSeries.dataFields.categoryX = 'title';
    columnSeries.columns.template.fillOpacity = 1;
    columnSeries.columns.template.width = 80;
    columnSeries.columns.template.fill = am4core.color('#2F9DD7');
  }
}
