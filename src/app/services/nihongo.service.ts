import { Injectable } from '@angular/core';

//@ts-ignore
import * as romaji from "@koozaki/romaji-conv";

@Injectable({
  providedIn: 'root'
})
export class NihongoService {

  constructor() { }

  toHiragana(s: string) {
    return romaji(s).toHiragana();
  }

  compareKana(a: string, b: string): number {
    return a.localeCompare(b, "ja");
  }

}

