import { Injectable } from '@angular/core';
//@ts-ignore
import * as romaji from "@koozaki/romaji-conv";

const num = /[0-9０-９]/;
const alph = /[a-zA-Zａ-ｚＡ-Ｚ]/;

@Injectable({
  providedIn: 'root'
})
export class NihongoService {

  constructor() { }

  toHiragana(s: string) {
    return romaji(s).toHiragana();
  }

  compareKana(a: string, b: string): number {
    const l = Math.min(a.length, b.length);
    for (let i = 0; i < l; i++) {
      const sub = this.char(a[i]) - this.char(b[i]);
      if (sub !== 0) {
        return sub;
      }
      const sub2 = a[i].localeCompare(b[i], "ja");
      if (sub2 !== 0) {
        return sub2;
      }
    }
    // return a.localeCompare(b, "ja");
    return 0;
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

