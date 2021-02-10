import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { items } from 'animal-crossing';
import { Subject } from 'rxjs';
// import { SettingsComponent } from '../components/settings/settings.component';

//@ts-ignore
import * as cjson from 'compressed-json';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Category, Item } from 'animal-crossing/lib/types/Item';
import { ItemJ } from './data.service';

const LSkey = "acnh_checklist";

const headersDefault = {
  items: [
    { name: "チェック", key: "check", enable: true, toggleSwitch: false },
    { name: "カテゴリ", key: "category", enable: false, toggleSwitch: true },
    { name: "名前", key: "name", enable: true, toggleSwitch: false },
    { name: "画像", key: "image", enable: false, toggleSwitch: true },
    { name: "入手手段", key: "source", enable: true, toggleSwitch: false },
    { name: "カタログ", key: "catalog", enable: true, toggleSwitch: false },
    { name: "変種", key: "variants", enable: false, toggleSwitch: true },
    { name: "シリーズ", key: "series", enable: false, toggleSwitch: true },
    { name: "材料", key: "material", enable: false, toggleSwitch: true },
    { name: "元データ", key: "rawdata", enable: false, toggleSwitch: true }
  ],
  recipes: [
    { name: "チェック", key: "check", enable: true, toggleSwitch: false },
    { name: "カテゴリ", key: "category", enable: false, toggleSwitch: true },
    { name: "名前", key: "name", enable: true, toggleSwitch: false },
    { name: "画像", key: "image", enable: false, toggleSwitch: true },
    { name: "入手手段", key: "source", enable: true, toggleSwitch: false },
    { name: "イベント", key: "event", enable: true, toggleSwitch: false },
    { name: "カードの色", key: "color", enable: false, toggleSwitch: false },
    { name: "材料", key: "material", enable: false, toggleSwitch: true },
    { name: "元データ", key: "rawdata", enable: false, toggleSwitch: true },
  ],
  creatures: [
    { name: "チェック", key: "check", enable: true, toggleSwitch: false },
    { name: "カテゴリ", key: "category", enable: false, toggleSwitch: true },
    { name: "Id", key: "id", enable: true, toggleSwitch: false },
    { name: "名前", key: "name", enable: true, toggleSwitch: false },
    { name: "アイコン", key: "imgIcon", enable: false, toggleSwitch: true },
    { name: "ずかん", key: "imgPedia", enable: false, toggleSwitch: true },
    { name: "かぐ", key: "imgFurniture", enable: false, toggleSwitch: false },
    { name: "特徴", key: "property", enable: false, toggleSwitch: true },
    { name: "生息時期", key: "period", enable: true, toggleSwitch: false },
    // { name: "入手手段", key: "source", enable: true, toggleSwitch: false },
    { name: "元データ", key: "rawdata", enable: false, toggleSwitch: true },
    // { name: "イベント", key: "event", enable: true, toggleSwitch: false },
  ],
};

@Injectable({
  providedIn: 'root'
})
export class SettingsService {


  private _headers: {
    items?: HeaderSetting[],
    recipes?: HeaderSetting[],
    creatures?: HeaderSetting[];
  } = {};

  generals = {
    materialImage: true,
    // materialKanji: false,
    clickRowCheck: false,
    hemisphere_north: true
  };

  // checklist: {
  //   items: {
  //     [internalId: number]: {
  //       base: threeState;
  //       variants: {
  //         [variantId: string]: boolean;
  //       };
  //     };
  //   };
  //   recipes: { [internalId: number]: boolean; };
  //   creatures: { [internalId: number]: boolean; };
  // } = { items: {}, recipes: {}, creatures: {} };

  checklist: {
    items: {
      [category in Category]?: {
        [internalId: number]: {
          base: threeState;
          variants: {
            [variantId: string]: boolean;
          };
        };
      };
    };
    recipes: { [internalId: number]: boolean; };
    creatures: { [internalId: number]: boolean; };
  } = { items: {}, recipes: {}, creatures: {} };


  headerChanged = new Subject<never>();

  needToSave = false;
  mayNeedToSave = false;

  constructor(
    private dialog: MatDialog
  ) {
    this.load(localStorage.getItem(LSkey) || "");

    this.headerChanged.subscribe(v => this.mayNeedToSave = true);
  }

  headers(key: "items" | "recipes" | "creatures", filtered = false) {
    if (!this._headers[key]) {
      this._headers[key] = headersDefault[key];
    }
    const _filter = filtered ? (i: HeaderSetting) => i.toggleSwitch : () => true;
    return (this._headers[key] as HeaderSetting[]).filter(_filter);
  }


  // open(header: HeaderSetting[]) {
  //   this.dialog.open(SettingsComponent, { data: { headers: header, subj: this.headerChanged } });
  // }

  stringify() {
    return JSON.stringify(
      cjson.compress({
        list: this.checklist,
        headers: this._headers,
        generals: this.generals
      })
    );
  }

  parse(data: string) {
    const p = JSON.parse(data);
    const s = cjson.decompress(p);
    return {
      list: s.list,
      headers: s.headers,
      generals: s.generals
    };
  }

  save() {
    localStorage.setItem(LSkey, this.stringify());
    this.needToSave = false;
    this.mayNeedToSave = false;
  }

  load(data: string) {
    if (data) {
      const p = this.parse(data);
      this.checklist = p.list || {};
      this._headers = p.headers || {};
      this.generals = p.generals || {};
    }
    this.checklist.items = this.checklist.items || {};
    this.checklist.recipes = this.checklist.recipes || {};
    this.checklist.creatures = this.checklist.creatures || {};

    const def = (h: HeaderSetting) => ({
      enable: false,
      key: h.key,
      name: h.name,
      toggleSwitch: false
    });

    headersDefault.items.forEach(h => {
      if (!this._headers.items?.find(_ => _.key === h.key)) {
        this._headers.items?.push(def(h));
      }
    });
    headersDefault.recipes.forEach(h => {
      if (!this._headers.recipes?.find(_ => _.key === h.key)) {
        this._headers.recipes?.push(def(h));
      }
    });
    headersDefault.creatures.forEach(h => {
      if (!this._headers.creatures?.find(_ => _.key === h.key)) {
        this._headers.creatures?.push(def(h));
      }
    });

  }

  itemCheckList(i: ItemJ) {
    if (!this.checklist.items[i.sourceSheet]) {
      this.checklist.items[i.sourceSheet] = {};
    }
    return this.checklist.items[i.sourceSheet]!;
  }

  moveItemInArray(header: "items" | "recipes" | "creatures", previousIndex: number, currentIndex: number) {
    moveItemInArray(this._headers[header]!, previousIndex, currentIndex);
  }
}

export type threeState = "true" | "false" | "partial";
export type HeaderSetting = {
  name: string;
  key: string;
  enable: boolean;
  toggleSwitch: boolean;
};

