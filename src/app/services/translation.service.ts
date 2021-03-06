import { Injectable } from '@angular/core';
// import { npcs, seasonsAndEvents, translations } from 'animal-crossing';
import {
  CatchDifficulty,
  CreatureSourceSheet,
  LightingType,
  MovementSpeed,
  Shadow,
  Vision,
  Weather,
} from 'animal-crossing/lib/types/Creature';
import { Catalog, Category, InteractEnum } from 'animal-crossing/lib/types/Item';
import { Type } from 'animal-crossing/lib/types/SeasonsAndEvents';
import { Personality } from 'animal-crossing/lib/types/Villager';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  constructor(private data: DataService) {}

  all(s: string) {
    return this.data.translations.find((v) => v.english === s)?.japanese || no(s);
  }

  ItemsSource(source?: string | null) {
    if (!source) {
      return no(source);
    }
    // const n = npcs.find((v) => v.name === source);
    // if (n) {
    //   return n.translations.japanese;
    // }

    const c: Record<string, string> = {
      Saharah: 'ローラン',
      Gullivarrr: 'かいぞく',
      'C.J.': 'ジャスティン',
      Flick: 'レックス',
      Label: 'ことの',
      Gulliver: 'ジョニー',
      Kicks: 'シャンク',
      Leif: 'レイジ',
      Pascal: 'ラコスケ',
      'Daisy Mae': 'ウリ',
      Cyrus: 'カイゾー',
      Reese: 'リサ',
      Franklin: 'フランクリン',
      Jack: 'パンプキング',
      Jingle: 'ジングル',
      Zipper: 'ぴょんたろう',
      Rover: 'みしらぬネコ',
      'Tom Nook': 'たぬきち',
      Isabelle: 'しずえ',
      Wilbur: 'ロドリー',
      Blathers: 'フータ',
      Luna: 'ゆめみ',
      Villagers: '島民',
      'All villagers': '島民',
      Snowboy: 'ゆきだるま',
      'All villagers (while stung)': 'ハチに刺された状態で島民に話しかける',

      Mom: 'はは',
      Nintendo: 'ニンテンドー',
      HHA: 'ハッピーホームアカデミー',
      'K.K. concert': 'とたけけライブ',

      'Catching with a net': 'あみでキャッチする',
      Fishing: 'つり',
      'Hitting a rock': '岩を叩く',
      Balloons: '風船',
      'Dive spot': 'ダイビング',
      'Glowing dig spot': '光る地面',
      'Dig Spot': '地面に埋まっている',
      'Clam dig spot': '砂浜に埋まっている',
      'Burying bells in a glowing spot': '光る地面にベルを埋める',
      'Digging up clams': 'アサリを掘り出す',

      'Completing bug Critterpedia': 'ムシ図鑑コンプリート',
      'Completing fish Critterpedia': 'サカナ図鑑コンプリート',
      'Breaking 100 axes': '斧を100個壊す',
      'Gold balloon': '金の風船',
      'Helping Gulliver 30 times': 'ジョニーを30回助ける',

      'Hardwood Tree': 'こうようじゅ',
      'Planting a sapling': 'きのなえを植える',
      'Cedar Tree': 'しんようじゅ',
      'Planting a cedar sapling': 'しんようじゅのなえを植える',
      'Cherry Tree': 'さくらんぼの木',
      'Planting a cherry': 'さくらんぼを植える',
      'Apple Tree': 'リンゴの木',
      'Planting an apple': 'リンゴを植える',
      'Coconut Tree': 'ヤシの木',
      'Planting a coconut': 'ヤシのみを植える',
      'Orange Tree': 'オレンジの木',
      'Planting an orange': 'オレンジを植える',
      'Peach Tree': 'モモの木',
      'Planting a peach': 'モモを植える',
      'Pear Tree': 'ナシの木',
      'Planting a pear': 'ナシを植える',
      'Chopping a tree': '木を切る',
      'Shaking a hardwood or cedar tree': '木を揺する',

      'Chopping a bamboo tree': '竹を切る',
      'Planting a bamboo shoot': 'たけのこを植える',

      'Seed bag': 'たね',
      'Picking flowers': '花を摘む',
      Breeding: '花の交配',
      'Picking pumpkins': 'かぼちゃを収穫する',
      'Digging up a fully grown bush': '育った低木をスコップで掘る',
      'Digging up a pumpkin plant': 'かぼちゃのなえをスコップで掘る',

      'On ground': '地面に落ちている',
      Beach: 'すなはま',

      Crafting: 'DIY',

      "Nook's Cranny": 'たぬき商店',
      'Nook Miles Redemption': 'たぬきマイレージ',
      'Nook Shopping Seasonal': 'たぬきショッピング 季節の商品',
      'Nook Shopping Daily Selection': 'たぬきショッピング ひがわり',
      'Nook Shopping Posters': 'たぬきショッピング ポスター',
      'Nook Shopping Promotion': 'たぬきショッピング キャンペーン',
      'Recycle box': 'リサイクルボックス',
      'Nook Link': 'タヌポータル',

      "Jolly Redd's Treasure Trawler": 'つねきちのいなりマーケット',
      "Redd's Raffle": 'つねきちのくじ',
      'Dodo Airlines': 'ドードーエアライン',
      'Able Sisters': 'エイブルシスターズ',

      'Assessing fossils': 'かせきのかんてい',
      'Starting items': 'はじめから持っている',
      'High Friendship': '島民と仲良くなる',
      'Wishing on shooting stars': '流れ星',
      '5-star town status': '島の評価☆5',
      Birthday: 'たんじょうび',

      "Don't return lost item": '落とし物を返さない',
      'Wrapping a present': 'プレゼントをラッピングする',
      'Wrapping a present using festive wrapping paper': 'クリスマスなラッピングペーパーでラッピングする',
      'Expired turnips': 'カブを腐らせる',
      Mail: '手紙',
      'Nook Shopping': 'たぬきショッピング',
      "Don't return treasure quest item": '宝さがしで見つけたアイテムを返さない',
      'Delivering item for a villager': 'お届け物',
      'Use a fountain firework': 'おきはなびを使う',

      'Check Toy Day stockings the day after Toy Day': 'クリスマスプレゼント',
      'Egg balloon': 'イースターの風船',
      'May Day Tour': 'メーデーツアー',
      'Egg bottle': 'たまごのメッセージボトル',
      'Collecting earth eggs': 'じめんのたまごを集める',
      'Collecting leaf eggs': 'はっぱのたまごを集める',
      'Collecting water eggs': 'サカナのたまごを集める',
      'Collecting stone eggs': 'いわのたまごを集める',
      'Collecting sky eggs': 'そらとぶたまごを集める',
      'Collecting wood eggs': 'ウッディなたまごを集める',
      'Learning all egg outfit DIYs': 'イースターの服のレシピを全てひらめく',
    };

    [
      Personality.Lazy,
      Personality.Smug,
      Personality.BigSister,
      Personality.Peppy,
      Personality.Normal,
      Personality.Jock,
      Personality.Cranky,
      Personality.Snooty,
    ].forEach((p) => (c[`${p} villagers`] = `島民:${this.Personarity(p)}`));

    if (c[source]) {
      return c[source];
    }

    // "Cozy Turkey Day DIY", "Pretty Good Tools Recipes", "Wildest Dreams DIY", "DIY for Beginners", "Test Your DIY Skills",
    const i = this.data.translations.find((t) => t.english === source);
    if (i) {
      return i.japanese;
    }
    return no(source);
  }

  SeasonsAndEvents(s?: string | null) {
    if (!s) {
      return '';
    }
    const c: Record<string, string> = {
      Halloween: 'ハロウィン',
      'Toy Day': 'クリスマスイブ',
      'Wedding Season': 'ジューンブライド',
      ornaments: 'オーナメント',
      mushrooms: 'キノコ',
      'acorns and pine cones': 'きのみ',
      'Nature Day': 'アースデー',
    };
    return s
      .split('; ')
      .map((ss) => {
        if (ss.includes('ready days') || ss.includes('shopping days')) {
          return '';
        }
        if (c[ss]) {
          return c[ss];
        }
        const se = this.data.seasonsAndEvents.find((e) => e.name === ss);
        if (se) {
          if (se.type === Type.ZodiacSeason) {
            return se.translations?.japanese + 'ざ';
          }
          return se.translations?.japanese || no(ss);
        }
        return no(ss);
      })
      .filter((v) => v)
      .join(' , ');

    // return no(s);
  }

  Catalog(s?: Catalog | null) {
    switch (s) {
      case Catalog.ForSale:
        return '購入可';
      case Catalog.NotForSale:
        return 'ひばいひん';
      case null:
        return '掲載なし';
      case undefined:
        return '掲載なし';
      default:
        return no(s);
    }
  }

  Category(c: Category) {
    switch (c) {
      case Category.Accessories:
        return 'アクセサリー';
      case Category.Art:
        return 'びじゅつひん';
      case Category.Bags:
        return 'バッグ';
      case Category.Bottoms:
        return 'ボトムス';
      case Category.ClothingOther:
        return 'その他(服)';
      case Category.DressUp:
        return 'ワンピース';
      case Category.Equipment:
        return 'そうび';
      case Category.Fencing:
        return 'さく';
      case Category.Floors:
        return 'ゆかいた';
      case Category.Fossils:
        return 'かせき';
      case Category.Headwear:
        return 'かぶりもの';
      case Category.Housewares:
        return 'かぐ';
      case Category.MessageCards:
        return 'メッセージカード';
      case Category.Miscellaneous:
        return 'こもの';
      case Category.Music:
        return 'ミュージック';
      case Category.Other:
        return 'その他';
      case Category.Photos:
        return 'しゃしん';
      case Category.Posters:
        return 'ポスター';
      case Category.Rugs:
        return 'ラグ';
      case Category.Shoes:
        return 'くつ';
      case Category.Socks:
        return 'くつした';
      case Category.Tools:
        return 'どうぐ';
      case Category.Tops:
        return 'トップス';
      case Category.Umbrellas:
        return 'かさ';
      case Category.WallMounted:
        return 'かべかけ';
      case Category.Wallpaper:
        return 'かべがみ';
      default:
        return c;
    }
  }

  CreatureSourceSheet(s: CreatureSourceSheet) {
    switch (s) {
      case CreatureSourceSheet.Fish:
        return 'サカナ';
      case CreatureSourceSheet.Insects:
        return 'ムシ';
      case CreatureSourceSheet.SeaCreatures:
        return 'うみのさち';
    }
  }

  Personarity(p: Personality) {
    switch (p) {
      case Personality.Lazy:
        return 'ぼんやり';
      case Personality.Normal:
        return 'ふつう';
      case Personality.Peppy:
        return 'げんき';
      case Personality.Jock:
        return 'はきはき';
      case Personality.Cranky:
        return 'こわい';
      case Personality.Snooty:
        return 'おとな';
      case Personality.BigSister:
        return 'あねき';
      case Personality.Smug:
        return 'キザ';
    }
  }

  weather(w?: Weather) {
    switch (w) {
      case Weather.AnyWeather:
        return 'いつでも';
      case Weather.RainOnly:
        return '雨';
      case Weather.AnyExceptRain:
        return '雨以外';
      default:
        return '';
    }
    return no();
  }

  wherehow(w?: string) {
    if (!w) {
      return '';
    }
    const c: Record<string, string> = {
      'On trees (any kind)': '木',
      'On palm trees': 'ヤシの木',
      'On hardwood/cedar trees': '広葉樹/針葉樹',
      'Shaking trees': '木を揺する',
      'Shaking trees (hardwood or cedar only)': '広葉樹/針葉樹を揺する',
      'From hitting rocks': '岩を叩く',
      'On the ground': '地面',
      'On tree stumps': '切り株',
      'On rivers/ponds': '川/池',
      'On rocks/bushes': '岩/低木',
      'On beach rocks': '海岸の岩肌',
      Flying: '飛んでいる',
      'Flying near flowers': '花の近くを飛んでいる',
      'Flying near water': '水辺に飛んでいる',
      'Flying near light sources': '光源の近くを飛んでいる',
      'Flying near blue/purple/black flowers': '青/紫/黒の花',
      'Flying near trash (boots, tires, cans, used fountain fireworks) or rotten turnips': 'ゴミの近くを飛んでいる',
      'On flowers': '花の上',
      'On white flowers': '白い花の上',
      'Underground (dig where noise is loudest)': '鳴き声のする場所を掘る',
      'Pushing snowballs': '雪玉を押している',
      'On villagers': '村人',
      'On rotten turnips or candy': 'くさったカブかアメの上',
      'Disguised under trees': '木の下で擬態している',
      'Disguised on shoreline': '砂浜で擬態している',

      River: '川',
      Pond: '池',
      'River (clifftop)': '崖の上',
      'River (mouth)': '河口',
      Sea: '海',
      'Sea (rainy days)': '海(雨の日)',
      Pier: '桟橋',
    };

    return c[w] || no(w);
  }

  catchDifficulty(w?: CatchDifficulty) {
    if (!w) {
      return '';
    }
    switch (w) {
      case CatchDifficulty.VeryEasy:
        return 'とても簡単';
      case CatchDifficulty.Easy:
        return '簡単';
      case CatchDifficulty.Medium:
        return '普通';
      case CatchDifficulty.Hard:
        return '難しい';
      case CatchDifficulty.VeryHard:
        return 'とても難しい';
    }
  }
  movementSpeed(w?: MovementSpeed) {
    if (!w) {
      return '';
    }
    switch (w) {
      case MovementSpeed.Stationary:
        return '動かない';
      case MovementSpeed.VerySlow:
        return 'とても遅い';
      case MovementSpeed.Slow:
        return '遅い';
      case MovementSpeed.Medium:
        return '普通';
      case MovementSpeed.Fast:
        return '速い';
      case MovementSpeed.VeryFast:
        return 'とても速い';
    }
  }
  shadow(w?: Shadow) {
    if (!w) {
      return '';
    }
    switch (w) {
      case Shadow.XSmall:
        return 'とても小さい';
      case Shadow.Small:
        return '小さい';
      case Shadow.Medium:
        return '普通';
      case Shadow.Large:
        return '少し大きい';
      case Shadow.XLarge:
        return '大きい';
      case Shadow.XXLarge:
        return 'とても大きい';
      case Shadow.XLargeWFin:
        return '大きい(背びれ)';
      case Shadow.Long:
        return '長い';
    }
  }
  vision(w?: Vision) {
    if (!w) {
      return '';
    }
    switch (w) {
      case Vision.VeryNarrow:
        return 'とても狭い';
      case Vision.Narrow:
        return '狭い';
      case Vision.Medium:
        return '普通';
      case Vision.Wide:
        return '広い';
      case Vision.VeryWide:
        return 'とても広い';
    }
  }

  interact(w: boolean | InteractEnum | undefined | null) {
    switch (w) {
      case InteractEnum.Chair:
        return '椅子';
      case InteractEnum.Wardrobe:
        return 'タンス';
      case InteractEnum.Workbench:
        return '作業台';
      case InteractEnum.Trash:
        return 'ゴミ箱';
      case true:
        return '可';
      case false:
        return '不可';
      case undefined:
        return '';
      case null:
        return 'null';
      default:
        return no(w);
    }
  }

  tag(w: string | null | undefined) {
    return w;
  }
}

const no = (s?: string | null) => `no trans[${s}]`;
