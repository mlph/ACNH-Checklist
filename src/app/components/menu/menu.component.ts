import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { SettingsService } from 'src/app/services/settings.service';
import { GeneralSettingsComponent } from '../general-settings/general-settings.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  tab: 'items' | 'recipes' | 'creatures' | undefined;
  loaded = false;
  messages: string[] = [];

  constructor(public settings: SettingsService, private dialog: MatDialog, private data: DataService) {}

  ngOnInit(): void {
    this.data.done.subscribe(() => (this.loaded = true));
    this.data.loadingProgress.subscribe((v) => this.messages.push(v));
  }

  generalSettings() {
    this.dialog.open(GeneralSettingsComponent);
  }
}
