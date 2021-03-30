import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { items } from 'animal-crossing';
import { Subject } from 'rxjs';
// import { SettingsComponent } from '../components/settings/settings.component';

//@ts-ignore
import * as cjson from 'compressed-json';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Category, Item } from 'animal-crossing/lib/types/Item';
import { ICreatureJ, IRecipeJ, ItemJ } from './data.service';

const LSkey = 'acnh_checklist';
const LSkeyS = 'acnh_checklist_settings';
export const LSKeyP = 'acnh_checklist_presort';

const headersDefault = {
  items: [
    { name: 'チェック', key: 'check', enable: true, toggleSwitch: false },
    { name: 'カテゴリ', key: 'category', enable: false, toggleSwitch: true },
    { name: '名前', key: 'name', enable: true, toggleSwitch: false },
    { name: '画像', key: 'image', enable: false, toggleSwitch: true },
    { name: '入手手段', key: 'source', enable: true, toggleSwitch: true },
    { name: '変種', key: 'variants', enable: false, toggleSwitch: true },
    { name: 'カタログ', key: 'catalog', enable: true, toggleSwitch: true },
    { name: 'シリーズ', key: 'series', enable: false, toggleSwitch: true },
    { name: '材料', key: 'material', enable: false, toggleSwitch: true },
    { name: 'サイズ', key: 'size', enable: false, toggleSwitch: true },
    { name: '搭載性', key: 'surface', enable: false, toggleSwitch: true },
    { name: '使用可能', key: 'interact', enable: false, toggleSwitch: true },
    { name: 'タグ', key: 'tag', enable: false, toggleSwitch: true },
    { name: '追加されたバージョン', key: 'version', enable: false, toggleSwitch: true },
    { name: '元データ', key: 'rawdata', enable: false, toggleSwitch: false },
  ],
  recipes: [
    { name: 'チェック', key: 'check', enable: true, toggleSwitch: false },
    { name: 'カテゴリ', key: 'category', enable: false, toggleSwitch: true },
    { name: '名前', key: 'name', enable: true, toggleSwitch: false },
    { name: '画像', key: 'image', enable: false, toggleSwitch: true },
    { name: '入手手段', key: 'source', enable: true, toggleSwitch: true },
    { name: 'イベント', key: 'event', enable: false, toggleSwitch: true },
    // { name: 'カードの色', key: 'color', enable: false, toggleSwitch: false },
    { name: '材料', key: 'material', enable: false, toggleSwitch: true },
    { name: '追加されたバージョン', key: 'version', enable: false, toggleSwitch: true },
    { name: '元データ', key: 'rawdata', enable: false, toggleSwitch: false },
  ],
  creatures: [
    { name: 'チェック', key: 'check', enable: true, toggleSwitch: false },
    { name: 'カテゴリ', key: 'category', enable: false, toggleSwitch: true },
    { name: 'Id', key: 'id', enable: true, toggleSwitch: false },
    { name: '名前', key: 'name', enable: true, toggleSwitch: false },
    { name: 'アイコン', key: 'imgIcon', enable: false, toggleSwitch: true },
    { name: 'ずかん', key: 'imgPedia', enable: false, toggleSwitch: true },
    { name: 'かぐ', key: 'imgFurniture', enable: false, toggleSwitch: true },
    // { name: '特徴', key: 'property', enable: false, toggleSwitch: true },
    { name: '生息時期', key: 'period', enable: true, toggleSwitch: true },
    { name: '難易度', key: 'catchDifficulty', enable: false, toggleSwitch: true },
    { name: 'スピード', key: 'movementSpeed', enable: false, toggleSwitch: true },
    { name: '影', key: 'shadow', enable: false, toggleSwitch: true },
    { name: '出現率', key: 'spawnRates', enable: false, toggleSwitch: true },
    { name: '視界', key: 'vision', enable: false, toggleSwitch: true },
    { name: '天気', key: 'weather', enable: false, toggleSwitch: true },
    { name: '場所', key: 'whereHow', enable: false, toggleSwitch: true },
    { name: '元データ', key: 'rawdata', enable: false, toggleSwitch: false },
  ],
};

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private _headers: {
    items?: HeaderSetting[];
    recipes?: HeaderSetting[];
    creatures?: HeaderSetting[];
  } = {};

  generals = {
    materialImage: false,
    // materialKanji: false,
    clickRowCheck: false,
    hemisphere_north: true,
    perrow: 10,
    presort: true,
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
    recipes: { [internalId: number]: boolean };
    creatures: { [internalId: number]: boolean };
  } = { items: {}, recipes: {}, creatures: {} };

  // checklist: {
  //   items: Map<Category, Map<number, {
  //     base: threeState;
  //     variants: {
  //       [variantId: string]: boolean;
  //     };
  //   }>>;
  //   recipes: Map<number, boolean>;
  //   creatures: Map<number, boolean>;
  // } = { items: new Map(), recipes: new Map(), creatures: new Map() };

  headerChanged = new Subject<never>();

  needToSave = false;
  // mayNeedToSave = false;

  constructor(private dialog: MatDialog) {
    this.load(localStorage.getItem(LSkey) || '');
    this.loadSettings(localStorage.getItem(LSkeyS) || '');

    // this.headerChanged.subscribe(v => this.mayNeedToSave = true);
    this.headerChanged.subscribe((v) => this.save_settings());
  }

  headers(key: 'items' | 'recipes' | 'creatures', filtered = false) {
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
    // const items = this.checklist.items;
    const _c: any = {};
    ObjectForEach(this.checklist.items, (k, i) => {
      const _i: Partial<{
        [internalId: number]: {
          base?: threeState;
          variants?: {
            [variantId: string]: boolean;
          };
        };
      }> = {};
      if (!i) {
        return;
      }
      ObjectForEach(i, (id, ch) => {
        const _ch: Partial<typeof ch> = {};
        if (ch.variants && Object.keys(ch.variants).length > 0) {
          _ch.variants = ch.variants;
        }
        if (_ch.variants || ch.base !== 'false') {
          _ch.base = ch.base;
        }
        if (_ch.variants || _ch.base) {
          _i[id] = _ch;
        }
      });
      if (Object.keys(_i).length > 0) {
        _c[k] = _i;
      }
    });
    // console.log(_c);

    // console.log(this.checklist)
    return JSON.stringify(
      cjson.compress({
        list: {
          items: _c,
          recipes: this.checklist.recipes,
          creatures: this.checklist.creatures,
        },
        // headers: this._headers,
        // generals: this.generals
      })
    );
  }

  parse(data: string) {
    const p = JSON.parse(data);
    const s = cjson.decompress(p);
    return {
      list: s.list,
      headers: s.headers,
      generals: s.generals,
    };
  }

  save_settings() {
    localStorage.setItem(
      LSkeyS,
      JSON.stringify({
        headers: this._headers,
        generals: this.generals,
      })
    );
  }

  save() {
    localStorage.setItem(LSkey, this.stringify());
    // this.save_settings();
    this.needToSave = false;
    // this.mayNeedToSave = false;
  }

  load(data: string) {
    if (data) {
      const p = this.parse(data);
      this.checklist = p.list || {};
      // this._headers = p.headers || {};
      // this.generals = p.generals || {};
    }
    this.checklist.items = this.checklist.items || {};
    this.checklist.recipes = this.checklist.recipes || {};
    this.checklist.creatures = this.checklist.creatures || {};
  }

  loadSettings(data: string) {
    if (data) {
      const p = JSON.parse(data);
      this._headers = p.headers || {};
      this.generals = p.generals || {};
    }

    const def = (h: HeaderSetting) => ({
      enable: false,
      key: h.key,
      name: h.name,
      toggleSwitch: false,
    });

    headersDefault.items.forEach((h) => {
      if (!this._headers.items?.find((_) => _.key === h.key)) {
        this._headers.items?.push(def(h));
      }
    });
    headersDefault.recipes.forEach((h) => {
      if (!this._headers.recipes?.find((_) => _.key === h.key)) {
        this._headers.recipes?.push(def(h));
      }
    });
    headersDefault.creatures.forEach((h) => {
      if (!this._headers.creatures?.find((_) => _.key === h.key)) {
        this._headers.creatures?.push(def(h));
      }
    });
  }
  // itemCheckList(i: ItemJ) {
  //   if (!this.checklist.items[i.sourceSheet]) {
  //     this.checklist.items[i.sourceSheet] = {};
  //   }
  //   return this.checklist.items[i.sourceSheet]!;
  // }

  itemCheckList(i: ItemJ, initwithv = false) {
    if (!this.checklist.items[i.sourceSheet]) {
      this.checklist.items[i.sourceSheet] = {};
    }
    if (!this.checklist.items[i.sourceSheet]![i.internalId]) {
      this.checklist.items[i.sourceSheet]![i.internalId] = {
        base: 'false',
        variants: {},
      };
    }

    return this.checklist.items[i.sourceSheet]![i.internalId]!;
  }

  SetRecipeCheck(r: IRecipeJ, v: boolean) {
    this.checklist.recipes[r.internalId] = v;
  }
  SetRecipeCheckToggle(r: IRecipeJ) {
    this.SetRecipeCheck(r, !this.IsRecipeCheck(r));
  }
  IsRecipeCheck(r: IRecipeJ): boolean {
    return !!this.checklist.recipes[r.internalId];
  }

  SetCreatureCheck(c: ICreatureJ, v: boolean) {
    this.checklist.creatures[c.internalId] = v;
  }
  SetCreatureCheckToggle(c: ICreatureJ) {
    this.SetCreatureCheck(c, !this.IsCreatureCheck(c));
  }
  IsCreatureCheck(c: ICreatureJ): boolean {
    return !!this.checklist.creatures[c.internalId];
  }

  recipeCheckList(r: IRecipeJ) {}

  moveItemInArray(header: 'items' | 'recipes' | 'creatures', previousIndex: number, currentIndex: number) {
    moveItemInArray(this._headers[header]!, previousIndex, currentIndex);
  }

  DeleteSettings() {
    this.loadSettings('{}');
    this.generals = {
      materialImage: false,
      clickRowCheck: false,
      hemisphere_north: true,
      perrow: 10,
      presort: true,
    };
  }
  DeleteSortData() {
    localStorage.removeItem(LSKeyP);
  }
}

export type threeState = 'true' | 'false' | 'partial';
export type HeaderSetting = {
  name: string;
  key: string;
  enable: boolean;
  toggleSwitch: boolean;
};

// const ObjectMap = <T, U>(obj: T, callback: (t: T[keyof T]) => U) => {
//   return (Object.keys(obj) as (keyof T)[]).map(k => callback(obj[k]));
// };
const ObjectForEach = <T>(obj: T, callback: (k: keyof T, t: T[keyof T]) => void) => {
  (Object.keys(obj) as (keyof T)[]).map((k) => callback(k, obj[k]));
};
