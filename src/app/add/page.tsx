"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getRepository } from "@/storage/repository";
import { PlaceType } from "@/types";
import { DEPARTMENT, VENUE_GENRES, HOTEL_GENRES, SITUATIONS, VENUE_PRICE_SHORTCUTS, HOTEL_PRICE_SHORTCUTS } from "@/lib/constants";

export default function AddPage() {
  const router = useRouter();
  const [type, setType] = useState<PlaceType>("venue");
  const [loading, setLoading] = useState(false);

  // Place fields
  const [name, setName] = useState("");
  const [country, setCountry] = useState("日本");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [nearestStation, setNearestStation] = useState("");
  const [line, setLine] = useState("");
  const [genre, setGenre] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Visit fields
  const [visitedAt, setVisitedAt] = useState(new Date().toISOString().split("T")[0]);
  const [createdBy, setCreatedBy] = useState("");
  const [rating, setRating] = useState(3);
  const [revisitIntent, setRevisitIntent] = useState(3);
  const [comment, setComment] = useState("");
  const [situation, setSituation] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  // Venue専用
  const [venueType, setVenueType] = useState("restaurant");
  const [privateRoom, setPrivateRoom] = useState<boolean | null>(null);
  const [smoking, setSmoking] = useState("no");
  const [bookingEase, setBookingEase] = useState<number | null>(null);

  // Hotel専用
  const [stayType, setStayType] = useState("short");
  const [breakfast, setBreakfast] = useState<boolean | null>(null);
  const [wifiQuality, setWifiQuality] = useState<number | null>(null);
  const [deskWorkFriendly, setDeskWorkFriendly] = useState<number | null>(null);
  const [accessScore, setAccessScore] = useState<number | null>(null);
  const [hotelType, setHotelType] = useState("business");

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const toggleSituation = (sit: string) => {
    if (situation.includes(sit)) {
      setSituation(situation.filter((s) => s !== sit));
    } else {
      setSituation([...situation, sit]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const repo = getRepository();

      const placeBase: any = {
        type,
        name,
        country,
        city,
        area,
        nearestStation,
        line,
        genre,
        tags,
        department: DEPARTMENT,
      };

      if (type === "venue") {
        placeBase.venueType = venueType;
        placeBase.privateRoom = privateRoom;
        placeBase.smoking = smoking;
        placeBase.bookingEase = bookingEase;
      } else {
        placeBase.stayType = stayType;
        placeBase.breakfast = breakfast;
        placeBase.wifiQuality = wifiQuality;
        placeBase.deskWorkFriendly = deskWorkFriendly;
        placeBase.accessScore = accessScore;
        placeBase.hotelType = hotelType;
      }

      const visit = {
        visitedAt: new Date(visitedAt),
        createdBy,
        rating,
        revisitIntent,
        comment,
        situation,
        priceMinJPY: priceMin ? parseInt(priceMin) : null,
        priceMaxJPY: priceMax ? parseInt(priceMax) : null,
      };

      await repo.createPlaceWithFirstVisit(placeBase, visit);
      alert("登録しました");
      router.push("/list");
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const priceShortcuts = type === "venue" ? VENUE_PRICE_SHORTCUTS : HOTEL_PRICE_SHORTCUTS;
  const genreOptions = type === "venue" ? VENUE_GENRES : HOTEL_GENRES;

  return (
    <div className="min-h-screen p-4 space-y-4">
      <h1 className="text-2xl font-bold">Add</h1>

      <Tabs value={type} onValueChange={(v: any) => setType(v)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="venue">店舗</TabsTrigger>
          <TabsTrigger value="hotel">ホテル</TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">名前 *</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">国 *</label>
                <Input value={country} onChange={(e) => setCountry(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium">都市 *</label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">最寄駅 *</label>
                <Input
                  value={nearestStation}
                  onChange={(e) => setNearestStation(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">路線</label>
                <Input value={line} onChange={(e) => setLine(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">エリア</label>
              <Input value={area} onChange={(e) => setArea(e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-medium">ジャンル *</label>
              <Select value={genre} onValueChange={setGenre} required>
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {genreOptions.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">タグ</label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="タグを入力してEnter"
                />
                <Button type="button" onClick={addTag} variant="outline">
                  追加
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 訪問情報 */}
        <Card>
          <CardHeader>
            <CardTitle>訪問情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">訪問日 *</label>
                <Input type="date" value={visitedAt} onChange={(e) => setVisitedAt(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium">入力者名 *</label>
                <Input value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">評価 (1-5) *</label>
                <Select value={rating.toString()} onValueChange={(v) => setRating(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">再訪意欲 (1-5) *</label>
                <Select value={revisitIntent.toString()} onValueChange={(v) => setRevisitIntent(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">コメント</label>
              <Input value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-medium">シチュエーション</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {SITUATIONS.map((sit) => (
                  <Badge
                    key={sit}
                    variant={situation.includes(sit) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleSituation(sit)}
                  >
                    {sit}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">価格帯（円）</label>
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {priceShortcuts.map((price) => (
                  <Badge
                    key={price}
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => {
                      setPriceMin(price.toString());
                      setPriceMax(price.toString());
                    }}
                  >
                    ¥{price.toLocaleString()}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="最小"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="最大"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={loading} className="w-full">
          登録
        </Button>
      </form>
    </div>
  );
}
