import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions } from '@node_modules/@fullcalendar/common';
import dayGridPlugin from '@node_modules/@fullcalendar/daygrid';
import interactionPlugin from '@node_modules/@fullcalendar/interaction';
import timeGridPlugin from '@node_modules/@fullcalendar/timegrid';
import listPlugin from '@node_modules/@fullcalendar/list';
import { DanhSachCongViecServiceProxy, TRANG_THAI_CONG_VIEC } from '@service-proxies/cong-viec-service-proxies';
import { finalize } from '@node_modules/rxjs/internal/operators';
import { EventClickArg, FullCalendarComponent } from '@node_modules/@fullcalendar/angular';
import { ViewCongViecComponent } from '@app/routes/pages/cong-viec/quan-ly-cong-viec/component-shared/view-cong-viec/view-cong-viec.component';
import { AppComponentBase } from '@shared/common/AppComponentBase';

interface ICalendarColor {
  id: number;
  color: string;
  bgColor: string;
}

@Component({
  selector: 'lich-cong-viec',
  templateUrl: './lich-cong-viec.component.html',
  styleUrls: ['./lich-cong-viec.component.scss'],
})
export class LichCongViecComponent extends AppComponentBase implements OnInit {
  @ViewChild('fullcalendar') fullCalendarComp: FullCalendarComponent;
  calendarOptions: CalendarOptions = {};
  colors: ICalendarColor[] = [
    {
      id: TRANG_THAI_CONG_VIEC.TAO_MOI,
      color: '#7F7C82',
      bgColor: '#7f7c8226',
    },
    {
      id: TRANG_THAI_CONG_VIEC.DANG_THUC_HIEN,
      color: '#1890ff',
      bgColor: '#1890ff26',
    },
    {
      id: TRANG_THAI_CONG_VIEC.HOAN_THANH,
      color: '#00ab55',
      bgColor: '#00ab5326',
    },
  ];
  selected = 1;
  titleDate = new Date();

  constructor(injector: Injector, private _dataService: DanhSachCongViecServiceProxy) {
    super(injector);
    this.initCalendar();
  }

  ngOnInit(): void {
    this.getList();
  }

  actionCalendar(type: string) {
    const calendar = this.fullCalendarComp.getApi();
    switch (type) {
      case 'nextMonth':
        calendar.next();
        break;
      case 'prevMonth':
        calendar.prev();
        break;
      case 'nextYear':
        calendar.nextYear();
        break;
      case 'prevYear':
        calendar.prevYear();
        break;
      case 'today':
        calendar.today();
        break;
    }
    this.titleDate = calendar.getDate();
  }

  handleOptionCalendar(option, value) {
    const calendar = this.fullCalendarComp.getApi();
    calendar.changeView(option);
    this.selected = value;
    this.titleDate = calendar.getDate();
  }

  initCalendar() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
      initialView: 'dayGridMonth',
      initialDate: new Date(),
      allDayText: 'Cả ngày',
      weekends: true,
      timeZone: 'UTC',
      locale: 'vi',
      headerToolbar: false,
      themeSystem: 'bootstrap5',
      buttonText: {
        today: 'Hôm nay',
        month: 'Tháng',
        week: 'Tuần',
        listDay: 'Danh sách trong ngày',
        listWeek: 'Danh sách trong tuần',
        listMonth: 'Danh sách trong tháng',
      },
      selectMinDistance: 10,
      weekNumbers: true,
      weekText: 'Tuần',
      height: window.innerHeight * 0.83,
      eventContent: function(arg) {
        const color = arg.event._def.extendedProps['colorCus'];
        const mucDo = arg.event._def.extendedProps['mucDo'];
        let htmlElement = `
          <div style="margin: 0 6px 4px; border-color: transparent !important; background-color: transparent !important;">
                <div class="calendar-event-custom" style="color: ${color}; background-color: rgb(255, 255, 255); padding: 3px 4px; position: relative; z-index: 2;
                        transition: filter 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;border-radius: 4px;">
                        <div style="font-size: 14px;line-height: 20px;filter: brightness(0.24);display: flex;">
                                <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                                  ${arg.event._def.title}
                                </div>
                        </div>
                </div>
          </div>`;
        return { html: htmlElement };
      },
      eventClick: (event: EventClickArg) => {
        this.viewDuAn(event.event._def.extendedProps);
      },
    };
  }

  getList() {
    ora.ui.setBusy();
    this._dataService.getalllichcongviec().pipe(
      finalize(() => {
        ora.ui.clearBusy();
      }),
    ).subscribe(res => {
      if (res.isSuccessful) {
        const dataCalendar = res.dataResult.map(cv => ({
          ...cv,
          idCongViec: cv.id,
          title: cv.ten,
          start: new Date(cv.ngayBatDau.toJSDate().getTime() + 86400000),
          end: new Date(cv.ngayKetThuc.toJSDate().getTime() + 86400000),
          backgroundColor: '#fff',
          margin: '0 15px',
          borderColor: '#fff',
          colorCus: cv.trangThai > -1 ? this.colors.find((x) => x.id === cv.trangThai)?.color : this.colors[0].color,
        })) as any[];
        this.calendarOptions = {
          ...this.calendarOptions,
          events: dataCalendar,
        };
      }
    });
  }

  viewDuAn(data: any) {
    this.modalHelper.create(
      ViewCongViecComponent,
      {
        congViecId: data.idCongViec,
      },
      {
        size: 'lg',
        includeTabs: false,
        modalOptions: {
          nzTitle: 'Xem công việc ' + data.ten,
          nzClassName: 'view-cong-viec',
        },
      },
    ).subscribe((result) => {

    });
  }

}
