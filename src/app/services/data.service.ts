import { Injectable } from '@angular/core';
import { items } from "animal-crossing";
import { Category, Item } from 'animal-crossing/lib/types/Item';
import { TranslationService } from './translation.service';

// const hepburn = require("hepburn");
// const jconv = require("jaconv");
// import jaconv from "jaconv";
const moji = require("moji");

@Injectable({
  providedIn: 'root'
})
export class DataService {

  data = items.map(this.Process);
  categories: { key: Category, name: string; }[] = [];

  wall =
    items
      .filter(i => i.sourceSheet === Category.Wallpaper)
      .map(i => this.Process(i));


  constructor(private t: TranslationService) {
    this.test();
    this.Categories();
  }


  test() {
    // console.log(items.length);
    // const wall = items.filter(i => i.sourceSheet === Category.Wallpaper);
    // console.log(wall.length);
    // const a = items.filter(v=>!v.source)
    // console.log(a)
    // const a: string[] = [];
    // for (const i of items) {
    //   if (!i.source) {
    //     continue;
    //   }
    //   for (const s of i.source) {
    //     if (!a.includes(s)) {
    //       a.push(s);
    //     }
    //   }
    // }
    // console.log(a.filter(v=>this.t.ItemsSource(v).startsWith("no")));
    // console.log(a);
  }

  Categories() {
    this.categories = [
      Category.Accessories,
      Category.Art,
      Category.Bags,
      Category.Bottoms,
      Category.ClothingOther,
      Category.DressUp,
      Category.Equipment,
      Category.Fencing,
      Category.Floors,
      Category.Fossils,
      Category.Headwear,
      Category.Housewares,
      Category.MessageCards,
      Category.Miscellaneous,
      Category.Music,
      Category.Other,
      Category.Photos,
      Category.Posters,
      Category.Rugs,
      Category.Shoes,
      Category.Socks,
      Category.Tools,
      Category.Tops,
      Category.Umbrellas,
      Category.WallMounted,
      Category.Wallpaper
    ].map(v => ({ key: v, name: this.t.Category(v) }));
  }

  Process(i: Item) {
    const r = i as Item & { nameJ: string, nameH: string; };
    r.nameJ = i.translations?.japanese || i.name;
    r.nameH = moji(r.nameJ).convert('KK', 'HG').toString();
    return r;
  }

  /**
   * @description 非破壊的
   */
  RemoveNull<T>(src: T): Partial<T> {
    const result: Partial<T> = {};
    for (let k of (Object.keys(src) as (keyof T)[])) {
      if (src[k] == null) { }
      else if (typeof src[k] === "object") {
        let a = src[k];
        result[k] = this.RemoveNull(src[k]) as any;
      } else {
        result[k] = src[k];
      }
    }
    return result;
  }
}

"あいうえおかきくけこ";