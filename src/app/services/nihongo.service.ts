import { Injectable } from '@angular/core';
//@ts-ignore
import * as romaji from "@koozaki/romaji-conv";

import naturalKanaOrder from "jaco/fn/naturalKanaOrder";
import toHiragana from "jaco/fn/toHiragana";

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
    const sub = this.char(a[0]) - this.char(b[0]);
    if (sub !== 0) {
      return sub;
    }
    return naturalKanaOrder(a, b);
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

