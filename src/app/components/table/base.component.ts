import { Component, ElementRef, Injectable, QueryList } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { CreatureSourceSheet } from 'animal-crossing/lib/types/Creature';
import { Category as ItemCategory } from 'animal-crossing/lib/types/Item';
import { Category as RecipeCategory } from 'animal-crossing/lib/types/Recipe';
import { Subject, Subscription, timer } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { DataService, ICreatureJ, IRecipeJ, ItemJ } from 'src/app/services/data.service';
import { NihongoService } from 'src/app/services/nihongo.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslationService } from 'src/app/services/translation.service';
import { SettingsComponent } from '../settings/settings.component';


@Component({
  template: ''
})
export class BaseComponent<T extends ItemJ | IRecipeJ | ICreatureJ> {
  raw: T[] = [];

  filteredData: T[] = [];
  showingData: T[] = [];
  lastSort: Sort = { active: "name", direction: "asc" };

  searchText = "";

  page = 1;
  row = 100;

  categories: {
    key: ItemCategory | RecipeCategory | CreatureSourceSheet;
    name: string;
    checked: boolean;
  }[] = [];

  key?: "items" | "recipes" | "creatures";
  col: string[] = [];

  scrollSubject = new Subject<string>();
  subsc!: Subscription;
  // @ViewChildren(MatRow, { read: ElementRef }) matrow?: QueryList<ElementRef>;
  matrow?: QueryList<ElementRef>;
  scrollIndex = -1;
  scrollText = "";
  scrollTextReset = true;
  scrollerFocused = false;

  filter_detail: { key: keyof T, value: any, valueType: "string" | "number" | "list" | "boolean" | "never", valueList?: any[], fuzzy?: boolean; }[] = [];
  filter_detail_active: BaseComponent<T>["filter_detail"] = [];

  constructor(
    public data: DataService,
    public settings: SettingsService,
    public t: TranslationService,
    public nihongo: NihongoService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.Filter();
    this.settings.headerChanged.subscribe(v => {
      this.TableColumns();
    });
    this.TableColumns();

    this.ScrollerInit();
  }

  ngOnDestroy() {
    this.subsc.unsubscribe();
  }

  TableColumns() {
    if (this.key) {

      this.col = this.settings.headers(this.key).filter(i => i.enable).map(i => i.key);
    }
  }
  OpenSettings() {
    // this.settings.open(this.settings.headers("items"));
    this.dialog.open(SettingsComponent, { data: { header: this.key, subj: this.settings.headerChanged } });
  }



  _filter(raw: T[]) {
    return raw
      .filter(d => {
        if (this.key === "recipes") {
          const r = d as IRecipeJ;
          return this.categories.find(c => c.key === r.category)?.checked;
        }
        return this.categories.find(c => c.key === d.sourceSheet)?.checked;
      })
      .filter(d => {
        if (this.filter_detail_active.length === 0) {
          return true;
        }
        return this.filter_detail_active.every(f => {
          if (f.fuzzy) {
            return d[f.key] == f.value;
          }
          return d[f.key] === f.value;
        });
      })
      .filter(this.FilterCheck())
      .filter(this.SearchWord);
  }

  _sort(filterd: T[]) {
    return filterd.sort(this.Sort());
  }

  Filter() {
    throw new Error("Not Implemented");
  }

  PageChange() {
    this.page = this.clamp(this.page, 1, Math.ceil(this.filteredData.length / this.row));
    if (this.page < 1) {
      this.page = 1;
    }
    const s = (this.page - 1) * this.row;
    this.showingData = this.filteredData
      .slice(s, s + this.row);
  }

