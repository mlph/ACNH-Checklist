import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItemComponent } from './components/item/item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MenuComponent } from './components/menu/menu.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { RecipeComponent } from './components/recipe/recipe.component';
import { SettingsComponent } from './components/settings/settings.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from "@angular/material/dialog";
import { MatCardModule } from "@angular/material/card";
import { CreatureComponent } from './components/creature/creature.component';
import { GeneralSettingsComponent } from './components/general-settings/general-settings.component';
import { CheckboxNoopComponent } from './components/parts/checkbox-noop/checkbox-noop.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemComponent,
    MenuComponent,
    RecipeComponent,
    SettingsComponent,
    CreatureComponent,
    GeneralSettingsComponent,
    CheckboxNoopComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatSortModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    ScrollingModule,
    DragDropModule,
    MatDialogModule,
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
