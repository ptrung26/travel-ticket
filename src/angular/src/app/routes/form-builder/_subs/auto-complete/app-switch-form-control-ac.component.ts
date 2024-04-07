import { Component, ComponentFactoryResolver, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { OrdFormItem } from 'src/app-ord-base/ord-form/dynamic-form/dynamic-form-page.component';
import { AppUtilityService } from 'src/app-ord-base/services/app-utility.service';


const MAP_COMPONENT = {
  //hoatChatAuto: HoatChatAutoCompleteComponent

};

@Component({
  selector: 'fb-switch-ac',
  templateUrl: './app-switch-form-control-ac.component.html'
})
export class AppSwitchFormControlAcComponent implements OnInit, OnChanges {
  @Input() formItem: OrdFormItem;
  @Input() dataForm: any = {};
  @Input() valueOfDataField;
  @Input() disabled;
  @ViewChild('dynamicComponent', { read: ViewContainerRef, static: true }) containerRef: ViewContainerRef;
  notView = false;
  private componentRef: any;

  constructor(private cfr: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.switchViewComponent();
  }

  switchViewComponent() {
    const ft = this.formItem.option.formBuilderType;
    if (AppUtilityService.isNullOrEmpty(ft) === false) {
      const component = MAP_COMPONENT[ft];
      if (AppUtilityService.isNullOrEmpty(component)) {
        this.notView = true;
        return;
      }
      this.createViewDynamic(component);
    }
  }

  createViewDynamic(component) {
    const componentFactory = this.cfr.resolveComponentFactory(component);
    const componentRef: any = this.containerRef.createComponent(componentFactory);
    componentRef.instance.valueControl = this.dataForm[this.formItem.dataField];
    componentRef.instance.valueControlChange.subscribe(val => {
      this.dataForm[this.formItem.dataField] = val;
    });
    componentRef.instance.selectedChange$ = this.formItem.formControlChangeSubject;
    componentRef.instance.disabled = this.disabled;
    componentRef.changeDetectorRef.detectChanges();
    this.componentRef = componentRef;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // update giá trị input component
    if (this.componentRef) {
      if (changes.valueOfDataField) {
        this.componentRef.instance.valueControl = changes.valueOfDataField.currentValue;
      }
      if (changes.disabled) {
        this.componentRef.instance.disabled = changes.disabled.currentValue;
      }
    }

  }
}
