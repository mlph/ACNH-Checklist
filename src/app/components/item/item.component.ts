import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Catalog, Category, Item, VariationElement } from 'animal-crossing/lib/types/Item';
import { DataService, ItemJ, variantId } from 'src/app/services/data.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslationService } from 'src/app/services/translation.service';

import { NihongoService } from 'src/app/services/nihongo.service';
import { MatCheckboxDefaultOptions, MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { SettingsComponent } from '../settings/settings.component';
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  // providers: [
  //   { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions }
  // ]
})
export class ItemComponent implements OnInit {


  raw = this.data.data;

  filteredData: ItemJ[] = [];
  showingData: ItemJ[] = [];

  page = 1;
  row = 100;

  catalogForSale = false;
  diystate = ["全て", "DIYのみ", "DIY以外"];
  diy = { state: this.diystate[0] };
  checks = [
    { checked: true, icon: "check_box_outline_blank", key: "false" },
    { checked: true, icon: "check_box", key: "true" },
    { checked: true, icon: "indeterminate_check_box", key: "partial" },
  ];

  search = "";
  col = ["name", "source", "catalog"];

  colDataSimple = [
    {
      id: "name",
      header: "なまえ",
      data: (i: ItemJ) => i.nameJ,
      sort: true
    },
    {
      id: "catalog",
      header: "カタログ",
      data: (i: ItemJ) => this.t.Catalog(i.catalog),
      sort: true
    },
    {
      id: "rawdata",
      header: "データ",
      data: (i: ItemJ) => JSON.stringify(i, undefined, 2),
      sort: false
    },
    {
      id: "var",
      header: "",
      data: (i: ItemJ) => i.variations?.length || "",
      sort: false
    },
    {
      id: "series",
      header: "シリーズ",
      data: (i: ItemJ) => i.seriesTranslations?.japanese || i.series || "",
      sort: true
    },
    {
      id: "category",
      header: "カテゴリ",
      data: (i: ItemJ) => this.t.Category(i.sourceSheet),
      sort: true
    },
  ];

