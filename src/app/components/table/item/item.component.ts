import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Catalog, Category, InteractEnum, Item, VariationElement } from 'animal-crossing/lib/types/Item';
import { DataService, ItemJ, variantId } from 'src/app/services/data.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslationService } from 'src/app/services/translation.service';

import { NihongoService } from 'src/app/services/nihongo.service';
import { MatDialog } from '@angular/material/dialog';
import { SettingsComponent } from '../../settings/settings.component';
import { MatRow } from '@angular/material/table';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from '../base.component';
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent extends BaseComponent<ItemJ> implements OnInit, OnDestroy {
  key = 'items' as const;

  raw = this.data.items;

  catalogForSale = false;
  diystate = ['全て', 'DIYのみ', 'DIY以外'];
  diy = { state: this.diystate[0] };
  remakestate = ['全て', 'リメイク可能', 'リメイク不可'];
  remake = { state: this.diystate[0] };
  checks = [
    { checked: true, icon: 'check_box_outline_blank', key: 'false' },
    { checked: true, icon: 'check_box', key: 'true' },
    { checked: true, icon: 'indeterminate_check_box', key: 'partial' },
  ];

  col = [];

  colDataSimple = [
    {
      id: 'name',
      header: 'なまえ',
      data: (i: ItemJ) => i.nameJ,
      sort: true,
    },
    {
      id: 'catalog',
      header: 'カタログ',
      data: (i: ItemJ) => this.t.Catalog(i.catalog),
      sort: true,
      autoSortFunc: true,
    },
    // {
    //   id: 'rawdata',
    //   header: 'データ',
    //   data: (i: ItemJ) => JSON.stringify(i, undefined, 2),
    //   sort: false,
    // },
    {
      id: 'var',
      header: '',
      data: (i: ItemJ) => i.variations?.length || '',
      sort: false,
    },
    {
      id: 'series',
      header: 'シリーズ',
      data: (i: ItemJ) => i.seriesTranslations?.japanese || i.series || '',
      sort: true,
      autoSortFunc: true,
    },
    {
      id: 'category',
      header: 'カテゴリ',
      data: (i: ItemJ) => this.t.Category(i.sourceSheet),
      sort: true,
      autoSortFunc: true,
    },
    {
      id: 'size',
      header: 'サイズ',
      data: (i: ItemJ) => i.size,
      sort: true,
      autoSortFunc: true,
    },
    {
      id: 'version',
      header: '追加されたバージョン',
      data: (i: ItemJ) => i.versionAdded,
      sort: true,
      autoSortFunc: true,
    },
    {
      id: 'surface',
      header: '搭載性',
      data: (i: ItemJ) => (i.surface ? 'あり' : 'なし'),
      sort: true,
      autoSortFunc: true,
    },
    {
      id: 'interact',
      header: '使用可能',
      data: (i: ItemJ) => this.t.interact(i.interact),
      sort: true,
      order: [InteractEnum.Workbench, InteractEnum.Wardrobe, InteractEnum.Chair, InteractEnum.Trash, true, false].map(
        this.t.interact
      ),
    },
    {
      id: 'tag',
      header: 'タグ',
      data: (i: ItemJ) => this.t.tag(i.tag),
      sort: true,
      autoSortFunc: true,
    },
  ];

  colData = {
    image: {
      id: 'image',
      data: (i: ItemJ) => {
        const result: { src: string; name?: string[] }[] = [];
        [i.image, i.closetImage, i.albumImage, i.framedImage, i.storageImage, i.inventoryImage].forEach((v) => {
          if (v) {
            result.push({ src: v });
          }
        });
        if (i.variations) {
          result.push(
            ...i.variations.map((v) => ({
              src: v.image || v.closetImage || v.storageImage || '',
              name: [v.variantTranslations?.japanese, v.patternTranslations?.japanese].filter((v) => v) as string[],
            }))
          );
        }
        return result;
      },
    },
    source: {
      id: 'source',
    },
    variations: {
      id: 'variants',
      ja: (v: VariationElement) =>
        [v.variantTranslations?.japanese, v.patternTranslations?.japanese].filter((v) => v).join(','),
      IsChecked: (i: ItemJ, v: VariationElement) => this.vari_IsChecked(i, v),
      check: (i: ItemJ, v: VariationElement) => {
        this.settings.needToSave = true;
        this.settings.itemCheckList(i).variants[variantId(v)] = !this.vari_IsChecked(i, v);

        if (i.variations) {
          if (i.variations.every((va) => this.vari_IsChecked(i, va))) {
            this.settings.itemCheckList(i).base = 'true';
          } else if (i.variations.every((va) => !this.vari_IsChecked(i, va))) {
            this.settings.itemCheckList(i).base = 'false';
          } else {
            this.settings.itemCheckList(i).base = 'partial';
          }
        }
      },
    },
    var: {
      id: 'var',
      exist: (i: ItemJ) => !!i.variations,
    },
    check: {
      id: 'check',
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
          this.settings.itemCheckList(i).base = this.settings.itemCheckList(i).base === 'false' ? 'true' : 'false';
        }
      },
      // isChecked: (i: ItemJ) => i.checked.base === "true",
      IsChecked: (i: ItemJ) => this.settings.itemCheckList(i).base === 'true',
      IsPartial: (i: ItemJ) => this.settings.itemCheckList(i).base === 'partial',
    },
    material: {
      id: 'material',
      mats: (i: ItemJ) =>
        Object.keys(i.recipe?.materials || []).map((m) => ({
          name: this.t.all(m),
          count: i.recipe?.materials[m],
          image: this.data.image(m),
        })),
    },
    rawdata: {
      id: 'rawdata',
      header: 'データ',
      data: (i: ItemJ) => JSON.stringify(i, undefined, 2),
    },
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
  ].map((v) => ({ key: v, name: this.t.Category(v), checked: false }));

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
  ].map((v) => ({ key: v, name: this.t.Category(v), checked: false }));

  categories3 = [
    Category.Tools,
    Category.Music,
    Category.MessageCards,
    Category.Other,
    Category.Equipment,
  ].map((v) => ({ key: v, name: this.t.Category(v), checked: false }));

  categories = this.categories1.concat(this.categories2).concat(this.categories3);

  @ViewChildren(MatRow, { read: ElementRef }) matrow?: QueryList<ElementRef>;

  filter_detail = [];

  constructor(
    data: DataService,
    settings: SettingsService,
    t: TranslationService,
    nihongo: NihongoService,
    dialog: MatDialog
  ) {
    super(data, settings, t, nihongo, dialog);
  }

  Filter() {
    this.filteredData = this._sort(
      this._filter(this.raw)
        .filter((d) => (this.catalogForSale ? d.catalog === Catalog.ForSale : true))
        .filter((d) => {
          switch (this.diy.state) {
            case this.diystate[1]:
              return d.diy === true;
            case this.diystate[2]:
              return d.diy === false;
            default:
              return true;
          }
        })
        .filter((d) => {
          switch (this.remake.state) {
            case this.remakestate[1]:
              return d.kitCost;
            case this.remakestate[2]:
              return !d.kitCost;
            default:
              return true;
          }
        })
    );
    this.PageChange();
  }

  FilterCheck(): (i: ItemJ) => boolean {
    if (this.checks.every((c) => c.checked)) {
      return () => true;
    }
    if (this.checks.every((c) => !c.checked)) {
      return () => false;
    }
    const cs = this.checks.filter((c) => c.checked).map((c) => c.key);
    return (i: ItemJ) => cs.includes(this.settings.itemCheckList(i).base || 'false');
  }

  Sort(): (a: ItemJ, b: ItemJ) => number {
    const isAsc = this.lastSort.direction === 'asc' ? 1 : -1;
    switch (this.lastSort.active) {
      case 'name':
        return (p, q) => this.nihongo.compareKana(p.nameJ, q.nameJ) * isAsc;
      // case 'series':
      //   return (p, q) =>
      //     this.sorthelper_compare(p.seriesTranslations?.japanese, q.seriesTranslations?.japanese) * isAsc;
      case 'source':
        return (p, q) => this.sorthelper_compare_ItemSource(p.source, q.source) * isAsc;
      // case 'catalog':
      //   return (p, q) => this.sorthelper_compare(p.catalog, q.catalog) * isAsc;
      // case 'size':
      //   return (p, q) => this.sorthelper_compare(p.size, q.size) * isAsc;
      // case 'version':
      //   return (p, q) => this.sorthelper_compare(p.versionAdded, q.versionAdded) * isAsc;
      default:
        return () => 0;
    }
  }

  check(i: ItemJ): void {
    this.colData.check.check(i);
  }

  vari_IsChecked = (i: ItemJ, v: VariationElement) => this.settings.itemCheckList(i).variants[variantId(v)];
}
