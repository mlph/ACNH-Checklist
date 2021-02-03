import { Injectable } from '@angular/core';
import { items, recipes, IRecipe, creatures, ICreature, translations } from "animal-crossing";
import { Category, Item, VariationElement, Version } from 'animal-crossing/lib/types/Item';
import { TranslationService } from './translation.service';

import { NihongoService } from './nihongo.service';
import { SourceSheet } from 'animal-crossing/lib/types/Translation';
import { Personality } from 'animal-crossing/lib/types/Villager';
import { SettingsService, threeState } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {




  data!: ItemJ[];
  categories: { key: Category, name: string; }[] = [];
  recipe!: IRecipeJ[];
  creature!: ICreatureJ[];


  constructor(
    private t: TranslationService,
    private nihongo: NihongoService,
    private settings: SettingsService
  ) {
    this.Init();
    // this.Categories();
    this.test();
  }

  Init() {
    const Process_Item = (i: Item) => {
      const r = i as ItemJ;
      r.nameJ = i.translations?.japanese || i.name;
      if (!i.translations || !i.translations.japanese) {
        // if (i.sourceSheet !== Category.MessageCards) {
        //   console.log(r.name);
        // }
        // const t = translations.find(t=>t.english === r.name);
        // if(t){
        //   r.nameJ = t.japanese
        //   console.log(t);
        // }
        const t: Record<string, string> = {
          "turnips": "カブ",
          "spoiled turnips": "くさったカブ",
          "coin": "おカネ",
          "Bell bag": "ベルぶくろ"
        };
        r.nameJ = t[r.name] || r.name;
      }
      r.nameH = this.nihongo.toHiragana(r.nameJ);
      const id = (() => {
        if (r.internalId != null) {
          return r.internalId;
        }
        return r.translations?.id || -1;
      })();
      r.internalId = id;
      // r.checked = this.settings.checklist.items[id];
      // if (r.checked == null) {
      //   const c: { base: threeState, variants: { variantId: string; checked: boolean; }[]; } = {
      //     base: "false",
      //     variants: (r.variations || [])
      //       .map(v => ({ variantId: variantId(v), checked: false }))
      //   };

      //   r.checked = c;
      // };

      // (r.variations || []).filter(v => !v.variantId && !v.variation).forEach(c => console.log(c));

      return r;
    };
    const Process_Recipe = (i: IRecipe) => {
      const r = i as IRecipeJ;
      r.nameJ = i.translations?.japanese || i.name;
      r.nameH = this.nihongo.toHiragana(r.nameJ);
      // r.checked = !!this.settings.checklist.recipes[r.internalId];
      return r;
    };
    const Process_Creature = (i: ICreature) => {
      const r = i as ICreatureJ;
      r.nameJ = i.translations.japanese;
      r.nameH = this.nihongo.toHiragana(r.nameJ);
      // r.checked = !!this.settings.checklist.recipes[r.internalId];
      return r;
    };

    this.data = items.map(v => Process_Item(v));
    this.recipe = recipes.map(Process_Recipe);
    this.creature = creatures.map(Process_Creature);
  }

  test() {
    // console.log(construction.length);
    // console.log(npcs.length);
    // console.log(translations.filter(t=>t.sourceSheet === SourceSheet.));
    // console.log(items.length);
    // const wall = items.filter(i => i.sourceSheet === Category.Wallpaper);
    // console.log(wall.length);
    // const a = items.filter(v=>!v.source)
    // console.log(a)
    // const a: string[] = [];
    // for (const i of creatures) {
    //   // if (!i.source) {
    //   //   continue;
    //   // }
    //   // for (const s of i.source) {
    //   //   if (!a.includes(s)) {
    //   //     a.push(s);
    //   //   }
    //   // }
    //   if(i.whereHow && !a.includes(i.whereHow)){
    //     a.push(i.whereHow)
    //   }
    // }
    // // console.log(a.filter(v => this.t.ItemsSource(v).startsWith("no")));
    // console.log(a);
    // const a = ["Furniture", "Accessories", "Tops Variants", "Furniture Patterns", "Furniture Variants", "Dresses Variants", "Dinosaurs", "Bottoms Variants", "Caps Variants", "Shoes Variants", "Constellations", "Craft", "Caps", "Socks", "Bugs", "Accessories Variants", "Bags Variants", "Socks Variants", "Tops", "Villagers", "Pictures", "Posters", "K.K. Albums", "Reactions", "Masks Variants", "ETC", "Rugs", "Marine Suit Variants", "Special NPCs", "Dresses", "Events", "HHA Themes", "Bags", "Fence", "Floors", "Walls", "Tools", "Doorplates", "Shoes", "Umbrella", "Masks", "Sea Creatures", "Villagers Catch Phrase", "Bottoms", "Bugs Models", "Fish", "Fish Models", "Marine Suit", "Event Items", "Fossils", "Art", "HHA Set", "Plants", "House Roof", "House Door", "HHA Situation", "House Wall", "House Mailbox", "Bridge & Inclines", "Fashion Themes", "Shells"]

    // a.forEach(s=>console.log(translations.find(t=>t.sourceSheet === s)))

    // console.log(seasonsAndEvents);
    // console.log(items.filter(i => !i.internalId && !i.translations?.id));
    // console.log(recipes.filter(i => !i.internalId ));
    // console.log(creatures.length, creatures[0]);
    // console.log(creatures.filter(c=>typeof c.hemispheres.north.timeArray[0] !== "number"))
    // console.log(items.filter(i=>i.versionAdded === Version.The170))
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

  image(s: string) {
    return items.find(i => i.name === s)?.inventoryImage || "";
  }

  series(s: string) {
    return items.find(i => i.name === s)?.seriesTranslations?.japanese || "";
  }
}

export type ItemJ = Item & {
  nameJ: string;
  nameH: string;
  internalId: number;
  // checked: {
  //   base: threeState;
  //   variants: {
  //     variantId: string;
  //     checked: boolean;
  //   }[];
  // };
};
export type IRecipeJ = IRecipe & {
  nameJ: string;
  nameH: string;
  // checked: boolean;
};
export type ICreatureJ = ICreature & {
  nameJ: string;
  nameH: string;
  // checked: boolean;
  // discriptionJ: string;
  // catchPhraseJ: string;
};


export const variantId = (v: VariationElement) => v.variantId || v.variation?.toString() || "undefined";