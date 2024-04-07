import * as am4charts from '@node_modules/@amcharts/amcharts4/charts';
import * as am4core from '@node_modules/@amcharts/amcharts4/core';

export class ChartHelper {
  createColumnSeries(chart, xAxis, value, category, name) {
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = value;
    series.dataFields.categoryX = category;
    series.name = name;
    series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]';

    // const bullet = series.bullets.push(new am4charts.LabelBullet());
    // bullet.interactionsEnabled = false;
    // bullet.dy = 10;
    // bullet.label.text = '{valueY}';
    // bullet.label.fill = am4core.color('#ffffff');

    series.events.on('hidden', this.arrangeColumns(chart, xAxis));
    series.events.on('shown', this.arrangeColumns(chart, xAxis));

    return series;
  }

  createPieSeries(chart, value, category, colors, disabledLabel = true, disabledTooltip = false, innerRadius = 0, isDonut = false) {
    // Add and configure Series
    const pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = value;
    pieSeries.dataFields.category = category;

    pieSeries.colors.list = [];

    if (colors?.length > 0) {
      colors.forEach((color: string) => {
        pieSeries.colors.list.push(am4core.color(color));
      });
    }
    if (innerRadius > 0) {
      chart.innerRadius = am4core.percent(innerRadius);
    }
    // Disable ticks and labels
    pieSeries.labels.template.disabled = disabledLabel;
    pieSeries.ticks.template.disabled = disabledTooltip;

    pieSeries.labels.template.text = '{category}';

    if (isDonut) {
      pieSeries.slices.template.stroke = am4core.color('#fff');
      pieSeries.slices.template.strokeWidth = 3;
      pieSeries.slices.template.strokeOpacity = 1;

// This creates initial animation
      pieSeries.hiddenState.properties.opacity = 1;
      pieSeries.hiddenState.properties.endAngle = -90;
      pieSeries.hiddenState.properties.startAngle = -90;
    }
  }

  createLineSeries(chart, field, dateX, name = '', color = '') {
    const series2 = chart.series.push(new am4charts.LineSeries());

    series2.name = name;
    series2.stroke = am4core.color(color);
    series2.strokeWidth = 3;
    series2.dataFields.valueY = field;
    series2.dataFields.categoryX = dateX;

    const bullet = series2.bullets.push(new am4charts.LabelBullet());
    bullet.interactionsEnabled = false;
    bullet.dy = 6;
    bullet.label.text = '[bold]{valueY}%';
    bullet.label.fill = am4core.color('#434343');

    const segment = series2.segments.template;
    segment.interactionsEnabled = true;

    const hs = segment.states.create('hover');
    hs.properties.strokeWidth = 10;

    return series2;
  }

  arrangeColumns(chart, xAxis) {
    const series1 = chart.series.getIndex(0);

    const w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
    if (series1.dataItems.length > 1) {
      const x0 = xAxis.getX(series1.dataItems.getIndex(0), 'categoryX');
      const x1 = xAxis.getX(series1.dataItems.getIndex(1), 'categoryX');
      const delta = ((x1 - x0) / chart.series.length) * w;
      if (am4core.isNumber(delta)) {
        const middle = chart.series.length / 2;

        let newIndex = 0;
        chart.series.each((series) => {
          if (!series.isHidden && !series.isHiding) {
            series.dummyData = newIndex;
            newIndex++;
          } else {
            series.dummyData = chart.series.indexOf(series);
          }
        });
        const visibleCount = newIndex;
        const newMiddle = visibleCount / 2;

        chart.series.each((series) => {
          const trueIndex = chart.series.indexOf(series);
          const newIndex1 = series.dummyData;

          const dx = (newIndex1 - trueIndex + middle - newMiddle) * delta;

          series.animate({ property: 'dx', to: dx }, series.interpolationDuration, series.interpolationEasing);
          series.bulletsContainer.animate({
            property: 'dx',
            to: dx
          }, series.interpolationDuration, series.interpolationEasing);
        });
      }
    }
  }

  createXAxis(chart) {
    const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.dataFields.category = 'category';
    xAxis.renderer.cellStartLocation = 0.1;
    xAxis.renderer.cellEndLocation = 0.9;
    xAxis.renderer.grid.template.location = 0;

    return xAxis;
  }

  createYAxis(chart, numberFormat = '#,#00') {
    const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.min = 0;
    // yAxis.renderer.grid.template.disabled = true;
    // yAxis.renderer.labels.template.disabled = true;
    // yAxis.strictMinMax = true;
    // yAxis.renderer.minGridDistance = 1;
    chart.numberFormatter.numberFormat = numberFormat;
    return yAxis;
  }

  disableLogo(chart) {
    chart.logo.disabled = true;
  }

  createColorList(chart, colors: string[]) {
    chart.colors.list = [];
    if (colors?.length > 0) {
      colors.forEach((item) => {
        chart.colors.list.push(am4core.color(item));
      });
    }
  }

  createLegend(chart, position, maxWidth = 150, truncate = true, paddingBottom = 0, templateText = '') {
    chart.legend = new am4charts.Legend();
    chart.legend.position = position;
    chart.legend.paddingBottom = paddingBottom;
    chart.legend.labels.template.text = templateText;
    chart.legend.labels.template.maxWidth = maxWidth;
    chart.legend.labels.template.truncate = truncate;

    const marker = chart.legend.markers.template.children.getIndex(0);
    marker.cornerRadius(12, 12, 12, 12);
    marker.strokeWidth = 2;
    marker.strokeOpacity = 1;
    marker.stroke = am4core.color('#ccc');
  }

  createTitle(chart, titleChart, fontSize = 15, marginBottom = 5, marginTop = 10) {
    const title = chart.titles.create();
    title.text = titleChart;
    title.fontSize = fontSize;
    title.marginBottom = marginBottom;
    title.marginTop = marginTop;
  }
}
