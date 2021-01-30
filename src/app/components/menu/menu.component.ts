import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsService } from 'src/app/services/settings.service';
import { GeneralSettingsComponent } from '../general-settings/general-settings.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(
    public settings: SettingsService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  generalSettings() {
    this.dialog.open(GeneralSettingsComponent);
  }

}
