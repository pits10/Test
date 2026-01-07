"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getRepository } from "@/storage/repository";
import { Place, PlaceFilter, SortOption } from "@/types";
import { Search } from "lucide-react";
import { addScoreToPlaces } from "@/lib/score";

export default function ListPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filter, setFilter] = useState<PlaceFilter>({});
  const [sort, setSort] = useState<SortOption>("recommended");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const repo = getRepository();
      const data = await repo.list(filter, sort);
      setPlaces(data);
    };

    loadData();
  }, [filter, sort]);

  const handleSearch = () => {
    setFilter({ ...filter, searchText });
  };

  const placesWithScore = addScoreToPlaces(places);

  return (
    <div className="min-h-screen p-4 space-y-4">
      <h1 className="text-2xl font-bold">List</h1>

      {/* 検索バー */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <Input
            placeholder="名前、都市、駅、タグで検索..."
            className="pl-10"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
      </div>

      {/* ソート */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">並び替え</label>
          <Select value={sort} onValueChange={(value: any) => setSort(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">おすすめ順</SelectItem>
              <SelectItem value="rating">評価高い順</SelectItem>
              <SelectItem value="revisitIntent">再訪意欲高い順</SelectItem>
              <SelectItem value="visitCount">訪問回数多い順</SelectItem>
              <SelectItem value="recentVisit">最近使った順</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">タイプ</label>
          <Select
            value={filter.type || ""}
            onValueChange={(value: any) => setFilter({ ...filter, type: value || undefined })}
          >
            <SelectTrigger>
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">すべて</SelectItem>
              <SelectItem value="hotel">ホテル</SelectItem>
              <SelectItem value="venue">店舗</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 一覧 */}
      <div className="space-y-4">
        {placesWithScore.map((place) => {
          const latestVisit = place.visits[place.visits.length - 1];
          return (
            <Link key={place.id} href={`/detail/${place.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{place.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {place.city} - {place.nearestStation}駅
                      </CardDescription>
                    </div>
                    <Badge variant={place.type === "hotel" ? "default" : "secondary"}>
                      {place.type === "hotel" ? "ホテル" : "店舗"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{place.genre}</Badge>
                    {place.tags.map((tag, i) => (
                      <Badge key={i} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span>
                        評価: <span className="font-bold">{latestVisit.rating}</span>/5
                      </span>
                      <span>
                        再訪: <span className="font-bold">{latestVisit.revisitIntent}</span>/5
                      </span>
                      <span>訪問: {place.visits.length}回</span>
                    </div>
                    {sort === "recommended" && (
                      <span className="text-xs text-muted-foreground">
                        Score: {place.score.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {latestVisit.comment && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {latestVisit.comment}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {places.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">データがありません</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Settingsからサンプルデータを追加するか、Addから新規登録してください
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
