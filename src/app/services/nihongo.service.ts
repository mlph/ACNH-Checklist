import { Injectable } from '@angular/core';
//@ts-ignore
import * as romaji from "@koozaki/romaji-conv";

import naturalKanaOrder from "jaco/fn/naturalKanaOrder";
// import toHiragana from "jaco/fn/toHiragana";

const num = /[0-9０-９]/;
const alph = /[a-zA-Zａ-ｚＡ-Ｚ]/;



@Injectable({
  providedIn: 'root'
})
export class NihongoService {


  constructor() {
    // try {
    //   console.log(this.match("あいうえお", "あ"), true);
    //   console.log(this.match("あいうえお", "-あ"), false);
    //   console.log(this.match("あいうえお", "あい うえ"), true);
    //   console.log(this.match("あいうえお", "あい おか"), false);
    //   console.log(this.match("あいうえお", "あい -う"), false);
    //   console.log(this.match("あいうえお", "あ -か"), true);
    //   console.log(this.match("あいうえお", "か"), false);
    //   console.log(this.match("あいうえお", "-か"), true);
    // } catch (e) {
    //   console.log(1);
    // }
  }

  toHiragana(s: string):string {
    return romaji(s).toHiragana();
  }

  match(target: string, search: string): boolean {
    const startsWithminus = (s: string) => s.startsWith("-");
    const includes = (ta: string, se: string) => this.toHiragana(ta).includes(this.toHiragana(se)) || ta.toUpperCase().includes(se.toUpperCase());
    const ws = search.split(/\s/);

    return ws.every(w => {
      if (startsWithminus(w)) {
        return !includes(target, w.substring(1));
      } else {
        return includes(target, w);
      }
    });

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

