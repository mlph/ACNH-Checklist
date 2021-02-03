import { Injectable } from '@angular/core';
//@ts-ignore
import * as romaji from "@koozaki/romaji-conv";

const num = /[0-9０-９]/;
const alph = /[a-zA-Zａ-ｚＡ-Ｚ]/;

const _daku = ["かが", "きぎ", "くぐ", "けげ", "こご", "さざ", "しじ", "すず", "せぜ", "そぞ", "ただ", "ちぢ", "つづ", "てで", "とど",
  "はばぱ", "ひびぴ", "ふぶぷ", "へべぺ", "ほぼぽ"];

const daku: Map<string, number> = new Map();
for (let i = 0; i < _daku.length; i++) {
  _daku[i].split("").forEach(c => daku.set(c, i + 1));
}


@Injectable({
  providedIn: 'root'
})
export class NihongoService {

  constructor() {

    // const a = ["ショボいつりざお", "ショボいオノ", "ショボいジョウロ", "ジョウロ"].sort((a, b) => this.compareKana(a, b));
    // console.log(a);
  }

  toHiragana(s: string) {
    return romaji(s).toHiragana();
  }

  // compareKana(a: string, b: string): number {
  //   const l = Math.min(a.length, b.length);
  //   for (let i = 0; i < l; i++) {
  //     const sub = this.char(a[i]) - this.char(b[i]);
  //     if (sub !== 0) {
  //       return sub;
  //     }

  //     if (daku.get(a[i]) && daku.get(b[i])) {

  //     }

  //     const sub2 = a[i].localeCompare(b[i], "ja");
  //     if (sub2 !== 0) {
  //       return sub2;
  //     }
  //   }
  //   // return a.localeCompare(b, "ja");
  //   return 0;
  // }

  compareKana(a: string, b: string): number {
    if (a[0] === undefined && b[0] === undefined) {
      return 0;
    }
    if (a[0] === undefined) {
      return -1;
    }
    if (b[0] === undefined) {
      return 1;
    }

    const sub2 = a[0].localeCompare(b[0], 'ja');
    if (a[0] === b[0]) {
      return this.compareKana(a.substring(1), b.substring(1));
    }

    const sub = this.char(a[0]) - this.char(b[0]);
    if (sub !== 0) {
      return sub;
    }

    const an = daku.get(this.toHiragana(a[0]));
    const bn = daku.get(this.toHiragana(b[0]));

    if ((an && bn && an === bn) || sub2 === 0) {
      const i = this.compareKana(a.substring(1), b.substring(1));
      if (i !== 0) {
        return i;
      }
      return sub2;
    }

    return sub2;
  }

  private char(char: string) {
    if (num.test(char)) {
      return 0;
    }
    if (alph.test(char)) {
      return 2;
    }
    return 1;
  }


}