  SortOrderChange(sort: Sort) {
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

  SearchWord = (d: T) => {
    if (!this.searchText) {
      return true;
    }
    return this.nihongo.match(d.nameJ, this.searchText);
  };

  FilterCheck(): ((i: T) => boolean) {
    throw new Error("Not Implemented");
  }

  sorthelper_compare<T>(a?: number | string | T, b?: number | string | T) {
    if (b == null) { return -1; }
    if (a == null) { return 1; }
    if (typeof a === "string" && typeof b === "string") {
      return this.nihongo.compareKana(a, b);
    }
    return (a < b ? -1 : 1);
  };

  sorthelper_compare_ItemSource(a?: Array<string>, b?: Array<string>) {
    if (b == null) { return -1; }
    if (a == null) { return 1; }
    for (let i = 0; i < a.length && i < b.length; i++) {
      if (a[i] !== b[i]) {
        return this.sorthelper_compare(this.t.ItemsSource(a[i]), this.t.ItemsSource(b[i]));
      }
    }
    return a.length - b.length;
  };

  Sort(): ((a: T, b: T) => number) {
    throw new Error("Not Implemented");
  }

  check(i: T): void {
    throw new Error("Not Implemented");
  };

  // @HostBinding("tabIndex") tabIndex!: string;
  // @HostListener("keyup", ["$event"]) onkeyUp(event: KeyboardEvent) {
  // }

  ScrollerInit() {
    this.subsc = this.scrollSubject.pipe(
      tap(s => {
        if (this.scrollTextReset) {
          this.scrollText = "";
        }
        this.scrollText = this.scrollText + s;

        this.ScrollToTarget();
        this.scrollTextReset = false;
      }),
      debounceTime(2000),
      tap(() => this.scrollTextReset = true)
    ).subscribe(() => {
      // console.log(this.scrollText);
    });
  }

  ScrollToTarget() {
    // const index = this.showingData.findIndex(i =>
    //   this.nihongo.toHiragana(i.nameJ).startsWith(this.nihongo.toHiragana(this.scrollText))
    // );
    // if (index >= 0) {
    //   this.ScrollToTargetIndex(index);
    // } else {
    let index = this.filteredData.findIndex(i =>
      this.nihongo.toHiragana(i.nameJ).startsWith(this.nihongo.toHiragana(this.scrollText))
    );
    if (index === -1) {
      index = this.filteredData.findIndex(i =>
        i.nameJ.toUpperCase().startsWith(this.scrollText.toUpperCase())
      );
    }
    if (index === -1) {
      index = this.filteredData.findIndex(i => this.nihongo.match(i.nameJ, this.scrollText));
    }
    if (index >= 0) {
      this.page = Math.ceil((index + 1) / this.row);
      this.PageChange();
      this.ScrollToTargetIndex(index % this.row);
    } else {
      this.scrollIndex = -1;
    }
    // }
  }

  scroller(event: KeyboardEvent) {

    (() => {
      if (event.key.length === 1) {
        return this.scrollSubject.next(event.key);
      }
      switch (event.key) {
        case "Enter":
          if (this.showingData[this.scrollIndex]) {
            this.check(this.showingData[this.scrollIndex]);
          }
          return;
        case "Delete" || "Backspace":
          this.scrollIndex = -1;
          return this.scrollText = "";
        case "PageUp":
          return this.ScrollToTargetIndex(this.clamp(this.scrollIndex - 10, 0, this.showingData.length - 1));
        case "PageDown":
          return this.ScrollToTargetIndex(this.clamp(this.scrollIndex + 10, 0, this.showingData.length - 1));
        case "Home":
          return this.ScrollToTargetIndex(0);
        case "End":
          return this.ScrollToTargetIndex(this.showingData.length - 1);
        case "ArrowUp":
          return this.ScrollToTargetIndex(this.clamp(this.scrollIndex - 1, 0, this.showingData.length - 1));
        case "ArrowLeft":
          this.page = this.page - 1;
          return this.PageChange();
        case "ArrowDown":
          return this.ScrollToTargetIndex(this.clamp(this.scrollIndex + 1, 0, this.showingData.length - 1));
        case "ArrowRight":
          this.page = this.page + 1;
          return this.PageChange();
        default:
          console.log(event.key);
      }
    })();

  }

  ScrollToTargetIndex(index: number) {
    timer(1).subscribe(() => {
      this.scrollIndex = index;
      if (this.matrow) {
        if (this.scrollIndex >= 0) {
          // console.log(this.matrow.toArray(), this.scrollIndex, this.scrollText)
          this.matrow.toArray()[this.scrollIndex]?.nativeElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    });
  }

  focus() {
    this.scrollerFocused = true;
  }

  unfocus() {
    this.scrollIndex = -1;
    this.scrollText = "";
    this.scrollerFocused = false;
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

  clickRow(c: T) {
    if (this.settings.generals.clickRowCheck) {
      this.check(c);
    }
  }

  clamp(a: number, min: number, max: number) {
    if (a < min) {
      return min;
    }
    if (a > max) {
      return max;
    }
    return a;
  };

}
