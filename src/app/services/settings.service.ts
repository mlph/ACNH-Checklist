import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

const LSkey = "acnh_checklist";
const LSchecklist = "list";
const LSSitems = "s.items";
const LSSrecipes = "s.recipes";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  items: Record<string, boolean> = {
    image: false,
    data: false,
    variants: false,
  };

  recipes: Record<string, boolean> = {
    image: false,
    data: false
  };

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

  // showimage = false;
  // // showimageChange = new EventEmitter<boolean>();

  // showdata = false;
  // // showdataChange = new EventEmitter<boolean>();
  // showVariations = false;
  // showMaterials = false;

  settingChanged: Subject<{ prop: string, data: any; }> =
    new Subject();
  // merge(
  //   this.showimageChange.pipe(
  //     map(v => ({ prop: "showimage", data: v }))
  //   ),
  //   this.showdataChange.pipe(
  //     map(v => ({ prop: "showdata", data: v }))
  //   ),
  // );

  constructor() {
    this.load();
  }

  get itemskey() {
    return Object.keys(this.items);
  }
  get recipeskey() {
    return Object.keys(this.recipes);
  }

  save() {
    localStorage[`${LSkey}.${LSchecklist}`] = JSON.stringify(this.checklist);
    localStorage[`${LSkey}.${LSSitems}`] = JSON.stringify(this.items);
    localStorage[`${LSkey}.${LSSrecipes}`] = JSON.stringify(this.recipes);
  }

  load() {
    const [c, i, r] = [localStorage[`${LSkey}.${LSchecklist}`], localStorage[`${LSkey}.${LSSitems}`], localStorage[`${LSkey}.${LSSrecipes}`]];
    if (c) {
      this.checklist = JSON.parse(c);
    }
    if (i) {
      this.items = JSON.parse(i);
    }
    if (r) {
      this.recipes = JSON.parse(r);
    }
  }

}

export type threeState = "true" | "false" | "partial";