import { z } from "zod";

// Visit schema
export const visitSchema = z.object({
  id: z.string().uuid(),
  visitedAt: z.date(),
  createdBy: z.string().min(1, "入力者名は必須です"),
  rating: z.number().int().min(1).max(5),
  revisitIntent: z.number().int().min(1).max(5),
  comment: z.string(),
  situation: z.array(z.string()),
  priceMinJPY: z.number().nullable(),
  priceMaxJPY: z.number().nullable(),
});

// Place schema
export const placeSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(["hotel", "venue"]),
  name: z.string().min(1, "店名/ホテル名は必須です"),
  country: z.string().min(1, "国は必須です"),
  city: z.string().min(1, "都市は必須です"),
  area: z.string(),
  nearestStation: z.string().min(1, "最寄駅は必須です"),
  line: z.string(),
  genre: z.string().min(1, "ジャンルは必須です"),
  tags: z.array(z.string()),
  department: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  visits: z.array(visitSchema),

  // Venue専用
  venueType: z.enum(["restaurant", "izakaya", "bar", "cafe", "other"]).optional(),
  privateRoom: z.boolean().nullable().optional(),
  smoking: z.enum(["no", "yes", "separated", "unknown"]).optional(),
  bookingEase: z.number().int().min(1).max(5).nullable().optional(),

  // Hotel専用
  stayType: z.enum(["short", "long", "unknown"]).optional(),
  breakfast: z.boolean().nullable().optional(),
  wifiQuality: z.number().int().min(1).max(5).nullable().optional(),
  deskWorkFriendly: z.number().int().min(1).max(5).nullable().optional(),
  accessScore: z.number().int().min(1).max(5).nullable().optional(),
  hotelType: z.enum(["business", "standard", "luxury", "apartment", "other"]).optional(),
});

// Filter schema
export const placeFilterSchema = z.object({
  type: z.enum(["hotel", "venue"]).optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  nearestStation: z.string().optional(),
  line: z.string().optional(),
  genre: z.string().optional(),
  situation: z.string().optional(),
  minRating: z.number().optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  searchText: z.string().optional(),
});

export type VisitInput = z.infer<typeof visitSchema>;
export type PlaceInput = z.infer<typeof placeSchema>;
export type PlaceFilterInput = z.infer<typeof placeFilterSchema>;
