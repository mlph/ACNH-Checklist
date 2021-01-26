import { Injectable } from '@angular/core';
import { npcs, seasonsAndEvents, translations } from 'animal-crossing';
import { Catalog, Category } from 'animal-crossing/lib/types/Item';
import { Type } from 'animal-crossing/lib/types/SeasonsAndEvents';
import { Personality } from 'animal-crossing/lib/types/Villager';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor() { }


  ItemsSource(source?: string | null) {
    if (!source) {
      return no(source);
    }
    const n = npcs.find(v => v.name === source);
    if (n) {
      return n.translations.japanese;
    }

    const c: Record<string, string> = {
      // Saharah: "ローラン", Gullivarrr: "かいぞく", "C.J.": "ジャスティン", Flick: "レックス",
      // Label: "ことの", Gulliver: "ジョニー", Kicks: "シャンク", Leif: "レイジ",
      // Pascal: "ラコスケ", "Daisy Mae": "ウリ",
      // Cyrus: "カイゾー", Reese: "リサ", Franklin: "フランクリン", Jack: "パンプキング",
      // Jingle: "ジングル", Zipper: "ぴょんたろう", Rover: "みしらぬネコ",
      // "Tom Nook": "たぬきち", "K.K. concert": "とたけけ", Isabelle: "しずえ", Wilbur: "ロドリー", Blathers: "フータ",
      //  Luna: "ゆめみ",
      Villagers: "島民", "All villagers": "島民", "Snowboy": "ゆきだるま",
      "All villagers (while stung)": "ハチに刺された状態で島民に話しかける",

      Mom: "はは", Nintendo: "ニンテンドー", HHA: "ハッピーホームアカデミー",
      "K.K. concert": "とたけけライブ",

      "Catching with a net": "あみでキャッチする", "Fishing": "つり", "Hitting a rock": "岩を叩く",
      "Balloons": "風船", "Dive spot": "ダイビング",
      "Glowing dig spot": "光る地面", "Dig Spot": "地面に埋まっている", "Clam dig spot": "砂浜に埋まっている",
      "Burying bells in a glowing spot": "光る地面にベルを埋める",
      "Digging up clams": "アサリを掘り出す",

      "Completing bug Critterpedia": "ムシ図鑑コンプリート", "Completing fish Critterpedia": "サカナ図鑑コンプリート",
      "Breaking 100 axes": "斧を100個壊す", "Gold balloon": "金の風船", "Helping Gulliver 30 times": "ジョニーを30回助ける",

      "Hardwood Tree": "こうようじゅ", "Planting a sapling": "きのなえを植える",
      "Cedar Tree": "しんようじゅ", "Planting a cedar sapling": "しんようじゅのなえを植える",
      "Cherry Tree": "さくらんぼの木", "Planting a cherry": "さくらんぼを植える", "Apple Tree": "リンゴの木", "Planting an apple": "リンゴを植える",
      "Coconut Tree": "ヤシの木", "Planting a coconut": "ヤシのみを植える", "Orange Tree": "オレンジの木", "Planting an orange": "オレンジを植える",
      "Peach Tree": "モモの木", "Planting a peach": "モモを植える", "Pear Tree": "ナシの木", "Planting a pear": "ナシを植える",
      "Chopping a tree": "木を切る", "Shaking a hardwood or cedar tree": "木を揺する",

      "Chopping a bamboo tree": "竹を切る", "Planting a bamboo shoot": "たけのこを植える",

      "Seed bag": "たね",
      "Picking flowers": "花を摘む", "Breeding": "花の交配",
      "Picking pumpkins": "かぼちゃを収穫する",
      "Digging up a fully grown bush": "育った低木をスコップで掘る",
      "Digging up a pumpkin plant": "かぼちゃのなえをスコップで掘る",

      "On ground": "地面に落ちている",
      Beach: "すなはま",

      Crafting: "DIY",

      "Nook's Cranny": "たぬき商店",
      "Nook Miles Redemption": "たぬきマイレージ",
      "Nook Shopping Seasonal": "たぬきショッピング 季節の商品",
      "Nook Shopping Daily Selection": "たぬきショッピング ひがわり",
      "Nook Shopping Posters": "たぬきショッピング ポスター",
      "Recycle box": "リサイクルボックス",

      "Jolly Redd's Treasure Trawler": "つねきちのいなりマーケット",
      "Redd's Raffle": "つねきちのくじ",
      "Dodo Airlines": "ドードーエアライン",
      "Able Sisters": "エイブルシスターズ",

      "Nook Shopping Promotion": "ポケットキャンプコラボ",

      "Assessing fossils": "かせきのかんてい",
      "Starting items": "はじめから持っている",
      "High Friendship": "島民と仲良くなる",
      "Wishing on shooting stars": "流れ星",
      "5-star town status": "島の評価☆5",
      Birthday: "たんじょうび",

      "Don't return lost item": "落とし物を返さない",
      "Wrapping a present": "プレゼントをラッピングする",
      "Wrapping a present using festive wrapping paper": "クリスマスなラッピングペーパーでラッピングする",
      "Expired turnips": "カブを腐らせる",
      "Mail": "手紙", "Nook Shopping": "たぬきショッピング",
      "Don't return treasure quest item": "宝さがしで見つけたアイテムを返さない",
      "Delivering item for a villager": "お届け物",
      "Use a fountain firework": "おきはなびを使う",

      "Check Toy Day stockings the day after Toy Day": "クリスマスプレゼント",
      "Egg balloon": "イースターの風船", "May Day Tour": "メーデーツアー",
      "Egg bottle": "たまごのメッセージボトル",
      "Collecting earth eggs": "じめんのたまごを集める", "Collecting leaf eggs": "はっぱのたまごを集める", "Collecting water eggs": "サカナのたまごを集める",
      "Collecting stone eggs": "いわのたまごを集める", "Collecting sky eggs": "そらとぶたまごを集める", "Collecting wood eggs": "ウッディなたまごを集める",
      "Learning all egg outfit DIYs": "イースターの服のレシピを全てひらめく",
    };

    [Personality.Lazy, Personality.Smug,
    Personality.BigSister, Personality.Peppy,
    Personality.Normal, Personality.Jock,
    Personality.Cranky, Personality.Snooty,].forEach(p => c[`${p} villagers`] = `島民:${this.Personarity(p)}`);


    if (c[source]) {
      return c[source];
    }

    // "Cozy Turkey Day DIY", "Pretty Good Tools Recipes", "Wildest Dreams DIY", "DIY for Beginners", "Test Your DIY Skills",
    const i = translations.find(t => t.english === source);
    if (i) {
      return i.japanese;
    }
    return no(source);
  }


  SeasonsAndEvents(s?: string | null) {
    if (!s) {
      return "";
    }
    const c: Record<string, string> = {
      "Halloween": "ハロウィン", "Toy Day": "クリスマスイブ", "Wedding Season": "ジューンブライド",
      "ornaments": "オーナメント", "mushrooms": "キノコ", "acorns and pine cones": "きのみ","Nature day":"アースデー"
    };
    return s.split("; ").map(ss => {
      if (ss.includes("ready days") || ss.includes("shopping days")) {
        return "";
      }
      if (c[ss]) {
        return c[ss];
      }
      const se = seasonsAndEvents.find(e => e.name === ss);
      if (se) {
        if(se.type === Type.ZodiacSeason){
          return se.translations?.japanese + "ざ"
        }
        return se.translations?.japanese || no(ss);
      }
      return no(ss);
    }).filter(v => v).join(" , ");

    // return no(s);
  }

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

  Personarity(p: Personality) {
    switch (p) {
      case Personality.Lazy: return "ぼんやり";
      case Personality.Normal: return "ふつう";
      case Personality.Peppy: return "げんき";
      case Personality.Jock: return "はきはき";
      case Personality.Cranky: return "こわい";
      case Personality.Snooty: return "おとな";
      case Personality.BigSister: return "あねき";
      case Personality.Smug: return "キザ";
    }
  }

}


const no = (s?: string | null) => `no trans[${s}]`;