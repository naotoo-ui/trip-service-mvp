# tripServiceMVP プロダクトノート

Claude Code が毎回このファイルを読み込みます。
気づいたこと・やりたいことを自由に書いてください。次のセッションで私が読んで実装します。

---

## 実装済みの要望

- [x] 移動スポット間に必ず「移動」スポットを挿入する
- [x] 移動スポットに交通手段を最大3択表示（推奨を青色ハイライト）
- [x] 旅行全体のスタイル（rental_car / public_transit / overseas_transit / mixed）を把握して一貫した提案をする
- [x] 目的地パターンで交通手段を自動判定（沖縄→レンタカー、東京→電車、ソウル→公共交通など）

---

## 要望・アイデア（未実装）

<!-- ここに自由に書いてください。Claude が読んで実装します -->

### UIデザイン
<!-- 例: カードのフォント変えたい、色を変えたい、など -->

### AI・旅程生成
<!-- 例: スポット数を増やしたい、グルメ情報をもっと詳しく、など -->

### 機能追加
<!-- 例: PDF出力したい、友達と共有したい、お気に入り保存したい、など -->

### バグ・気になる挙動
<!-- 例: ○○のときに△△になる、など -->

---

## 技術メモ（Claude 向け）

- Gemini モデル: `gemini-2.5-flash-lite`（2.0系は free tier 非対応）
- DB: Supabase（PostgreSQL）、RLS 有効
- デプロイ: Vercel（GitHub push で自動デプロイ）
- スタイル: Tailwind CSS v4
- ルーティング: Next.js 15 App Router
- 交通手段の型: `src/types/index.ts` の `TransportMode` / `TripStyle`
- AI プロンプト: `src/lib/ai/gemini.ts`
