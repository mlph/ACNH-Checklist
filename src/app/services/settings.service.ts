import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { SettingsComponent } from '../components/settings/settings.component';

const LSkey = "acnh_checklist";
const LSchecklist = "list";
const LSSitems = "s.items";
const LSSrecipes = "s.recipes";

const headersDefault = {
  items: [
    { name: "チェック", key: "check", enable: true, toggleSwitch: false },
    { name: "名前", key: "name", enable: true, toggleSwitch: false },
    { name: "画像", key: "image", enable: false, toggleSwitch: true },
    { name: "入手手段", key: "source", enable: true, toggleSwitch: false },
    { name: "カタログ", key: "catalog", enable: true, toggleSwitch: false },
    { name: "変種", key: "variants", enable: false, toggleSwitch: true },
    { name: "元データ", key: "rawdata", enable: false, toggleSwitch: true }
  ],
  recipes: [
    { name: "チェック", key: "check", enable: true, toggleSwitch: false },
    { name: "名前", key: "name", enable: true, toggleSwitch: false },
    { name: "画像", key: "image", enable: false, toggleSwitch: true },
    { name: "入手手段", key: "source", enable: true, toggleSwitch: false },
    { name: "イベント", key: "event", enable: true, toggleSwitch: false },
    { name: "元データ", key: "rawdata", enable: false, toggleSwitch: true },
  ],
  creatures: [
    { name: "チェック", key: "check", enable: true, toggleSwitch: false },
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

  private _items!: HeaderSetting[];
  private _recipes!: HeaderSetting[];
  private _creatures!: HeaderSetting[];

  private _headers: {
    items?: HeaderSetting[],
    recipes?: HeaderSetting[],
    creatures?: HeaderSetting[];
  } = {};

  checklist: {
    items: {
      [internalId: number]: {
        base: threeState;
        variants: {
          variantId: string;
          checked: boolean;
        }[];
      };
    };
    recipes: { [internalId: number]: boolean; };
  } = { items: {}, recipes: {} };


  // settingChanged: Subject<{ prop: string, data: any; }> =
  //   new Subject();

  headerChanged = new Subject<never>();

  constructor(
    private dialog: MatDialog
  ) {
    this.load();
  }

  headers(key: "items" | "recipes" | "creatures", filtered = false) {
    if (!this._headers[key]) {
      this._headers[key] = headersDefault[key];
    }
    const _filter = filtered ? (i: HeaderSetting) => i.toggleSwitch : () => true;
    return (this._headers[key] as HeaderSetting[]).filter(_filter);
  }

  // itemsHeaders(filter = false): HeaderSetting[] {
  //   const _filter = filter ? (i: HeaderSetting) => i.toggleSwitch : () => true;
  //   if (!this._items) {
  //     this._items = [
  //       { name: "チェック", key: "check", enable: true, toggleSwitch: false },
  //       { name: "名前", key: "name", enable: true, toggleSwitch: false },
  //       { name: "画像", key: "image", enable: false, toggleSwitch: true },
  //       { name: "入手手段", key: "source", enable: true, toggleSwitch: false },
  //       { name: "カタログ", key: "catalog", enable: true, toggleSwitch: false },
  //       { name: "変種", key: "variants", enable: false, toggleSwitch: true },
  //       { name: "元データ", key: "rawdata", enable: false, toggleSwitch: true }
  //     ];
  //   }
  //   return this._items.filter(_filter);
  // }

  // recipesHeaders(filter = false): HeaderSetting[] {
  //   const _filter = filter ? (i: HeaderSetting) => i.toggleSwitch : () => true;
  //   if (!this._recipes) {
  //     this._recipes = [
  //       { name: "チェック", key: "check", enable: true, toggleSwitch: false },
  //       { name: "名前", key: "name", enable: true, toggleSwitch: false },
  //       { name: "画像", key: "image", enable: false, toggleSwitch: true },
  //       { name: "入手手段", key: "source", enable: true, toggleSwitch: false },
  //       { name: "元データ", key: "rawdata", enable: false, toggleSwitch: true },
  //       { name: "イベント", key: "event", enable: true, toggleSwitch: false },
  //     ];
  //   }
  //   return this._recipes.filter(_filter);
  // }

  open(header: HeaderSetting[]) {
    this.dialog.open(SettingsComponent, { data: { headers: header, subj: this.headerChanged } });
  }

  save() {
    // localStorage[`${LSkey}.${LSchecklist}`] = JSON.stringify(this.checklist);
    // localStorage[`${LSkey}.${LSSitems}`] = JSON.stringify(this.items);
    // localStorage[`${LSkey}.${LSSrecipes}`] = JSON.stringify(this.recipes);
  }

  load() {
    // const [c, i, r] = [localStorage[`${LSkey}.${LSchecklist}`], localStorage[`${LSkey}.${LSSitems}`], localStorage[`${LSkey}.${LSSrecipes}`]];
    // if (c) {
    //   this.checklist = JSON.parse(c);
    // }
    // if (i) {
    //   this.items = JSON.parse(i);
    // }
    // if (r) {
    //   this.recipes = JSON.parse(r);
    // }
  }

}

export type threeState = "true" | "false" | "partial";
export type HeaderSetting = {
  name: string;
  key: string;
  enable: boolean;
  toggleSwitch: boolean;
};