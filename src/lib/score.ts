import { Place, PlaceWithScore } from "@/types";

export function calculatePlaceScore(place: Place): number {
  if (place.visits.length === 0) return 0;

  const latestVisit = place.visits[place.visits.length - 1];
  const reviewCount = place.visits.length;
  const daysSince = Math.floor(
    (Date.now() - new Date(latestVisit.visitedAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  const recentnessBoost = Math.max(0, 180 - daysSince) / 180;

  const score =
    latestVisit.rating * 0.6 +
    latestVisit.revisitIntent * 0.4 +
    Math.log(reviewCount + 1) * 0.2 +
    recentnessBoost * 0.1;

  return score;
}

export function addScoreToPlaces(places: Place[]): PlaceWithScore[] {
  return places.map((place) => ({
    ...place,
    score: calculatePlaceScore(place),
  }));
}

export function getRecommendationReasons(place: Place): string[] {
  const reasons: string[] = [];
  if (place.visits.length === 0) return reasons;

  const latestVisit = place.visits[place.visits.length - 1];
  
  if (latestVisit.rating >= 4) {
    reasons.push("高評価（★4以上）");
  }
  
  if (latestVisit.revisitIntent >= 4) {
    reasons.push("再訪意欲が高い");
  }

  if (place.visits.length >= 3) {
    reasons.push(`リピート実績あり（${place.visits.length}回訪問）`);
  }

  if (latestVisit.situation.includes("接待")) {
    reasons.push("接待利用実績あり");
  }

  if (place.type === "venue" && place.privateRoom) {
    reasons.push("個室あり");
  }

  const daysSince = Math.floor(
    (Date.now() - new Date(latestVisit.visitedAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSince <= 90) {
    reasons.push("最近利用されている");
  }

  return reasons;
}
