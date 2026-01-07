"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRepository } from "@/storage/repository";
import { DEPARTMENT, VENUE_GENRES, HOTEL_GENRES, SITUATIONS } from "@/lib/constants";

export default function Settings() {
  const [loading, setLoading] = useState(false);

  const addSampleData = async () => {
    setLoading(true);
    const repo = getRepository();

    try {
      // サンプルホテル
      await repo.createPlaceWithFirstVisit(
        {
          type: "hotel",
          name: "東京ビジネスホテル品川",
          country: "日本",
          city: "東京",
          area: "品川",
          nearestStation: "品川駅",
          line: "JR山手線",
          genre: "ビジネス",
          tags: ["駅近", "朝食付き"],
          department: DEPARTMENT,
          hotelType: "business",
          stayType: "short",
          breakfast: true,
          wifiQuality: 4,
          deskWorkFriendly: 4,
          accessScore: 5,
        },
        {
          visitedAt: new Date("2024-01-15"),
          createdBy: "山田太郎",
          rating: 4,
          revisitIntent: 4,
          comment: "駅近で便利。Wi-Fiも快適。",
          situation: ["出張前泊", "予算重視"],
          priceMinJPY: 12000,
          priceMaxJPY: 12000,
        }
      );

      await repo.createPlaceWithFirstVisit(
        {
          type: "hotel",
          name: "大阪グランドホテル",
          country: "日本",
          city: "大阪",
          area: "梅田",
          nearestStation: "梅田駅",
          line: "JR大阪環状線",
          genre: "スタンダード",
          tags: ["朝食美味しい", "清潔"],
          department: DEPARTMENT,
          hotelType: "standard",
          stayType: "short",
          breakfast: true,
          wifiQuality: 5,
          deskWorkFriendly: 3,
          accessScore: 5,
        },
        {
          visitedAt: new Date("2024-02-20"),
          createdBy: "佐藤花子",
          rating: 5,
          revisitIntent: 5,
          comment: "朝食バイキングが豪華。部屋も広くて快適。",
          situation: ["出張後泊"],
          priceMinJPY: 18000,
          priceMaxJPY: 18000,
        }
      );

      // サンプル店舗
      await repo.createPlaceWithFirstVisit(
        {
          type: "venue",
          name: "寿司割烹 銀座",
          country: "日本",
          city: "東京",
          area: "銀座",
          nearestStation: "銀座駅",
          line: "東京メトロ銀座線",
          genre: "寿司",
          tags: ["接待向き", "高級"],
          department: DEPARTMENT,
          venueType: "restaurant",
          privateRoom: true,
          smoking: "no",
          bookingEase: 3,
        },
        {
          visitedAt: new Date("2024-01-25"),
          createdBy: "山田太郎",
          rating: 5,
          revisitIntent: 5,
          comment: "個室で静かに接待できる。ネタも新鮮。",
          situation: ["接待", "ディナー", "雰囲気重視"],
          priceMinJPY: 15000,
          priceMaxJPY: 20000,
        }
      );

      await repo.createPlaceWithFirstVisit(
        {
          type: "venue",
          name: "炭火焼鳥 新橋",
          country: "日本",
          city: "東京",
          area: "新橋",
          nearestStation: "新橋駅",
          line: "JR山手線",
          genre: "焼鳥",
          tags: ["カジュアル", "駅近"],
          department: DEPARTMENT,
          venueType: "izakaya",
          privateRoom: false,
          smoking: "separated",
          bookingEase: 4,
        },
        {
          visitedAt: new Date("2024-03-10"),
          createdBy: "佐藤花子",
          rating: 4,
          revisitIntent: 4,
          comment: "気軽にチーム飯ができる。焼鳥が美味しい。",
          situation: ["チーム飯", "ディナー", "予算重視"],
          priceMinJPY: 5000,
          priceMaxJPY: 8000,
        }
      );

      await repo.createPlaceWithFirstVisit(
        {
          type: "venue",
          name: "イタリアン・トラットリア 渋谷",
          country: "日本",
          city: "東京",
          area: "渋谷",
          nearestStation: "渋谷駅",
          line: "JR山手線",
          genre: "イタリアン",
          tags: ["ワイン", "デート"],
          department: DEPARTMENT,
          venueType: "restaurant",
          privateRoom: false,
          smoking: "no",
          bookingEase: 5,
        },
        {
          visitedAt: new Date("2024-03-20"),
          createdBy: "鈴木一郎",
          rating: 4,
          revisitIntent: 4,
          comment: "パスタとワインが美味しい。雰囲気も良い。",
          situation: ["会食（社外）", "ディナー", "雰囲気重視"],
          priceMinJPY: 8000,
          priceMaxJPY: 10000,
        }
      );

      await repo.createPlaceWithFirstVisit(
        {
          type: "venue",
          name: "バー・ウイスキーラウンジ 六本木",
          country: "日本",
          city: "東京",
          area: "六本木",
          nearestStation: "六本木駅",
          line: "東京メトロ日比谷線",
          genre: "バー",
          tags: ["落ち着いた雰囲気", "ウイスキー"],
          department: DEPARTMENT,
          venueType: "bar",
          privateRoom: false,
          smoking: "no",
          bookingEase: 4,
        },
        {
          visitedAt: new Date("2024-03-15"),
          createdBy: "高橋次郎",
          rating: 5,
          revisitIntent: 5,
          comment: "ウイスキーの品揃えが豊富。バーテンダーの知識も深い。",
          situation: ["バー利用", "二次会"],
          priceMinJPY: 8000,
          priceMaxJPY: 12000,
        }
      );

      alert("サンプルデータを追加しました");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const exportCsv = async () => {
    setLoading(true);
    const repo = getRepository();
    try {
      const csv = await repo.exportCsv();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `places_${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const clearAllData = async () => {
    if (!confirm("本当にすべてのデータを削除しますか？この操作は取り消せません。")) {
      return;
    }

    setLoading(true);
    const repo = getRepository();
    try {
      const places = await repo.list();
      for (const place of places) {
        await repo.removePlace(place.id);
      }
      alert("すべてのデータを削除しました");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>データ管理</CardTitle>
          <CardDescription>サンプルデータの投入、エクスポート、削除</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Button onClick={addSampleData} disabled={loading} className="w-full">
              サンプルデータを追加
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">
              ホテル2件、店舗4件のサンプルデータを追加します
            </p>
          </div>

          <div>
            <Button onClick={exportCsv} disabled={loading} variant="outline" className="w-full">
              CSVエクスポート
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">
              すべてのデータをCSV形式でエクスポートします
            </p>
          </div>

          <div>
            <Button
              onClick={clearAllData}
              disabled={loading}
              variant="destructive"
              className="w-full"
            >
              すべてのデータを削除
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">
              ⚠️ この操作は取り消せません
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>プリセット</CardTitle>
          <CardDescription>現在のプリセット値（将来的に編集可能）</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">店舗ジャンル</h3>
            <p className="text-sm text-muted-foreground">{VENUE_GENRES.join(", ")}</p>
          </div>
          <div>
            <h3 className="font-medium">ホテルジャンル</h3>
            <p className="text-sm text-muted-foreground">{HOTEL_GENRES.join(", ")}</p>
          </div>
          <div>
            <h3 className="font-medium">シチュエーション</h3>
            <p className="text-sm text-muted-foreground">{SITUATIONS.join(", ")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
