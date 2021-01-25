import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Catalog, Category, Item } from 'animal-crossing/lib/types/Item';
import { DataService } from 'src/app/services/data.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {


  raw = this.data.data;

  filteredData: ItemJ[] = [];
  showingData: ItemJ[] = [];

  page = 1;
  row = 100;

  catalogForSale = false;
  // categories = this.data.categories.map(v => Object.assign({ checked: false }, v));

  categories1 = [
    Category.Housewares,
    Category.Miscellaneous,
    Category.WallMounted,
    Category.Wallpaper,
    Category.Rugs,
    Category.Floors,
    Category.Art,
    Category.Fencing,
    Category.Fossils,
    Category.Photos,
    Category.Posters,
  ].map(v => ({ key: v, name: this.t.Category(v), checked: false }));

  categories2 = [
    Category.Tops,
    Category.Bottoms,
    Category.DressUp,
    Category.Headwear,
    Category.Accessories,
    Category.Socks,
    Category.Shoes,
    Category.Bags,
    Category.Umbrellas,
    Category.ClothingOther,
  ].map(v => ({ key: v, name: this.t.Category(v), checked: false }));

  categories3 = [
    Category.Equipment,
    Category.MessageCards,
    Category.Music,
    Category.Other,
    Category.Tools,
  ].map(v => ({ key: v, name: this.t.Category(v), checked: false }));

  categories = this.categories1.concat(this.categories2).concat(this.categories3);

  constructor(
    private data: DataService,
    public settings: SettingsService,
    public t: TranslationService
  ) { }

  ngOnInit(): void {
    this.Filter();
  }


  Filter() {
    const s = (this.page - 1) * this.row;
    const compare_ItemSource = (a?: Array<string>, b?: Array<string>, isAsc?: boolean) => {
      const asc = isAsc ? 1 : -1;
      if (b == null) { return -1 * asc; }
      if (a == null) { return 1 * asc; }
      for (let i = 0; i < a.length && i < b.length; i++) {
        if (a[i] !== b[i]) {
          return compare_japanese(this.t.ItemsSource(a[i]), this.t.ItemsSource(b[i])) * asc;
        }
      }
      return a.length - b.length;
    };

    this.filteredData = this.raw
      .filter(d => this.categories.find(c => c.key === d.sourceSheet)?.checked)
      .filter(d => this.catalogForSale ? d.catalog === Catalog.ForSale : true)
      .sort((a, b) => {
        const isAsc = this.lastSort.direction === 'asc';
        switch (this.lastSort.active) {
          case 'name': return compare_japanese(a.nameH, b.nameH, isAsc);
          case 'source': return compare_ItemSource(a.source, b.source, isAsc);
          case 'catalog': return compare(a.catalog, b.catalog, isAsc);
          default: return 0;
        }
      });

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

  _category(i: Item) {

  }
}

const compare = <T>(a?: number | string | T, b?: number | string | T, isAsc?: boolean) => {
  const asc = isAsc ? 1 : -1;
  if (b == null) { return -1 * asc; }
  if (a == null) { return 1 * asc; }
  if (typeof a === "string" && typeof b === "string") {
    return compare_japanese(a, b) * asc;
  }
  return (a < b ? -1 : 1) * asc;
};

const compare_japanese = (a: string, b: string, isAsc = true) => {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
};


const firstOrUndefined = <T>(a: Array<T> | null | undefined) => {
  if (a) {
    return a[0];
  }
  return undefined;
};

type ItemJ = Item & {
  nameJ: string;
  nameH: string;
};
