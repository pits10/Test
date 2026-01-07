// プリセット定数

export const DEPARTMENT = "航空宇宙部" as const;

export const VENUE_GENRES = [
  "和食",
  "寿司",
  "焼鳥",
  "焼肉",
  "居酒屋",
  "海鮮",
  "天ぷら",
  "うなぎ",
  "そば・うどん",
  "ラーメン",
  "中華",
  "韓国",
  "タイ・ベトナム",
  "インド・カレー",
  "イタリアン",
  "フレンチ",
  "スペイン・バル",
  "ビストロ",
  "ステーキ",
  "ハンバーガー",
  "カフェ",
  "バー",
  "ワインバー",
  "クラフトビール",
  "その他",
] as const;

export const HOTEL_GENRES = [
  "ビジネス",
  "スタンダード",
  "ラグジュアリー",
  "アパートメント/長期滞在",
  "空港ホテル",
  "その他",
] as const;

export const SITUATIONS = [
  "接待",
  "会食（社外）",
  "チーム飯",
  "一人飯",
  "ディナー",
  "ランチ",
  "二次会",
  "バー利用",
  "出張前泊",
  "出張後泊",
  "長期滞在",
  "早朝移動",
  "予算重視",
  "雰囲気重視",
] as const;

export const VENUE_PRICE_SHORTCUTS = [5000, 8000, 10000, 15000, 20000, 30000] as const;
export const HOTEL_PRICE_SHORTCUTS = [12000, 15000, 20000, 25000, 30000, 40000] as const;

export const VENUE_TYPES = ["restaurant", "izakaya", "bar", "cafe", "other"] as const;
export const HOTEL_TYPES = ["business", "standard", "luxury", "apartment", "other"] as const;
export const STAY_TYPES = ["short", "long", "unknown"] as const;
export const SMOKING_OPTIONS = ["no", "yes", "separated", "unknown"] as const;
