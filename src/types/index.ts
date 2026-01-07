// 型定義

export type PlaceType = "hotel" | "venue";

export type VenueType = "restaurant" | "izakaya" | "bar" | "cafe" | "other";
export type HotelType = "business" | "standard" | "luxury" | "apartment" | "other";
export type StayType = "short" | "long" | "unknown";
export type SmokingOption = "no" | "yes" | "separated" | "unknown";

export interface Visit {
  id: string;
  visitedAt: Date;
  createdBy: string;
  rating: number; // 1-5
  revisitIntent: number; // 1-5
  comment: string;
  situation: string[];
  priceMinJPY: number | null;
  priceMaxJPY: number | null;
}

export interface Place {
  id: string;
  type: PlaceType;
  name: string;
  country: string;
  city: string;
  area: string;
  nearestStation: string;
  line: string;
  genre: string;
  tags: string[];
  department: string; // 固定値 "航空宇宙部"
  createdAt: Date;
  updatedAt: Date;
  visits: Visit[];

  // Venue専用
  venueType?: VenueType;
  privateRoom?: boolean | null;
  smoking?: SmokingOption;
  bookingEase?: number | null; // 1-5

  // Hotel専用
  stayType?: StayType;
  breakfast?: boolean | null;
  wifiQuality?: number | null; // 1-5
  deskWorkFriendly?: number | null; // 1-5
  accessScore?: number | null; // 1-5
  hotelType?: HotelType;
}

export interface PlaceFilter {
  type?: PlaceType;
  country?: string;
  city?: string;
  nearestStation?: string;
  line?: string;
  genre?: string;
  situation?: string;
  minRating?: number;
  priceMin?: number;
  priceMax?: number;
  searchText?: string;
}

export type SortOption =
  | "recommended"
  | "rating"
  | "revisitIntent"
  | "visitCount"
  | "recentVisit";

export interface PlaceWithScore extends Place {
  score: number;
}
