import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'lien-he-khach-san',
  templateUrl: './lien-he-khach-san.component.html',
})
export class LienHeKhachSanComponent {
  rfForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.rfForm = this.fb.group({
      filter: '',
    });
  }

  refresh() {}
}
