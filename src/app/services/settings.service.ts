import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { items } from 'animal-crossing';
import { Subject } from 'rxjs';
import { SettingsComponent } from '../components/settings/settings.component';

//@ts-ignore
import * as cjson from 'compressed-json';

const LSkey = "acnh_checklist";
const LSchecklist = "list";
// const LSSitems = "s.items";
// const LSSrecipes = "s.recipes";
const LSsettings = "settings";

const headersDefault = {
  items: [
    { name: "チェック", key: "check", enable: true, toggleSwitch: false },
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

  // private _items!: HeaderSetting[];
  // private _recipes!: HeaderSetting[];
  // private _creatures!: HeaderSetting[];

  private _headers: {
    items?: HeaderSetting[],
    recipes?: HeaderSetting[],
    creatures?: HeaderSetting[];
  } = {};

  generals = {
    materialImage: true,
    // materialKanji: false,
    clickRowCheck: false
  };

  checklist: {
    items: {
      [internalId: number]: {
        base: threeState;
        variants: {
          [variantId: string]: boolean;
        };
      };
    };
    recipes: { [internalId: number]: boolean; };
    creatures: { [internalId: number]: boolean; };
  } = { items: {}, recipes: {}, creatures: {} };


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


  open(header: HeaderSetting[]) {
    this.dialog.open(SettingsComponent, { data: { headers: header, subj: this.headerChanged } });
  }

  save() {
    localStorage[`${LSkey}.${LSchecklist}`] = JSON.stringify(cjson.compress(this.checklist));
    localStorage[`${LSkey}.${LSsettings}`] = JSON.stringify({
      headers: this._headers,
      generals: this.generals
    });
  }

  load() {
    const [c, s] = [
      JSON.parse(localStorage[`${LSkey}.${LSchecklist}`]),
      localStorage[`${LSkey}.${LSsettings}`],
    ];
    if (c) {
      this.checklist = cjson.decompress(c) || {};
      this.checklist.items = this.checklist.items || {};
      this.checklist.recipes = this.checklist.recipes || {};
      this.checklist.creatures = this.checklist.creatures || {};
    }
    if (s) {
      const ss = JSON.parse(s);
      this._headers = ss.headers || {};
      this.generals = ss.generals || {};
    }
  }


  variantList(internalId: number) {
    items.find(i => i.internalId);
  }

}

export type threeState = "true" | "false" | "partial";
export type HeaderSetting = {
  name: string;
  key: string;
  enable: boolean;
  toggleSwitch: boolean;
};


const ObjectKeysNumber = <T>(obj: { [key: number]: T; }) => {
  return Object.keys(obj).map(s => Number.parseInt(s));
};

const forof = <T>(obj: { [key: number]: T; }, callback: (arg0: T) => void) => {

};