import { Injectable } from '@angular/core';
import { Catalog, Category } from 'animal-crossing/lib/types/Item';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor() { }


  ItemsSource(source?: string | null) {
    // switch (source) {
    //   case "Crafting": return "DIY";
    //   case "Nook Miles Redemption": return "たぬきマイレージ";
    //   case "Nook's Cranny": return "たぬき商店";
    //   case "Saharah": return "ローラン";
    //   case "Redd's Raffle": return "つねきちのくじ";
    //   case "Cyrus": return "カイゾー";
    //   case "Gullivarrr": return "かいぞく";
    //   case "Mom": return "はは";
    //   case "Kicks": return "シャンク";
    //   case "C.J.": return "ジャスティン";
    //   case "Nook Shopping Seasonal": return "たぬきショッピング 季節の商品";
    //   case "Flick": return "レックス";
    //   case "Dodo Airlines": return "ドードーエアライン";
    //   case "Jolly Redd's Treasure Trawler": return "つねきちの船";
    //   case "Able Sisters": return "エイブルシスターズ";
    //   case "Label": return "ことの";
    //   case "Gulliver": return "ジョニー";
    //   case "Nintendo": return "ニンテンドー";
    //   default: return no(source);
    // }
    if (!source) {
      return no(source);
    }
    const c: Record<string, string> = {
      Saharah: "ローラン", Gullivarrr: "かいぞく", "C.J.": "ジャスティン", Flick: "レックス",
      Label: "ことの", Gulliver: "ジョニー", Kicks: "シャンク", Leif: "レイジ",
      Pascal: "ラコスケ", "Daisy Mae": "ウリ",
      Cyrus: "カイゾー", Reese: "リサ", Franklin: "フランクリン", Jack: "パンプキング",
      Jingle: "ジングル", Zipper: "ぴょんたろう", Rover: "みしらぬネコ",
      "Tom Nook": "たぬきち", "K.K. concert": "とたけけ", Isabelle: "しずえ", Wilbur: "ロドリー", Blathers: "フータ",
      Villagers: "島民", "All villagers": "島民",
      Mom: "はは", Nintendo: "ニンテンドー", Luna: "ゆめみ", HHA: "ハッピーホームアカデミー",

      "Catching with a net": "あみでキャッチする", "Fishing": "つり",
      "Hardwood Tree": "こうようじゅ", "Cedar Tree": "しんようじゅ",
      "Cherry Tree": "さくらんぼの木", "Apple Tree": "リンゴの木", "Coconut Tree": "ヤシの木",
      "Orange Tree": "オレンジの木", "Peach Tree": "モモの木", "Pear Tree": "ナシの木",
      "Chopping a bamboo tree": "竹を切る", "Chopping a tree": "木を切る",
      "Shaking a hardwood or cedar tree": "木を揺する",
      Crafting: "DIY",

      "Nook's Cranny": "たぬき商店",
      "Nook Miles Redemption": "たぬきマイレージ",
      "Nook Shopping Seasonal": "たぬきショッピング 季節の商品",
      "Nook Shopping Daily Selection": "たぬきショッピング ひがわり",
      "Nook Shopping Posters": "たぬきショッピング ポスター",
      "Recycle box": "リサイクルボックス",

      "Jolly Redd's Treasure Trawler": "つねきちの船",
      "Redd's Raffle": "つねきちのくじ",
      "Dodo Airlines": "ドードーエアライン",
      "Able Sisters": "エイブルシスターズ",

      "Nook Shopping Promotion": "ポケットキャンプコラボ",

      "Assessing fossils": "かせきのかんてい",
      "Starting items": "はじめから持っている",
      "High Friendship": "島民と仲良くなる",
      "Wishing on shooting stars": "流れ星",
      "Check Toy Day stockings the day after Toy Day": "クリスマスプレゼント",
      Birthday: "たんじょうび",

      Beach: "すなはま"
    };
    return c[source] || no(source);
  }
  // "Planting an apple", "Planting a coconut", "Planting an orange", "Planting a pear", "Planting a peach", "Planting a cherry",
  // "Planting a cedar sapling", "Planting a bamboo shoot", "Planting a sapling", "Burying bells in a glowing spot",
  // "Picking flowers", "Breeding",

  // "Glowing dig spot", "Dig Spot",
  // "May Day Tour", "Don't return lost item", "Don't return treasure quest item",
  // "Digging up a fully grown bush",
  // "Hitting a rock", "On ground",
  // "Dive spot", "Clam dig spot", "Nook Shopping",
  // "Delivering item for a villager", "Wrapping a present using festive wrapping paper", "Picking pumpkins",
  // "Snowboy", "5-star town status", "Seed bag",
  // "Mail", "Wrapping a present", "Digging up a pumpkin plant", "Egg balloon", "Expired turnips", "Use a fountain firework";

  Catalog(s?: Catalog | null) {
    switch (s) {
      case Catalog.ForSale: return "購入可";
      case Catalog.NotForSale: return "ひばいひん";
      case null: return "掲載なし";
      case undefined: return "掲載なし";
      default: return no(s);
    }
  }

  Category(c: Category) {
    switch (c) {
      case Category.Accessories: return "アクセサリー";
      case Category.Art: return "びじゅつひん";
      case Category.Bags: return "バッグ";
      case Category.Bottoms: return "ボトムス";
      case Category.ClothingOther: return "その他(服)";
      case Category.DressUp: return "ワンピース";
      case Category.Equipment: return "そうび";
      case Category.Fencing: return "さく";
      case Category.Floors: return "ゆかいた";
      case Category.Fossils: return "かせき";
      case Category.Headwear: return "かぶりもの";
      case Category.Housewares: return "かぐ";
      case Category.MessageCards: return "メッセージカード";
      case Category.Miscellaneous: return "こもの";
      case Category.Music: return "ミュージック";
      case Category.Other: return "その他";
      case Category.Photos: return "しゃしん";
      case Category.Posters: return "ポスター";
      case Category.Rugs: return "ラグ";
      case Category.Shoes: return "くつ";
      case Category.Socks: return "くつした";
      case Category.Tools: return "どうぐ";
      case Category.Tops: return "トップス";
      case Category.Umbrellas: return "かさ";
      case Category.WallMounted: return "かべかけ";
      case Category.Wallpaper: return "かべがみ";
      default: return c;
    }
  }

}


const no = (s?: string | null) => `no trans[${s}]`;