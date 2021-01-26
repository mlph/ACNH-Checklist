import { EventEmitter, Injectable } from '@angular/core';
import { merge, Observable, of, Subject } from 'rxjs';
// const {  mergeMap,  } = require('rxjs/operators');
import { map, mergeMap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  showimage = false;
  // showimageChange = new EventEmitter<boolean>();

  showdata = false;
  // showdataChange = new EventEmitter<boolean>();
  showVariations = false;
  showMaterials = false;

  settingChanged: Subject<{ prop: string, data: any; }> =
    new Subject();
  // merge(
  //   this.showimageChange.pipe(
  //     map(v => ({ prop: "showimage", data: v }))
  //   ),
  //   this.showdataChange.pipe(
  //     map(v => ({ prop: "showdata", data: v }))
  //   ),
  // );

  constructor() {
  }


}
