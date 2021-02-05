import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent implements OnInit {

  exported = "";
  toImport = "";

  ex = false;

  constructor(public s: SettingsService) { }

  ngOnInit(): void {
  }

  export() {
    this.exported = this.s.stringify();
  }

  import() {
    this.s.load(this.toImport);
    this.s.needToSave = true;
  }

}
