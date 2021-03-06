import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatRow } from '@angular/material/table';
import {
  CatchDifficulty,
  CreatureSourceSheet,
  MovementSpeed,
  Shadow,
  Vision,
} from 'animal-crossing/lib/types/Creature';
import { DataService, ICreatureJ } from 'src/app/services/data.service';
import { NihongoService } from 'src/app/services/nihongo.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslationService } from 'src/app/services/translation.service';
import { SettingsComponent } from '../../settings/settings.component';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-creature',
  templateUrl: './creature.component.html',
  styleUrls: ['./creature.component.scss'],
})
export class CreatureComponent extends BaseComponent<ICreatureJ> implements OnInit {
  key = 'creatures' as const;

  raw = this.data.creatures;

  checks = [
    { checked: true, icon: 'check_box_outline_blank' },
    { checked: true, icon: 'check_box' },
  ];

  properties = [
    'sourceSheet',
    'num',
    'name',
    'iconImage',
    'critterpediaImage',
    'furnitureImage',
    'sell',
    'whereHow',
    'weather',
    'totalCatchesToUnlock',
    'spawnRates',
    'size',
    'surface',
    'description',
    'catchPhrase',
    'hhaBasePoints',
    'hhaCategory',
    'iconFilename',
    'critterpediaFilename',
    'furnitureFilename',
    'internalId',
    'uniqueEntryId',
    'translations',
    'hemispheres',
    'colors',
    'shadow',
    'movementSpeed',
    'lightingType',
    'versionAdded',
    'unlocked',
    'catchDifficulty',
    'vision',
  ];

  month = -1;
  time = -1;

  highlightCurrentTime = true;

  lastSort: Sort = { active: 'id', direction: 'asc' };

  colDataSimple = [
    {
      id: 'name',
      header: 'なまえ',
      data: (i: ICreatureJ) => i.nameJ,
      key: 'nameJ',
      sort: true,
    },
    {
      id: 'id',
      header: 'Id',
      data: (i: ICreatureJ) => i.num,
      key: 'num',
      sort: true,
    },
    // {
    //   id: 'rawdata',
    //   header: 'json',
    //   data: (i: ICreatureJ) => JSON.stringify(i, undefined, 2),
    //   sort: false,
    // },
    {
      id: 'category',
      header: 'カテゴリ',
      data: (i: ICreatureJ) => this.t.CreatureSourceSheet(i.sourceSheet),
      // sort: true,
    },
    {
      id: 'catchDifficulty',
      header: '難易度',
      data: (i: ICreatureJ) => this.t.catchDifficulty(i.catchDifficulty),
      sort: true,
      order: [
        CatchDifficulty.VeryEasy,
        CatchDifficulty.Easy,
        CatchDifficulty.Medium,
        CatchDifficulty.Hard,
        CatchDifficulty.VeryHard,
      ].map(this.t.catchDifficulty),
    },
    {
      id: 'movementSpeed',
      header: 'スピード',
      data: (i: ICreatureJ) => this.t.movementSpeed(i.movementSpeed),
      sort: true,
      order: [
        MovementSpeed.Stationary,
        MovementSpeed.VerySlow,
        MovementSpeed.Slow,
        MovementSpeed.Medium,
        MovementSpeed.Fast,
        MovementSpeed.VeryFast,
      ].map(this.t.movementSpeed),
    },
    {
      id: 'shadow',
      header: '影',
      data: (i: ICreatureJ) => this.t.shadow(i.shadow),
      sort: true,
      order: [
        Shadow.XSmall,
        Shadow.Small,
        Shadow.Medium,
        Shadow.Large,
        Shadow.XLarge,
        Shadow.XXLarge,
        Shadow.XLargeWFin,
        Shadow.Long,
      ].map(this.t.shadow),
    },
    {
      id: 'spawnRates',
      header: '出現率',
      data: (i: ICreatureJ) => i.spawnRates,
      sort: true,
      // autoSortFunc: true,
    },
    {
      id: 'vision',
      header: '視界',
      data: (i: ICreatureJ) => this.t.vision(i.vision),
      sort: true,
      order: [Vision.VeryNarrow, Vision.Narrow, Vision.Medium, Vision.Wide, Vision.VeryWide].map(this.t.vision),
    },
    {
      id: 'weather',
      header: '天気',
      data: (i: ICreatureJ) => this.t.weather(i.weather),
      sort: true,
      autoSortFunc: true,
    },
    {
      id: 'whereHow',
      header: '場所',
      data: (i: ICreatureJ) => this.t.wherehow(i.whereHow),
      sort: true,
      autoSortFunc: true,
    },
  ];

