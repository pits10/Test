import { openDB, DBSchema, IDBPDatabase } from "idb";
import { v4 as uuidv4 } from "uuid";
import { Place, PlaceFilter, SortOption, Visit } from "@/types";
import { IPlaceRepository } from "./IPlaceRepository";
import { calculatePlaceScore } from "@/lib/score";

interface PlaceDB extends DBSchema {
  places: {
    key: string;
    value: Place;
    indexes: {
      type: string;
      country: string;
      city: string;
      nearestStation: string;
      genre: string;
    };
  };
}

export class IndexedDbPlaceRepository implements IPlaceRepository {
  private dbName = "PlaceDB";
  private dbVersion = 1;
  private db: IDBPDatabase<PlaceDB> | null = null;

  private async getDb(): Promise<IDBPDatabase<PlaceDB>> {
    if (this.db) return this.db;

    this.db = await openDB<PlaceDB>(this.dbName, this.dbVersion, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("places")) {
          const store = db.createObjectStore("places", { keyPath: "id" });
          store.createIndex("type", "type");
          store.createIndex("country", "country");
          store.createIndex("city", "city");
          store.createIndex("nearestStation", "nearestStation");
          store.createIndex("genre", "genre");
        }
      },
    });

    return this.db;
  }

  async list(filter?: PlaceFilter, sort?: SortOption): Promise<Place[]> {
    const db = await this.getDb();
    let places = await db.getAll("places");

    // フィルタリング
    if (filter) {
      places = places.filter((place) => {
        if (filter.type && place.type !== filter.type) return false;
        if (filter.country && place.country !== filter.country) return false;
        if (filter.city && place.city !== filter.city) return false;
        if (filter.nearestStation && place.nearestStation !== filter.nearestStation)
          return false;
        if (filter.line && place.line !== filter.line) return false;
        if (filter.genre && place.genre !== filter.genre) return false;
        if (filter.minRating) {
          const maxRating = Math.max(...place.visits.map((v) => v.rating));
          if (maxRating < filter.minRating) return false;
        }
        if (filter.situation) {
          const hasSituation = place.visits.some((v) =>
            v.situation.includes(filter.situation!)
          );
          if (!hasSituation) return false;
        }
        if (filter.priceMin || filter.priceMax) {
          const hasMatchingPrice = place.visits.some((v) => {
            if (!v.priceMinJPY && !v.priceMaxJPY) return false;
            if (filter.priceMin && v.priceMaxJPY && v.priceMaxJPY < filter.priceMin)
              return false;
            if (filter.priceMax && v.priceMinJPY && v.priceMinJPY > filter.priceMax)
              return false;
            return true;
          });
          if (!hasMatchingPrice) return false;
        }
        if (filter.searchText) {
          const searchLower = filter.searchText.toLowerCase();
          const matchName = place.name.toLowerCase().includes(searchLower);
          const matchCity = place.city.toLowerCase().includes(searchLower);
          const matchStation = place.nearestStation.toLowerCase().includes(searchLower);
          const matchTag = place.tags.some((tag) =>
            tag.toLowerCase().includes(searchLower)
          );
          if (!matchName && !matchCity && !matchStation && !matchTag) return false;
        }
        return true;
      });
    }

    // ソート
    if (sort) {
      places.sort((a, b) => {
        switch (sort) {
          case "recommended":
            return calculatePlaceScore(b) - calculatePlaceScore(a);
          case "rating": {
            const aRating = a.visits.length > 0 ? a.visits[a.visits.length - 1].rating : 0;
            const bRating = b.visits.length > 0 ? b.visits[b.visits.length - 1].rating : 0;
            return bRating - aRating;
          }
          case "revisitIntent": {
            const aIntent =
              a.visits.length > 0 ? a.visits[a.visits.length - 1].revisitIntent : 0;
            const bIntent =
              b.visits.length > 0 ? b.visits[b.visits.length - 1].revisitIntent : 0;
            return bIntent - aIntent;
          }
          case "visitCount":
            return b.visits.length - a.visits.length;
          case "recentVisit": {
            const aDate =
              a.visits.length > 0
                ? new Date(a.visits[a.visits.length - 1].visitedAt).getTime()
                : 0;
            const bDate =
              b.visits.length > 0
                ? new Date(b.visits[b.visits.length - 1].visitedAt).getTime()
                : 0;
            return bDate - aDate;
          }
          default:
            return 0;
        }
      });
    }

    return places;
  }

  async get(id: string): Promise<Place | null> {
    const db = await this.getDb();
    const place = await db.get("places", id);
    return place || null;
  }

  async createPlaceWithFirstVisit(
    placeBase: Omit<Place, "id" | "visits" | "createdAt" | "updatedAt">,
    visit: Omit<Visit, "id">
  ): Promise<Place> {
    const db = await this.getDb();
    const now = new Date();

    const newVisit: Visit = {
      ...visit,
      id: uuidv4(),
    };

    const newPlace: Place = {
      ...placeBase,
      id: uuidv4(),
      visits: [newVisit],
      createdAt: now,
      updatedAt: now,
    };

    await db.put("places", newPlace);
    return newPlace;
  }

  async addVisit(placeId: string, visit: Omit<Visit, "id">): Promise<Place> {
    const db = await this.getDb();
    const place = await db.get("places", placeId);
    if (!place) throw new Error("Place not found");

    const newVisit: Visit = {
      ...visit,
      id: uuidv4(),
    };

    place.visits.push(newVisit);
    place.updatedAt = new Date();

    await db.put("places", place);
    return place;
  }

  async updatePlace(place: Place): Promise<Place> {
    const db = await this.getDb();
    place.updatedAt = new Date();
    await db.put("places", place);
    return place;
  }

  async removePlace(id: string): Promise<void> {
    const db = await this.getDb();
    await db.delete("places", id);
  }

  async exportCsv(filter?: PlaceFilter): Promise<string> {
    const places = await this.list(filter);
    const rows: string[] = [];

    rows.push(
      [
        "ID",
        "タイプ",
        "名前",
        "国",
        "都市",
        "エリア",
        "最寄駅",
        "路線",
        "ジャンル",
        "タグ",
        "訪問日",
        "入力者",
        "評価",
        "再訪意欲",
        "コメント",
        "シチュエーション",
        "価格最小",
        "価格最大",
      ].join(",")
    );

    for (const place of places) {
      for (const visit of place.visits) {
        const tagsStr = place.tags.join("; ");
        const situationStr = visit.situation.join("; ");
        rows.push(
          [
            place.id,
            place.type === "hotel" ? "ホテル" : "店舗",
            place.name,
            place.country,
            place.city,
            place.area,
            place.nearestStation,
            place.line,
            place.genre,
            tagsStr,
            new Date(visit.visitedAt).toISOString().split("T")[0],
            visit.createdBy,
            visit.rating,
            visit.revisitIntent,
            visit.comment.replace(/,/g, " "),
            situationStr,
            visit.priceMinJPY || "",
            visit.priceMaxJPY || "",
          ].join(",")
        );
      }
    }

    return rows.join("\n");
  }

  async getSuggestions(): Promise<{
    countries: string[];
    cities: string[];
    stations: string[];
    lines: string[];
  }> {
    const places = await this.list();
    const countries = Array.from(new Set(places.map((p) => p.country))).filter(Boolean);
    const cities = Array.from(new Set(places.map((p) => p.city))).filter(Boolean);
    const stations = Array.from(new Set(places.map((p) => p.nearestStation))).filter(
      Boolean
    );
    const lines = Array.from(new Set(places.map((p) => p.line))).filter(Boolean);

    return { countries, cities, stations, lines };
  }
}
