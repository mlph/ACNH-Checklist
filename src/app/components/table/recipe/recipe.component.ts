import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatRow } from '@angular/material/table';
import { Category } from 'animal-crossing/lib/types/Recipe';
import { DataService, IRecipeJ } from 'src/app/services/data.service';
import { NihongoService } from 'src/app/services/nihongo.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslationService } from 'src/app/services/translation.service';
import { SettingsComponent } from '../../settings/settings.component';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent extends BaseComponent<IRecipeJ> implements OnInit {
  raw = this.data.recipes;

  key = 'recipes' as const;

  eventstate = ['全て', '季節/イベント限定のみ', '季節/イベント限定を除く'];
  event = { state: this.eventstate[0] };
  checks = [
    { checked: true, icon: 'check_box_outline_blank' },
    { checked: true, icon: 'check_box' },
  ];

  colDataSimple = [
    {
      id: 'name',
      header: 'なまえ',
      data: (i: IRecipeJ) => i.nameJ,
    },
    // {
    //   id: "catalog",
    //   header: "カタログ",
    //   data: (i: ItemJ) => this.t.Catalog(i.catalog)
    // },
    // {
    //   id: 'rawdata',
    //   header: 'データ',
    //   data: (i: any) => JSON.stringify(i, undefined, 2),
    // },
    {
      id: 'event',
      header: 'イベント',
      data: (i: IRecipeJ) => this.t.SeasonsAndEvents(i.seasonEvent),
      sort: true,
      autoSortFunc: true,
    },
    {
      id: 'color',
      header: 'カードの色',
      data: (i: IRecipeJ) => i.cardColor || '',
      sort: true,
      autoSortFunc: true,
    },
    {
      id: 'category',
      header: 'カテゴリ',
      data: (i: IRecipeJ) => this.t.Category(i.category),
      sort: true,
      autoSortFunc: true,
    },
    {
      id: 'version',
      header: '追加されたバージョン',
      data: (i: IRecipeJ) => i.versionAdded,
      sort: true,
      autoSortFunc: true,
    },
  ];

  colData = {
    image: {
      id: 'image',
      data: (i: IRecipeJ): { src: string; name?: string }[] => {
        const result: { src: string; name?: string }[] = [];
        [i.image].forEach((v) => {
          if (v) {
            result.push({ src: v });
          }
        });
        return result;
      },
    },
    source: {
      id: 'source',
    },
    check: {
      id: 'check',
      check: (i: IRecipeJ) => {
        // i.checked = !i.checked;
        this.settings.SetRecipeCheckToggle(i);
        this.settings.needToSave = true;
      },
      IsChecked: (i: IRecipeJ) => this.settings.IsRecipeCheck(i),
    },
    material: {
      id: 'material',
      mats: (i: IRecipeJ) =>
        Object.keys(i.materials).map((m) => ({
          name: this.t.all(m),
          count: i.materials[m],
          image: this.data.image(m),
        })),
    },
    rawdata: {
      id: 'rawdata',
      header: 'データ',
      data: (i: IRecipeJ) => JSON.stringify(i, undefined, 2),
    },
  };

  categories = [
    Category.Tools,
    Category.Housewares,
    Category.Miscellaneous,
    Category.WallMounted,
    Category.Wallpaper,
    Category.Floors,
    Category.Rugs,
    Category.Equipment,
    Category.Other,
  ].map((v) => ({ key: v, name: this.t.Category(v), checked: false }));

  @ViewChildren(MatRow, { read: ElementRef }) matrow?: QueryList<ElementRef>;

  constructor(
    data: DataService,
    settings: SettingsService,
    t: TranslationService,
    nihongo: NihongoService,
    dialog: MatDialog
  ) {
    super(data, settings, t, nihongo, dialog);
  }

  Filter() {
    // console.log(this._search);
    this.filteredData = this._sort(
      this._filter(this.raw)
        // .filter(d => this.categories.find(c => c.key === d.category)?.checked)
        .filter((d) => (this.settings.IsRecipeCheck(d) ? this.checks[1].checked : this.checks[0].checked))
        // .filter(this.SearchWord)
        .filter((d) => {
          switch (this.event.state) {
            case this.eventstate[1]:
              return d.seasonEventExclusive;
            case this.eventstate[2]:
              return !d.seasonEventExclusive;
            default:
              return true;
          }
        })
    );

    this.PageChange();
  }

  Sort() {
    return (a: IRecipeJ, b: IRecipeJ) => {
      const isAsc = this.lastSort.direction === 'asc' ? 1 : -1;
      switch (this.lastSort.active) {
        case 'name':
          return this.sorthelper_compare(a.nameJ, b.nameJ) * isAsc;
        case 'series':
          return this.sorthelper_compare(this.data.series(a.name), this.data.series(b.name)) * isAsc;
        case 'source':
          return this.sorthelper_compare_ItemSource(a.source, b.source) * isAsc;
        // case 'color':
        //   return this.sorthelper_compare(a.cardColor, b.cardColor) * isAsc;
        // case 'event':
        //   return (
        //     this.sorthelper_compare(this.t.SeasonsAndEvents(a.seasonEvent), this.t.SeasonsAndEvents(b.seasonEvent)) *
        //     isAsc
        //   );
        default:
          return 0;
      }
    };
  }

  FilterCheck(): (i: IRecipeJ) => boolean {
    return (d) => (this.settings.IsRecipeCheck(d) ? this.checks[1].checked : this.checks[0].checked);
  }

  check(i: IRecipeJ) {
    this.colData.check.check(i);
  }
}
