import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { CreatureSourceSheet } from 'animal-crossing/lib/types/Creature';
import { DataService, ICreatureJ } from 'src/app/services/data.service';
import { NihongoService } from 'src/app/services/nihongo.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslationService } from 'src/app/services/translation.service';
import { SettingsComponent } from '../settings/settings.component';

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

  // filt = {
  //   month: [],
  //   time: []
  // };

  month = -1;
  time = -1;

  highlightCurrentTime = true;


  search = "";
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
    {
      id: "category",
      header: "カテゴリ",
      data: (i: ICreatureJ) => this.t.CreatureSourceSheet(i.sourceSheet),
      sort: true
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
        this.settings.needToSave = true;
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
      hem: (i: ICreatureJ) => this.data.hemisphere(i),
      time: (i: ICreatureJ) => {
        const t = this.data.hemisphere(i).timeArray;
        if (typeof this.data.hemisphere(i).timeArray[0] === "number") {
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
    this.col = this.settings.headers("creatures").filter(i => i.enable).map(i => i.key);
  }
  OpenSettings() {
    // this.settings.open(this.settings.headers("creatures"));
    this.dialog.open(SettingsComponent, { data: { header: "creatures", subj: this.settings.headerChanged } });

  }


  Filter() {
    const compare = <T>(a?: number | string | T, b?: number | string | T) => {
      if (b == null) { return -1; }
      if (a == null) { return 1; }
      if (typeof a === "string" && typeof b === "string") {
        return this.nihongo.compareKana(a, b);
      }
      return (a < b ? -1 : 1);
    };

    const compare_id = (a: ICreatureJ, b: ICreatureJ) => {
      const category = (c: ICreatureJ) => {
        switch (c.sourceSheet) {
          case CreatureSourceSheet.Insects: return 0;
          case CreatureSourceSheet.Fish: return 1;
          case CreatureSourceSheet.SeaCreatures: return 2;
        }
      };
      const sub = category(a) - category(b);
      if (sub !== 0) {
        return sub;
      }
      return a.num - b.num;
    };

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
      .filter(d => {
        if (this.month === -1) { return true; }
        return this.data.hemisphere(d).monthsArray.includes(this.month);
      })
      .filter(d => {
        if (this.time === -1) { return true; }
        return this.data.hemisphere(d).timeArray.includes(this.time);
      })
      .sort((a, b) => {
        const isAsc = this.lastSort.direction === 'asc' ? 1 : -1;
        switch (this.lastSort.active) {
          case 'name': return compare(a.nameJ, b.nameJ) * isAsc;
          case 'id': return compare_id(a, b) * isAsc;
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
    return this.nihongo.match(d.nameJ, this.search);
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

  IsNow_m(m: number) {
    return (new Date()).getMonth() + 1 === m;
  }

  IsNow_t(t: number) {
    return (new Date()).getHours() === t;
  }
}
