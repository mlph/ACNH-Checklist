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
  checks = [
    { checked: true, icon: "check_box_outline_blank" },
    { checked: true, icon: "check_box" },
  ];


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
      id: "rawdata",
      header: "データ",
      data: (i: any) => JSON.stringify(i, undefined, 2)
    },
    {
      id: "event",
      header: "イベント",
      data: (i: IRecipeJ) => this.t.SeasonsAndEvents(i.seasonEvent)
    },
    {
      id: "color",
      header: "カードの色",
      data: (i: IRecipeJ) => i.cardColor || "",
      sort: true
    },
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
    check: {
      id: "check",
      check: (i: IRecipeJ) => {
        // i.checked = !i.checked;
        this.settings.checklist.recipes[i.internalId] = !this.settings.checklist.recipes[i.internalId];
      },
      IsChecked: (i: IRecipeJ) => {
        return this.settings.checklist.recipes[i.internalId];
      }
    },
    material: {
      id: "material",
      mats: (i: IRecipeJ) => Object.keys(i.materials).map(m => ({ name: this.t.all(m), count: i.materials[m], image: this.data.image(m) }))
    }
  };

  categories = [
    Category.Tools,
    Category.Housewares,
    Category.Miscellaneous,
    Category.WallMounted,
    Category.Wallpaper,
    Category.Floors,
    Category.Rugs,
    Category.Equipment,
    Category.Other,
  ].map(v => ({ key: v, name: this.t.Category(v), checked: false }));


  constructor(
    private data: DataService,
    public settings: SettingsService,
    public t: TranslationService,
    private nihongo: NihongoService
  ) { }

  ngOnInit(): void {
    this.Filter();
    this.settings.headerChanged.subscribe(v => {
      this.TableColumns();
    });
    this.TableColumns();
  }

  TableColumns() {
    this.col = this.settings.headers("recipes").filter(i => i.enable).map(i => i.key);
  }
  OpenSettings() {
    this.settings.open(this.settings.headers("recipes"));
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
      .filter(d => {
        switch (this.settings.checklist.recipes[d.internalId] || false) {
          case false: return this.checks[0].checked;
          case true: return this.checks[1].checked;
        }
      })
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
          case 'series': return compare(this.data.series(a.name), this.data.series(b.name), isAsc);
          case 'source': return compare_ItemSource(a.source, b.source, isAsc);
          case 'color': return compare(a.cardColor, b.cardColor, isAsc);
          case 'event': return compare(this.t.SeasonsAndEvents(a.seasonEvent), this.t.SeasonsAndEvents(b.seasonEvent), isAsc);
          default: return 0;
        }
      });
    if (this.page < 1) {
      this.page = 1;
    }
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

  clickRow(c: IRecipeJ) {
    if (this.settings.generals.clickRowCheck) {
      this.colData.check.check(c);
    }
  }

}
