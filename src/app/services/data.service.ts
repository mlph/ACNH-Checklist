import { Injectable } from '@angular/core';
import { IRecipe, ICreature, ISeasonsAndEvents } from 'animal-crossing';
import { Category, CeilingType, Gender, Item, Size, VariationElement, Version } from 'animal-crossing/lib/types/Item';

import { NihongoService } from './nihongo.service';
import { SettingsService } from './settings.service';
import { Creature, CreatureSourceSheet } from 'animal-crossing/lib/types/Creature';
import { Translation } from 'animal-crossing/lib/types/Translation';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AsyncSubject, forkJoin } from 'rxjs';

const url = {
  items: 'https://raw.githubusercontent.com/Norviah/animal-crossing/master/json/combined/Items.json',
  recipes: 'https://raw.githubusercontent.com/Norviah/animal-crossing/master/json/combined/Recipes.json',
  creatures: 'https://raw.githubusercontent.com/Norviah/animal-crossing/master/json/combined/Creatures.json',
  translations: 'https://raw.githubusercontent.com/Norviah/animal-crossing/master/json/combined/Translations.json',
  seasonsAndEvents:
    'https://raw.githubusercontent.com/Norviah/animal-crossing/master/json/combined/SeasonsAndEvents.json',
};

@Injectable({
  providedIn: 'root',
})
export class DataService {
  items!: ItemJ[];
  recipes!: IRecipeJ[];
  creatures!: ICreatureJ[];
  translations!: Translation[];
  seasonsAndEvents!: ISeasonsAndEvents[];

  done = new AsyncSubject();

  constructor(private nihongo: NihongoService, private settings: SettingsService, private http: HttpClient) {
    this.Init();
    // this.Categories();
    this.test();
  }

  Init() {
    const Process_Item = (i: Item) => {
      const r = i as ItemJ;
      r.nameJ = i.translations?.japanese || i.name;
      if (i.sourceSheet === Category.Art) {
        if (i.genuine === false) {
          r.nameJ = r.nameJ + '(にせもの)';
        }
      }
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
          turnips: 'カブ',
          'spoiled turnips': 'くさったカブ',
          coin: 'おカネ',
          'Bell bag': 'ベルぶくろ',
        };
        r.nameJ = t[r.name] || r.name;
      }
      // r.nameH = this.nihongo.toHiragana(r.nameJ);
      const id = (() => {
        if (r.internalId != null) {
          return r.internalId;
        }
        return r.translations?.id || -1;
      })();
      r.internalId = id;
      r.surface ??= i.variations ? i.variations[0].surface : undefined;
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
      // r.nameH = this.nihongo.toHiragana(r.nameJ);
      // r.checked = !!this.settings.checklist.recipes[r.internalId];
      return r;
    };
    const Process_Creature = (i: ICreature) => {
      const r = i as ICreatureJ;
      r.nameJ = i.translations.japanese;
      // r.nameH = this.nihongo.toHiragana(r.nameJ);
      // r.checked = !!this.settings.checklist.recipes[r.internalId];
      return r;
    };

    forkJoin([
      this.fetchData<Item[]>('items').pipe(
        map((items) => {
          this.items = items.map((v) => Process_Item(v)).sort((p, q) => this.nihongo.compareKana(p.nameJ, q.nameJ));
        })
      ),
      this.fetchData<IRecipe[]>('recipes').pipe(
        map((recipes) => {
          this.recipes = recipes.map(Process_Recipe).sort((p, q) => this.nihongo.compareKana(p.nameJ, q.nameJ));
        })
      ),
      this.fetchData<ICreature[]>('creatures').pipe(
        map((creatures) => {
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

          this.creatures = creatures
            .map(Process_Creature)
            .sort((p, q) => p.num - q.num)
            .sort((p, q) => category(p) - category(q));
        })
      ),
      this.fetchData<Translation[]>('translations').pipe(
        map((translations) => {
          this.translations = translations;
        })
      ),
      this.fetchData<ISeasonsAndEvents[]>('seasonsAndEvents').pipe(
        map((seasonsAndEvents) => {
          this.seasonsAndEvents = seasonsAndEvents;
        })
      ),
    ]).subscribe((v) => {
      this.done.next(true);
      this.done.complete();
    });
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
    // const a:Item[][] = []
    // items
    // .forEach(i=>{
    //   if(i.internalId != null){
    //     if(a[i.internalId]){
    //       a[i.internalId].push(i)
    //     }else{
    //       a[i.internalId] = [i]
    //     }
    //   }
    // })
    // console.log(a.filter(i=>i.length > 1).filter(i=>i[0].sourceSheet === i[1].sourceSheet))
    // console.log(items.filter(i=>!i.uniqueEntryId).filter(i=>i.villagerEquippable === undefined).filter)
    // console.log(seasonsAndEvents);
    // console.log(items.filter(i => !i.internalId && !i.translations?.id));
    // console.log(recipes.filter(i => !i.internalId ));
    // console.log(creatures.length, creatures[0]);
    // console.log(creatures.filter(c=>typeof c.hemispheres.north.timeArray[0] !== "number"))
    // console.log(items.filter(i=>i.versionAdded === Version.The170))
    // console.log(items.filter(i=>i.nhStartDate)
    // .map(i=>i.gender)
    // )
    // console.log(items.filter(i=>i.size === Size.The05X1))
    // console.log(new Set(items.map(i=>i.)))
    // console.log(new Set(items.map(i=>i.tag )))
    // console.log(this.data.filter((i) => i.seasonEvent!= null));
    // console.log(
    //   items.filter((i) => i.variations).filter((i) => new Set(i.variations?.map((v) => v.surface)).size == 1)
    // );
  }

  fetchData<T>(key: keyof typeof url) {
    return this.http.get(url[key], { responseType: 'text' }).pipe(map((v) => JSON.parse(v) as T));
  }

  hemisphere(c: Creature) {
    if (this.settings.generals.hemisphere_north) {
      return c.hemispheres.north;
    } else {
      return c.hemispheres.south;
    }
  }

  /**
   * @description 非破壊的
   */
  RemoveNull<T>(src: T): Partial<T> {
    const result: Partial<T> = {};
    for (let k of Object.keys(src) as (keyof T)[]) {
      if (src[k] == null) {
      } else if (typeof src[k] === 'object') {
        let a = src[k];
        result[k] = this.RemoveNull(src[k]) as any;
      } else {
        result[k] = src[k];
      }
    }
    return result;
  }

  image(s: string) {
    return this.items.find((i) => i.name === s)?.inventoryImage || '';
  }

  series(s: string) {
    return this.items.find((i) => i.name === s)?.seriesTranslations?.japanese || '';
  }
}

export type ItemJ = Item & {
  nameJ: string;
  // nameH: string;
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
  // nameH: string;
  // checked: boolean;
};
export type ICreatureJ = ICreature & {
  nameJ: string;
  // nameH: string;
  // checked: boolean;
  // discriptionJ: string;
  // catchPhraseJ: string;
};

export const variantId = (v: VariationElement) => v.variantId || v.variation?.toString() || 'undefined';
