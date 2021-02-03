import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { CreatureSourceSheet } from 'animal-crossing/lib/types/Creature';
import { DataService, ICreatureJ } from 'src/app/services/data.service';
import { NihongoService } from 'src/app/services/nihongo.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'app-creature',
  templateUrl: './creature.component.html',
  styleUrls: ['./creature.component.scss']
})
export class CreatureComponent implements OnInit {

  raw = this.data.creature;

  filteredData: ICreatureJ[] = [];
  showingData: ICreatureJ[] = [];

  page = 1;
  row = 100;
  checks = [
    { checked: true, icon: "check_box_outline_blank" },
    { checked: true, icon: "check_box" },
  ];


  search = "";
  private _search = "";
  col = ["name", "source", "catalog"];

  colDataSimple = [
    {
      id: "name",
      header: "なまえ",
      data: (i: ICreatureJ) => i.nameJ,
      key: "nameJ",
      sort: true
    },
    {
      id: "id",
      header: "Id",
      data: (i: ICreatureJ) => i.num,
      key: "num",
      sort: true
    },
    {
      id: "rawdata",
      header: "json",
      data: (i: ICreatureJ) => JSON.stringify(i, undefined, 2),
      sort: false
    },
  ];

  colDataImage = [
    {
      id: "imgIcon",
      header: "アイコン",
      key: "iconImage"
    },
    {
      id: "imgPedia",
      header: "ずかん",
      key: "critterpediaImage"
    },
    {
      id: "imgFurniture",
      header: "かぐ",
      key: "furnitureImage"
    },
  ];

  colData = {
    check: {
      id: "check",
      check: (i: ICreatureJ) => {
        // i.checked = !i.checked;
        this.settings.checklist.creatures[i.internalId] = !this.settings.checklist.creatures[i.internalId];
      },
      IsChecked: (i: ICreatureJ) => {
        return this.settings.checklist.creatures[i.internalId];
      }
    },
    period: {
      id: "period",
      // "hemispheres.north.monthsArray": "",
      // ".hemispheres.north.time": ""
      time: (i: ICreatureJ) => {
        const t = i.hemispheres.north.timeArray;
        if (typeof i.hemispheres.north.timeArray[0] === "number") {
          return t as Array<number>;
        } else {
          return ([] as number[]).concat(...(t as number[][]));
        }
      }
    },
    property: {
      id: "property",
      header: "データ",
      data: (i: ICreatureJ) => {
        switch (i.sourceSheet) {
          case CreatureSourceSheet.Insects: return [
            { key: "天気", value: this.t.weather(i.weather) },
            { key: "場所", value: this.t.wherehow(i.whereHow) },
          ];
          case CreatureSourceSheet.Fish: return [
            { key: "影", value: i.shadow },
            { key: "視界", value: i.vision },
            { key: "場所", value: this.t.wherehow(i.whereHow) },
          ];
          case CreatureSourceSheet.SeaCreatures: return [
            { key: "移動速度", value: i.movementSpeed },
            { key: "影", value: i.shadow },
          ];
        }
      },
      // key:
      sort: false
    },
  };

  _12 = [...Array(12).keys()].map(v => v + 1);
  _24 = [...Array(24).keys()].map(v => v);

  categories = [
    CreatureSourceSheet.Insects,
    CreatureSourceSheet.Fish,
    CreatureSourceSheet.SeaCreatures,
  ].map(v => ({ key: v, name: this.t.CreatureSourceSheet(v), checked: false }));


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
    this.col = this.settings.headers("creatures").filter(i => i.enable).map(i => i.key);
  }
  OpenSettings() {
    this.settings.open(this.settings.headers("creatures"));
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
      .filter(d => {
        switch (this.settings.checklist.creatures[d.internalId] || false) {
          case false: return this.checks[0].checked;
          case true: return this.checks[1].checked;
        }
      })
      .filter(this.SearchWord)
      .sort((a, b) => {
        const isAsc = this.lastSort.direction === 'asc';
        switch (this.lastSort.active) {
          case 'name': return compare(a.nameJ, b.nameJ, isAsc);
          case 'id': return compare(a.num, b.num, isAsc);
          // case 'source': return compare_ItemSource(a.source, b.source, isAsc);
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

  private lastSort: Sort = { active: "id", direction: "asc" };
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

  SearchWord = (d: ICreatureJ) => {
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

  clickRow(c: ICreatureJ) {
    if (this.settings.generals.clickRowCheck) {
      this.colData.check.check(c);
    }
  }
}
