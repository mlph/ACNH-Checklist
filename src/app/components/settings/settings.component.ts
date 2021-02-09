import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { SettingsService, HeaderSetting } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  headers!: HeaderSetting[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { header: "items" | "recipes" | "creatures", subj: Subject<never>; },
    private dialogref: MatDialogRef<SettingsComponent>,
    private setting: SettingsService
  ) { }

  ngOnInit(): void {
    this.headers = this.setting.headers(this.data.header);
    // console.log(this.data.header, this.headers);
  }

  test(a: any) {
    console.log(a);
  }

  SaveandClose() {
    // this.setting.save();
    this.dialogref.close();
  }

  check() {
    this.data.subj.next();
  }

  drop(event: CdkDragDrop<string[]>) {
    // console.log(event.previousIndex, event.currentIndex);
    this.setting.moveItemInArray(this.data.header, event.previousIndex, event.currentIndex);
    this.headers = this.setting.headers(this.data.header);
    this.data.subj.next();
  }
}
