import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Category } from 'animal-crossing/lib/types/Recipe';
import { DataService, IRecipeJ } from 'src/app/services/data.service';
import { NihongoService } from 'src/app/services/nihongo.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {

  raw = this.data.recipe;

  filteredData: IRecipeJ[] = [];
  showingData: IRecipeJ[] = [];

  page = 1;
  row = 100;

  eventstate = ["全て", "季節/イベント限定のみ", "季節/イベント限定を除く"];
  event = { state: this.eventstate[0] };


  search = "";
  private _search = "";
  col = ["name", "image", "source"];

  colDataSimple = [
    {
      id: "name",
      header: "なまえ",
      data: (i: IRecipeJ) => i.nameJ
    },
    // {
    //   id: "catalog",
    //   header: "カタログ",
    //   data: (i: ItemJ) => this.t.Catalog(i.catalog)
    // },
    {
      id: "raw",
      header: "データ",
      data: (i: any) => JSON.stringify(i, undefined, 2)
    },
    {
      id: "event",
      header: "イベント",
      data: (i: IRecipeJ) => this.t.SeasonsAndEvents(i.seasonEvent)
    }
  ];

  colData = {
    image: {
      id: "image",
      data: (i: IRecipeJ): { src: string, name?: string; }[] => {
        const result: { src: string, name?: string; }[] = [];
        [i.image].forEach(v => {
          if (v) {
            result.push({ src: v });
          }
        });
        return result;
      },
    },
    source: {
      id: "source"
    },
    // variations: {
    //   id: "variations",
    //   ja: (v: VariationElement) => v.variantTranslations?.japanese || v.patternTranslations?.japanese
    // },
    // var: {
    //   id: "var",
    //   exist: (i: ItemJ) => !!i.variations
    // }
    check: {
      id: "check",
      icon: (i: IRecipeJ) => {
        switch (i.checked) {
          case true: return "check_box";
          case false: return "check_box_outline_blank";
        }
      },
      checked: (i: IRecipeJ) => {
        i.checked = !i.checked;
        this.settings.checklist.recipes[i.internalId] = i.checked;
      }
    }
  };

  categories = [
    Category.Housewares,
    Category.Miscellaneous,
    Category.WallMounted,
    Category.Wallpaper,
    Category.Rugs,
    Category.Floors,
    Category.Equipment,
    Category.Other,
    Category.Tools,
  ].map(v => ({ key: v, name: this.t.Category(v), checked: false }));


  constructor(
    private data: DataService,
    public settings: SettingsService,
    public t: TranslationService,
    private nihongo: NihongoService
  ) { }

  ngOnInit(): void {
    this.Filter();
    this.settings.settingChanged.subscribe(v => {
      this.TableColumns();
    });
    this.TableColumns();
  }

  TableColumns() {
    this.col = [this.colData.check.id, "name", this.colData.image.id, "source", "raw", "event"];
    if (!this.settings.recipes.image) {
      this.col = this.col.filter(v => v !== this.colData.image.id);
    }
    if (!this.settings.recipes.data) {
      this.col = this.col.filter(v => v !== "raw");
    }
    // if (!this.settings.showVariations) {
    //   this.col = this.col.filter(v => v !== this.colData.variations.id);
    // }
  }


  Filter() {
    const compare = <T>(a?: number | string | T, b?: number | string | T, isAsc?: boolean) => {
      const asc = isAsc ? 1 : -1;
      if (b == null) { return -1 * asc; }
      if (a == null) { return 1 * asc; }
      if (typeof a === "string" && typeof b === "string") {
        return this.nihongo.compareKana(a, b) * asc;
      }
      return (a < b ? -1 : 1) * asc;
    };

    const compare_ItemSource = (a?: Array<string>, b?: Array<string>, isAsc?: boolean) => {
      const asc = isAsc ? 1 : -1;
      if (b == null) { return -1 * asc; }
      if (a == null) { return 1 * asc; }
      for (let i = 0; i < a.length && i < b.length; i++) {
        if (a[i] !== b[i]) {
          return compare(this.t.ItemsSource(a[i]), this.t.ItemsSource(b[i])) * asc;
        }
      }
      return a.length - b.length;
    };

    this._search = this.nihongo.toHiragana(this.search);
    // console.log(this._search);

    this.filteredData = this.raw
      .filter(d => this.categories.find(c => c.key === d.category)?.checked)
      .filter(this.SearchWord)
      .filter(d => {
        switch (this.event.state) {
          case (this.eventstate[1]): return d.seasonEventExclusive;
          case (this.eventstate[2]): return !d.seasonEventExclusive;
          default: return true;
        }
      })
      .sort((a, b) => {
        const isAsc = this.lastSort.direction === 'asc';
        switch (this.lastSort.active) {
          case 'name': return compare(a.nameJ, b.nameJ, isAsc);
          case 'source': return compare_ItemSource(a.source, b.source, isAsc);
          case 'event': return compare(this.t.SeasonsAndEvents(a.seasonEvent), this.t.SeasonsAndEvents(b.seasonEvent), isAsc);
          default: return 0;
        }
      });

    if (this.filteredData.length <= (this.page - 1) * this.row) {
      this.page = 1;
    }
    const s = (this.page - 1) * this.row;
    this.showingData = this.filteredData
      .slice(s, s + this.row);


  }

  private lastSort: Sort = { active: "name", direction: "asc" };
  ReSort(sort: Sort) {
    // console.log(sort);
    this.lastSort = sort;
    this.Filter();
  }

  CategoryButton(c: { checked: boolean; }) {
    c.checked = !c.checked;
    this.Filter();
  }

  CategoryAll(c: { checked: boolean; }[]) {
    if (c.find(i => i.checked)) {
      c.forEach(i => i.checked = false);
    } else {
      c.forEach(i => i.checked = true);
    }
    this.Filter();
  }

  SearchWord = (d: IRecipeJ) => {
    if (!this.search) {
      return true;
    }


    return d.nameH.includes(this._search) || d.nameJ.toUpperCase().includes(this.search.toUpperCase());
  };


  IsNotLast(index: number, a?: Array<any>) {
    if (a && a.length > index + 1) {
      return true;
    }
    return false;
  }

  ToggleState<T>(states: (keyof T)[], current: { state: keyof T; }) {
    // console.log(current);
    const i = states.findIndex(s => s === current.state);
    current.state = states[(i + 1) % states.length];
    this.Filter();
  }
}
