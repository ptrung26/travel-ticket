import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LEVEL } from '@app/shared/service-proxies/danh-muc-service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/AppComponentBase';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent extends AppComponentBase implements OnInit, AfterViewInit {
  test = AppConsts.abpEnvironment;
  rfFormGroup: FormGroup;
  doanhThuTheoThang = [
    {
      title: 1,
      count: 15000000,
    },
    {
      title: 2,
      count: 9000000,
    },
    {
      title: 3,
      count: 12000000,
    },
    {
      title: 4,
      count: 18000000,
    },
    {
      title: 5,
      count: 35000000,
    },
    {
      title: 6,
      count: 20000000,
    },
    {
      title: 7,
      count: 40000000,
    },
    {
      title: 8,
      count: 50000000,
    },
    {
      title: 9,
      count: 70000000,
    },
    {
      title: 10,
      count: 12200000,
    },
    {
      title: 11,
      count: 21000000,
    },
    {
      title: 12,
      count: 31200000,
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
    this.getChart('doanhThuTheoThang', this.doanhThuTheoThang);
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
