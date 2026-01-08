"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRepository } from "@/storage/repository";
import { Place, PlaceFilter } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filter, setFilter] = useState<PlaceFilter>({});
  const [stations, setStations] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const repo = getRepository();
      const data = await repo.list(filter);
      setPlaces(data);

      const suggestions = await repo.getSuggestions();
      setStations(suggestions.stations);
    };

    loadData();
  }, [filter]);

  useEffect(() => {
    const uniqueGenres = Array.from(new Set(places.map((p) => p.genre))).filter(Boolean);
    setGenres(uniqueGenres);
  }, [places]);

  const hotelCount = places.filter((p) => p.type === "hotel").length;
  const venueCount = places.filter((p) => p.type === "venue").length;
  const countryCount = new Set(places.map((p) => p.country)).size;
  const cityCount = new Set(places.map((p) => p.city)).size;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentCount = places.filter((p) => new Date(p.createdAt) >= thirtyDaysAgo).length;

  const countryData = Array.from(
    places.reduce((acc, p) => {
      acc.set(p.country, (acc.get(p.country) || 0) + 1);
      return acc;
    }, new Map<string, number>())
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const cityData = Array.from(
    places.reduce((acc, p) => {
      acc.set(p.city, (acc.get(p.city) || 0) + 1);
      return acc;
    }, new Map<string, number>())
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const genreData = Array.from(
    places
      .filter((p) => p.type === "venue")
      .reduce((acc, p) => {
        acc.set(p.genre, (acc.get(p.genre) || 0) + 1);
        return acc;
      }, new Map<string, number>())
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="min-h-screen p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>ホテル</CardDescription>
            <CardTitle className="text-3xl">{hotelCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>店舗</CardDescription>
            <CardTitle className="text-3xl">{venueCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>国</CardDescription>
            <CardTitle className="text-3xl">{countryCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>都市</CardDescription>
            <CardTitle className="text-3xl">{cityCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* 主要フィルタ */}
      <Card>
        <CardHeader>
          <CardTitle>フィルタ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium">駅</label>
              <Select
                value={filter.nearestStation || "all"}
                onValueChange={(value) =>
                  setFilter({ ...filter, nearestStation: value === "all" ? undefined : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="すべて" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {stations.map((station) => (
                    <SelectItem key={station} value={station}>
                      {station}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">ジャンル</label>
              <Select
                value={filter.genre || "all"}
                onValueChange={(value) => setFilter({ ...filter, genre: value === "all" ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="すべて" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">タイプ</label>
              <Select
                value={filter.type || "all"}
                onValueChange={(value: any) =>
                  setFilter({ ...filter, type: value === "all" ? undefined : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="すべて" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="hotel">ホテル</SelectItem>
                  <SelectItem value="venue">店舗</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 国別件数 */}
      {countryData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>国別件数</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={countryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* 都市別件数 */}
      {cityData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>都市別件数</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* ジャンル別件数 (venue) */}
      {genreData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>ジャンル別件数（店舗）</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={genreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--chart-3))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

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
