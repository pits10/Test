"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getRepository } from "@/storage/repository";
import { Place } from "@/types";
import { getRecommendationReasons } from "@/lib/score";
import { format } from "date-fns";

export default function DetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlace = async () => {
      const repo = getRepository();
      const data = await repo.get(id);
      setPlace(data);
      setLoading(false);
    };

    loadPlace();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("本当に削除しますか？")) return;

    const repo = getRepository();
    await repo.removePlace(id);
    alert("削除しました");
    router.push("/list");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p>データが見つかりません</p>
        <Button onClick={() => router.push("/list")}>一覧に戻る</Button>
      </div>
    );
  }

  const recommendations = getRecommendationReasons(place);

  return (
    <div className="min-h-screen p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{place.name}</h1>
        <Badge variant={place.type === "hotel" ? "default" : "secondary"}>
          {place.type === "hotel" ? "ホテル" : "店舗"}
        </Badge>
      </div>

      {/* 基本情報 */}
      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">国</p>
              <p className="font-medium">{place.country}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">都市</p>
              <p className="font-medium">{place.city}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">最寄駅</p>
              <p className="font-medium">{place.nearestStation}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">路線</p>
              <p className="font-medium">{place.line || "-"}</p>
            </div>
          </div>

          {place.area && (
            <div>
              <p className="text-sm text-muted-foreground">エリア</p>
              <p className="font-medium">{place.area}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground">ジャンル</p>
            <p className="font-medium">{place.genre}</p>
          </div>

          {place.tags.length > 0 && (
            <div>
              <p className="mb-2 text-sm text-muted-foreground">タグ</p>
              <div className="flex flex-wrap gap-2">
                {place.tags.map((tag, i) => (
                  <Badge key={i} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* おすすめ理由 */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>おすすめ理由</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 list-disc list-inside">
              {recommendations.map((reason, i) => (
                <li key={i} className="text-sm">
                  {reason}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* 訪問履歴 */}
      <Card>
        <CardHeader>
          <CardTitle>訪問履歴 ({place.visits.length}回)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {place.visits.map((visit) => (
            <div key={visit.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">{visit.createdBy}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(visit.visitedAt), "yyyy年MM月dd日")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    評価: <span className="font-bold">{visit.rating}</span>/5
                  </p>
                  <p className="text-sm">
                    再訪: <span className="font-bold">{visit.revisitIntent}</span>/5
                  </p>
                </div>
              </div>

              {visit.comment && <p className="mb-2 text-sm">{visit.comment}</p>}

              {visit.situation.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {visit.situation.map((sit, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {sit}
                    </Badge>
                  ))}
                </div>
              )}

              {(visit.priceMinJPY || visit.priceMaxJPY) && (
                <p className="text-sm text-muted-foreground">
                  価格: ¥
                  {visit.priceMinJPY?.toLocaleString() || visit.priceMaxJPY?.toLocaleString()}
                  {visit.priceMinJPY !== visit.priceMaxJPY &&
                    visit.priceMaxJPY &&
                    ` - ¥${visit.priceMaxJPY.toLocaleString()}`}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* アクション */}
      <div className="space-y-2">
        <Button variant="outline" className="w-full" onClick={() => router.push("/list")}>
          一覧に戻る
        </Button>
        <Button variant="destructive" className="w-full" onClick={handleDelete}>
          削除
        </Button>
      </div>
    </div>
  );
}
