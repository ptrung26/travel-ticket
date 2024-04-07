import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'ord-footer-fixed',
  templateUrl: './ord-footer-fixed.component.html',
  styleUrls: ['./ord-footer-fixed.component.scss'],
  providers: [
    // SubscriptionService
  ]
})
export class OrdFooterFixedComponent implements OnInit, AfterViewInit {
  // @ViewChild('vcForm') vcForm: DynamicFormPageComponent;
  // @Input() schema: IOrdFormSchema;
  @Input() fixed: boolean = false;
  @Input() class: any = 'text-left';
  constructor(
    private cdref: ChangeDetectorRef
  ) {
  }

  className: any = '';

  ngOnInit(): void {

  }

  ngAfterViewInit(){
    let bodyDocument = document.body.offsetHeight;
    let combonentBody = document.getElementsByClassName('cbs-hiv-content')[0].clientHeight;

    if(combonentBody > bodyDocument){
      this.className = 'ord-footer-fixed';
    }else{
      this.className = 'ord-footer-defaul';
    }
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
}
