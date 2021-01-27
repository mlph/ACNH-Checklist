import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Catalog, Category, Item, VariationElement } from 'animal-crossing/lib/types/Item';
import { DataService, ItemJ, variantId } from 'src/app/services/data.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslationService } from 'src/app/services/translation.service';

import { NihongoService } from 'src/app/services/nihongo.service';
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
  diystate = ["全て", "DIYのみ", "DIY以外"];
  diy = { state: this.diystate[0] };

  search = "";
  private _search = "";
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
      id: "raw",
      header: "データ",
      data: (i: ItemJ) => JSON.stringify(i, undefined, 2),
      sort: false
    },
    {
      id: "var",
      header: "",
      data: (i: ItemJ) => i.variations?.length || "",
      sort: false
    }
  ];

  colData = {
    image: {
      id: "image",
      data: (i: ItemJ): { src: string, name?: string; }[] => {
        const result: { src: string, name?: string; }[] = [];
        [i.image, i.closetImage, i.albumImage, i.framedImage, i.storageImage, i.inventoryImage].forEach(v => {
          if (v) {
            result.push({ src: v });
          }
        });
        if (i.variations) {
          result.push(...i.variations.map(v => ({
            src: v.image || v.closetImage || v.storageImage || "",
            name: v.variantTranslations?.japanese || v.patternTranslations?.japanese || ""
          })));
        }
        return result;
      },
    },
    source: {
      id: "source"
    },
    variations: {
      id: "variations",
      ja: (v: VariationElement) => v.variantTranslations?.japanese || "" + v.patternTranslations?.japanese || "",
      isChecked: (i: ItemJ, v: VariationElement) => i.checked.variants.find(va => va.variantId === variantId(v))?.checked || false,
      check: (i: ItemJ, v: VariationElement) => {
        const vari = i.checked.variants.find(va => va.variantId === variantId(v));
        if (vari) {
          vari.checked = !vari.checked;
        }
        if (i.variations) {
          if (i.checked.variants.every(va => va.checked)) {
            i.checked.base = "true";
          } else if (i.checked.variants.every(va => !va.checked)) {
            i.checked.base = "false";
          } else {
            i.checked.base = "partial";
          }
        }
        this.settings.checklist.items[i.internalId] = i.checked;
      }
    },
    var: {
      id: "var",
      exist: (i: ItemJ) => !!i.variations
    },
    check: {
      id: "check",
      icon: (i: ItemJ) => {
        switch (i.checked.base) {
          case "true": return "check_box";
          case "false": return "check_box_outline_blank";
          case "partial": return "indeterminate_check_box";
        }
      },
      checked: (i: ItemJ) => {
        if (i.variations && i.variations.length > 0) {
        } else {
          i.checked.base = i.checked.base === "false" ? "true" : "false";
        }
        this.settings.checklist.items[i.internalId] = i.checked;
      },
      isChecked: (i: ItemJ) => i.checked.base === "true"
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
    this.col = [this.colData.check.id, "name", this.colData.var.id, this.colData.image.id, "source", "catalog", this.colData.variations.id, "raw"];
    // console.log(this.settings.items)
    if (!this.settings.items.image) {
      this.col = this.col.filter(v => v !== this.colData.image.id);
    }
    if (!this.settings.items.data) {
      this.col = this.col.filter(v => v !== "raw");
    }
    if (!this.settings.items.variants) {
      this.col = this.col.filter(v => v !== this.colData.variations.id);
    }
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
      .filter(d => this.categories.find(c => c.key === d.sourceSheet)?.checked)
      .filter(this.SearchWord)
      .filter(d => this.catalogForSale ? d.catalog === Catalog.ForSale : true)
      .filter(d => {
        switch (this.diy.state) {
          case (this.diystate[1]): return d.diy === true;
          case (this.diystate[2]): return d.diy === false;
          default: return true;
        }
      })
      .sort((a, b) => {
        const isAsc = this.lastSort.direction === 'asc';
        switch (this.lastSort.active) {
          case 'name': return compare(a.nameJ, b.nameJ, isAsc);
          case 'source': return compare_ItemSource(a.source, b.source, isAsc);
          case 'catalog': return compare(a.catalog, b.catalog, isAsc);
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

  SearchWord = (d: ItemJ) => {
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
};




const firstOrUndefined = <T>(a: Array<T> | null | undefined) => {
  if (a) {
    return a[0];
  }
  return undefined;
};