  colDataImage = [
    {
      id: 'imgIcon',
      header: 'アイコン',
      key: 'iconImage',
    },
    {
      id: 'imgPedia',
      header: 'ずかん',
      key: 'critterpediaImage',
    },
    {
      id: 'imgFurniture',
      header: 'かぐ',
      key: 'furnitureImage',
    },
  ];

  colData = {
    check: {
      id: 'check',
      check: (i: ICreatureJ) => {
        // i.checked = !i.checked;
        this.settings.needToSave = true;
        this.settings.SetCreatureCheckToggle(i);
      },
      IsChecked: (i: ICreatureJ) => this.settings.IsCreatureCheck(i),
    },
    period: {
      id: 'period',
      // "hemispheres.north.monthsArray": "",
      // ".hemispheres.north.time": ""
      hem: (i: ICreatureJ) => this.data.hemisphere(i),
      time: (i: ICreatureJ) => {
        const t = this.data.hemisphere(i).timeArray;
        if (typeof this.data.hemisphere(i).timeArray[0] === 'number') {
          return t as Array<number>;
        } else {
          return ([] as number[]).concat(...(t as number[][]));
        }
      },
    },
    property: {
      id: 'property',
      header: 'データ',
      data: (i: ICreatureJ) => {
        switch (i.sourceSheet) {
          case CreatureSourceSheet.Insects:
            return [
              { key: '天気', value: this.t.weather(i.weather) },
              { key: '場所', value: this.t.wherehow(i.whereHow) },
            ];
          case CreatureSourceSheet.Fish:
            return [
              { key: '影', value: i.shadow },
              { key: '視界', value: i.vision },
              { key: '場所', value: this.t.wherehow(i.whereHow) },
            ];
          case CreatureSourceSheet.SeaCreatures:
            return [
              { key: '移動速度', value: i.movementSpeed },
              { key: '影', value: i.shadow },
            ];
        }
      },
      // key:
      sort: false,
    },
    rawdata: {
      id: 'rawdata',
      header: 'データ',
      data: (i: ICreatureJ) => JSON.stringify(i, undefined, 2),
    },
  };

  _12 = [...Array(12).keys()].map((v) => v + 1);
  _24 = [...Array(24).keys()].map((v) => v);

  categories = [CreatureSourceSheet.Insects, CreatureSourceSheet.Fish, CreatureSourceSheet.SeaCreatures].map((v) => ({
    key: v,
    name: this.t.CreatureSourceSheet(v),
    checked: false,
  }));

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
        // .filter(d => this.categories.find(c => c.key === d.sourceSheet)?.checked)
        // .filter(d => this.settings.IsCreatureCheck(d) ? this.checks[1].checked : this.checks[0].checked)
        // .filter(this.SearchWord)
        .filter((d) => {
          if (this.month === -1) {
            return true;
          }
          return this.data.hemisphere(d).monthsArray.includes(this.month);
        })
        .filter((d) => {
          if (this.time === -1) {
            return true;
          }
          return this.data.hemisphere(d).timeArray.includes(this.time);
        })
    );

    this.PageChange();
  }

  Sort() {
    const compare_id = (a: ICreatureJ, b: ICreatureJ) => {
      const category = (c: ICreatureJ) => {
        switch (c.sourceSheet) {
          case CreatureSourceSheet.Insects:
            return 0;
          case CreatureSourceSheet.Fish:
            return 1;
          case CreatureSourceSheet.SeaCreatures:
            return 2;
        }
      };
      const sub = category(a) - category(b);
      if (sub !== 0) {
        return sub;
      }
      return a.num - b.num;
    };

    const parseRate = (r: string) => {
      const a = r.split('–').map((i) => Number.parseInt(i));
      if (a.length > 1) {
        let sum = 0;
        a.forEach((i) => (sum += i));
        return sum / a.length + a[1] / 200;
      }
      return a[0];
    };

    return (a: ICreatureJ, b: ICreatureJ) => {
      const isAsc = this.lastSort.direction === 'asc' ? 1 : -1;
      switch (this.lastSort.active) {
        case 'name':
          return this.sorthelper_compare(a.nameJ, b.nameJ) * isAsc;
        case 'id':
          return compare_id(a, b) * isAsc;
        case 'spawnRates':
          return this.sorthelper_compare(parseRate(a.spawnRates), parseRate(b.spawnRates)) * isAsc;
        default:
          return 0;
      }
    };
  }

  FilterCheck(): (i: ICreatureJ) => boolean {
    return (d) => (this.settings.IsCreatureCheck(d) ? this.checks[1].checked : this.checks[0].checked);
  }

  IsNow_m(m: number) {
    return new Date().getMonth() + 1 === m;
  }

  IsNow_t(t: number) {
    return new Date().getHours() === t;
  }

  check(i: ICreatureJ) {
    this.colData.check.check(i);
  }
}
