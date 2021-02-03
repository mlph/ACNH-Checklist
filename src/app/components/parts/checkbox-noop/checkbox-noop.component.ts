import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCheckboxDefaultOptions, MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';

@Component({
  selector: 'app-checkbox-noop',
  templateUrl: './checkbox-noop.component.html',
  styleUrls: ['./checkbox-noop.component.scss'],
  providers: [
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions }
  ]
})
export class CheckboxNoopComponent implements OnInit {

  @Input() checked = false;
  @Input() indeterminate = false;
  // @Output() click = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

}
