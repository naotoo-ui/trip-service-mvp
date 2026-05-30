-- Migration: Add is_official to trips table
-- Date: 2026-05-30
-- Purpose: 公式モデル旅程（運営側で投入する3000件）とユーザー作成旅程を区別
--
-- Supabase Dashboard → SQL Editor で実行してください

ALTER TABLE trips
ADD COLUMN IF NOT EXISTS is_official BOOLEAN NOT NULL DEFAULT FALSE;

-- フィルタ用インデックス（/explore と /models で頻繁に絞り込む）
CREATE INDEX IF NOT EXISTS idx_trips_is_official_created_at
ON trips (is_official, created_at DESC);

-- 確認
-- SELECT is_official, COUNT(*) FROM trips GROUP BY is_official;
