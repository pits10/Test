import { IPlaceRepository } from "./IPlaceRepository";
import { IndexedDbPlaceRepository } from "./IndexedDbPlaceRepository";

let repository: IPlaceRepository | null = null;

export function getRepository(): IPlaceRepository {
  if (!repository) {
    repository = new IndexedDbPlaceRepository();
  }
  return repository;
}
