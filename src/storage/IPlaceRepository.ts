import { Place, PlaceFilter, SortOption, Visit } from "@/types";

export interface IPlaceRepository {
  list(filter?: PlaceFilter, sort?: SortOption): Promise<Place[]>;
  get(id: string): Promise<Place | null>;
  createPlaceWithFirstVisit(
    placeBase: Omit<Place, "id" | "visits" | "createdAt" | "updatedAt">,
    visit: Omit<Visit, "id">
  ): Promise<Place>;
  addVisit(placeId: string, visit: Omit<Visit, "id">): Promise<Place>;
  updatePlace(place: Place): Promise<Place>;
  removePlace(id: string): Promise<void>;
  exportCsv(filter?: PlaceFilter): Promise<string>;
  getSuggestions(): Promise<{
    countries: string[];
    cities: string[];
    stations: string[];
    lines: string[];
  }>;
}
