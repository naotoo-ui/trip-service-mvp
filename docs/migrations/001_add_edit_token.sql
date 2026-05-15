-- Migration: Add edit_token to trips table
-- Date: 2026-05-16
-- Purpose: 編集権限の分離（閲覧URL ≠ 編集URL）
--
-- Supabase Dashboard → SQL Editor で実行してください
-- 既存の旅程は edit_token が NULL のまま残り、コードレベルで「後方互換: 誰でも編集可」となります
-- セキュリティを完全に効かせたい場合は、UPDATE 文で既存旅程にもトークンを発行してください

-- 1) カラム追加
ALTER TABLE trips
ADD COLUMN IF NOT EXISTS edit_token TEXT;

-- 2) (任意) 既存旅程に編集トークンを発行（実行すると、その後その旅程は管理者でないと編集不可）
-- UPDATE trips
-- SET edit_token = encode(gen_random_bytes(16), 'hex')
-- WHERE edit_token IS NULL;

-- 3) (将来) NOT NULL 制約を追加（既存全レコードにトークンを設定した後に実行）
-- ALTER TABLE trips ALTER COLUMN edit_token SET NOT NULL;

-- 確認
-- SELECT share_id, title, edit_token FROM trips ORDER BY created_at DESC LIMIT 10;