  colData = {
    image: {
      id: "image",
      data: (i: ItemJ) => {
        const result: { src: string, name?: string[]; }[] = [];
        [i.image, i.closetImage, i.albumImage, i.framedImage, i.storageImage, i.inventoryImage].forEach(v => {
          if (v) {
            result.push({ src: v });
          }
        });
        if (i.variations) {
          result.push(...i.variations.map(v => ({
            src: v.image || v.closetImage || v.storageImage || "",
            name: [v.variantTranslations?.japanese, v.patternTranslations?.japanese].filter(v => v) as string[]
          })));
        }
        return result;
      },
    },
    source: {
      id: "source"
    },
    variations: {
      id: "variants",
      ja: (v: VariationElement) => [v.variantTranslations?.japanese, v.patternTranslations?.japanese].filter(v => v).join(","),
      IsChecked: (i: ItemJ, v: VariationElement) => this.vari_IsChecked(i, v),
      check: (i: ItemJ, v: VariationElement) => {

        this.settings.needToSave = true;
        this.settings.checklist.items[i.internalId] = this.settings.checklist.items[i.internalId] || { base: "false", variants: {} };
        this.settings.checklist.items[i.internalId].variants[variantId(v)] = !this.vari_IsChecked(i, v);

        if (i.variations) {
          if (i.variations.every(va => this.vari_IsChecked(i, va))) {
            this.settings.checklist.items[i.internalId].base = "true";
          } else if (i.variations.every(va => !this.vari_IsChecked(i, va))) {
            this.settings.checklist.items[i.internalId].base = "false";
          } else {
            this.settings.checklist.items[i.internalId].base = "partial";
          }
        }
      }
    },
    var: {
      id: "var",
      exist: (i: ItemJ) => !!i.variations
    },
    check: {
      id: "check",
      // icon: (i: ItemJ) => {
      //   switch (i.checked.base) {
      //     case "true": return "check_box";
      //     case "false": return "check_box_outline_blank";
      //     case "partial": return "indeterminate_check_box";
      //   }
      // },
      check: (i: ItemJ) => {
        if (i.variations && i.variations.length > 0) {
        } else {
          this.settings.needToSave = true;
          this.settings.checklist.items[i.internalId] = this.settings.checklist.items[i.internalId] || { base: "false" };
          this.settings.checklist.items[i.internalId].base = this.settings.checklist.items[i.internalId].base === "false" ? "true" : "false";
        }
      },
      // isChecked: (i: ItemJ) => i.checked.base === "true",
      IsChecked: (i: ItemJ) => this.settings.checklist.items[i.internalId]?.base === "true",
      IsPartial: (i: ItemJ) => this.settings.checklist.items[i.internalId]?.base === "partial"
    },
    material: {
      id: "material",
      mats: (i: ItemJ) => Object.keys(i.recipe?.materials || []).map(m => ({ name: this.t.all(m), count: i.recipe?.materials[m], image: this.data.image(m) }))
    }
  };

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
    public t: TranslationService,
    private nihongo: NihongoService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.Filter();
    this.settings.headerChanged.subscribe(v => {
      this.TableColumns();
    });
    this.TableColumns();
  }

  TableColumns() {
    this.col = this.settings.headers("items").filter(i => i.enable).map(i => i.key);
  }
  OpenSettings() {
    // this.settings.open(this.settings.headers("items"));
    this.dialog.open(SettingsComponent, { data: { header: "items", subj: this.settings.headerChanged } });
  }


  Filter() {

    // console.log(this._search);
    // console.log(this._search);

    // const t = Date.now()

    this.filteredData = this.raw
      .filter(d => this.categories.find(c => c.key === d.sourceSheet)?.checked)
      .filter(this.SearchWord)
      .filter(d => this.catalogForSale ? d.catalog === Catalog.ForSale : true)
      .filter(this.FilterCheck())
      .filter(d => {
        switch (this.diy.state) {
          case (this.diystate[1]): return d.diy === true;
          case (this.diystate[2]): return d.diy === false;
          default: return true;
        }
      })
      .sort(this.Sort());
    // console.log(Date.now() - t)
    // .sort((a, b) => {
    //   const isAsc = this.lastSort.direction === 'asc';
    //   switch (this.lastSort.active) {
    //     case 'name': return compare(a.nameJ, b.nameJ, isAsc);
    //     case 'series': return compare(a.seriesTranslations?.japanese, b.seriesTranslations?.japanese, isAsc);
    //     case 'source': return compare_ItemSource(a.source, b.source, isAsc);
    //     case 'catalog': return compare(a.catalog, b.catalog, isAsc);
    //     default: return 0;
    //   }
    // });

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

  SearchWord = (d: ItemJ) => {
    if (!this.search) {
      return true;
    }
    return this.nihongo.match(d.nameJ, this.search);
    // if (m1 === "true") {
    //   return true;
    // }
    // // console.log(m1, d.nameH, this._search)
    // if (m1 === "never") {
    //   return false;
    // }

    // return this.nihongo.match(d.nameJ.toUpperCase(), this.search.toUpperCase()) === "true";
    // return d.nameH.includes(this._search) || d.nameJ.toUpperCase().includes(this.search.toUpperCase());
  };

  FilterCheck(): ((i: ItemJ) => boolean) {
    if (this.checks.every(c => c.checked)) {
      return () => true;
    }
    if (this.checks.every(c => !c.checked)) {
      return () => false;
    }
    const cs = this.checks.filter(c => c.checked).map(c => c.key);
    return (i: ItemJ) => cs.includes(this.settings.checklist.items[i.internalId]?.base || "false");
  }

  Sort(): ((a: ItemJ, b: ItemJ) => number) {
    const compare = <T>(a?: number | string | T, b?: number | string | T, isAsc?: boolean) => {
      const asc = isAsc ? 1 : -1;
      if (b == null) { return -1 * asc; }
      if (a == null) { return 1 * asc; }
      if (typeof a === "string" && typeof b === "string") {
        return this.nihongo.compareKana(a, b) * asc;
      }
      return (a < b ? -1 : 1) * asc;
    };

    const compare_ItemSource = (a?: Array<string>, b?: Array<string>) => {
      if (b == null) { return -1; }
      if (a == null) { return 1; }
      for (let i = 0; i < a.length && i < b.length; i++) {
        if (a[i] !== b[i]) {
          return compare(this.t.ItemsSource(a[i]), this.t.ItemsSource(b[i]));
        }
      }
      return a.length - b.length;
    };

    const isAsc = this.lastSort.direction === 'asc' ? 1 : -1;
    switch (this.lastSort.active) {
      case 'name': return (p, q) => this.nihongo.compareKana(p.nameJ, q.nameJ) * isAsc;
      case 'series': return (p, q) => compare(p.seriesTranslations?.japanese, q.seriesTranslations?.japanese) * isAsc;
      case 'source': return (p, q) => compare_ItemSource(p.source, q.source) * isAsc;
      case 'catalog': return (p, q) => compare(p.catalog, q.catalog) * isAsc;
      default: return () => 0;
    }
  }


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

  vari_IsChecked = (i: ItemJ, v: VariationElement) => this.settings.checklist.items[i.internalId]?.variants[variantId(v)];

  clickRow(c: ItemJ) {
    if (this.settings.generals.clickRowCheck) {
      this.colData.check.check(c);
    }
  }

};


// declare global {
//   interface Array<T> {
//     tap(interceptor: (t: T) => any): Array<T>;
//   }
// }

// Array.prototype.tap = function (interceptor) {
//   interceptor(this);
//   return this;
// };
