# tripServiceMVP プロダクトノート

> Claude Code が毎回このファイルを読み込みます。
> 最終更新: 2026-05-21

---

## プロジェクト概要

**旅行プランAIジェネレーター** — 条件（目的地・日数・希望）や参考URLを入力すると、AIがリアルな旅程をJSON形式で生成し、カレンダービューで可視化・編集できるWebサービス。

- **Vercel** にデプロイ済み（GitHub push で自動デプロイ）
- **スタック**: Next.js 16 App Router / TypeScript / Tailwind CSS v4 / Supabase(PostgreSQL) / Google Gemini API
- **AI モデル**: `gemini-2.5-flash-lite`（maxOutputTokens: 8192）
- **DB**: Supabase（RLS有効）`trips` テーブル — id, share_id, **edit_token**, title, destination, duration_days, wishes, source_url, itinerary(JSONB), created_at
- **認証**: なし（share_id によるURL共有のみ・暫定的に localStorage で「最近の旅程」を保存）

---

## 🎯 フェーズ 0 — 方向性（暫定・要見直し）

> 開発時に明示的に定めていないため、現状の実装から推察した仮置き。確定したら更新する。

| 項目 | 暫定値 | 備考 |
|------|--------|------|
| **ターゲット** | 20〜30代の国内旅行好き（カップル・友人グループ・家族） | フォームの「グループ種別」選択肢から推測 |
| **コンセプト** | AIで旅行プランを一瞬で作るサービス | LPコピー「旅の計画を、AIが代わりに。」 |
| **解決する課題** | 旅行プランを考えるのが面倒・調べるのに時間がかかる | LP訴求「30秒で生成」 |
| **差別化** | URLを貼るだけでブログ記事から旅程を自動生成できる | Phase 1 の★差別化機能（実装済み） |

---

## 📊 実装進捗マップ

| フェーズ | 状態 | 完了 / 計画 |
|---------|------|-------------|
| **Phase 0** 方向性定義 | ⚠️ 暫定 | 3 / 3 仮置き済 |
| **Phase 1** MVP | ✅ 完了 | 6 / 6 |
| **Phase 2** 初期改善 | 🔨 80% | 4 / 5 |
| **Phase 3** バイラル・SEO | 🔨 20% | 1 / 5（+派生実装多数） |
| **Phase 4** UX強化 | 🔨 25% | 1 / 4（しおり実装済） |
| **Phase 5** 軽い収益化 | ❌ 未着手 | 0 / 3 |
| **Phase 6** 本格収益化 | ❌ 未着手 | 0 / 4 |
| **Phase 7** 差別化拡張 | ❌ 未着手 | 0 / 5 |
| **Phase 8** 上級機能 | ❌ 後回し（仕様通り） | 0 / 4 |
| **番外** インフラ・運用基盤 | ✅ 完了 | 計画外の必須実装 |

### ⚠️ 現在のブロッカー
- **Gemini API Free Tier の1日20リクエスト制限に到達**（公開運用には不適）
- 公開前に [AI コスト・ライセンス](#%EF%B8%8F-ai-コスト・ライセンスgemini-api) セクションを参照して Tier 1 切替判断が必要

---

## ✅ 実装済み機能（フェーズ別マッピング）

### Phase 1 — MVP（100%完了）
- [x] AIによる旅行プラン自動生成（gemini-2.5-flash-lite）
- [x] 移動時間を考慮したスケジュール生成（交通スタイル自動判定：沖縄→レンタカー・東京→電車等）
- [x] 生成した旅程の保存（Supabase trips テーブル）
- [x] 共有URL発行（share_id・8文字ランダム）
- [x] スマホ前提のシンプルUI（モバイル1日表示・タッチ操作対応）
- [x] **★URLを貼るだけでブログ記事から旅程自動生成**（URL最大5本・並行スクレイプ・失敗URL無視）

### Phase 2 — 初期改善（80%完了）
- [x] 旅程の編集機能（カレンダーでドラッグ＆ドロップ・リサイズ・時間変更）
- [x] Google Maps連携（日ごとのDirectionsボタン + スポット詳細・宿泊モーダル内に地図iframe埋込）
- [x] 他ユーザーの旅程閲覧（/explore ページ・カードグリッド・最新順）
- [ ] **観光地情報の自動補完** — 説明文はあり（AI生成）、**画像なし** 🟠
- [ ] **旅行プランの公開/非公開設定** — 現状は全公開状態 🟠

### Phase 3 — バイラル・SEO強化（20%完了 + 派生多数）
- [x] **旅行プランのコピー機能**（POST /api/trips/copy → 新 share_id で複製）
- [ ] **旅程テンプレート化**（「沖縄3日間モデルコース」等の定型表示） 🟠
- [ ] **人気プランランキング**（閲覧数・コピー数による並び順） 🟠
- [ ] **タグ機能**（カップル・グルメ・温泉など） 🟠
- [ ] **SEO用ページ自動生成**（/plans/[destination]/[duration]） 🟠

**派生で実装した Phase 3 関連機能**:
- [x] OGP動的画像生成（LINE・Twitterシェアでリッチプレビュー・/trips/[id]/opengraph-image.tsx）
- [x] LP強化（ヒーロー統合フォーム・How it works・みんなのプラン・Features・FAQ・最終CTA）
- [x] モダンヘッダー（ガラスモーフィズム・グラデーションロゴ・将来のアバター用スロット）

### Phase 4 — UX強化（25%完了）
- [x] **しおり（Web + 印刷 / PDF）自動生成** — `/trips/[id]/booklet`・3テーマ・NOW/NEXT バッジ・A4印刷最適化
- [ ] チェックリスト自動生成（持ち物・やること）
- [ ] 日ごとのToDo管理
- [ ] オフライン閲覧対応（PWA・読み取り専用キャッシュ）

### Phase 5 — 軽い収益化（未着手）
- [ ] 高度AI機能の有料化（細かい条件指定・複数プラン提案）
- [ ] 一部テンプレートの有料化（インフルエンサー連携）
- [ ] 軽い広告導入

### Phase 6 — 本格収益化（未着手・基盤あり）
- [ ] ホテル・航空券のアフィリエイト導線
- [ ] 体験・ツアー予約への送客
- [ ] 旅程内に予約リンクを自然に挿入
- [ ] 「このプランをそのまま予約」ボタン

**基盤**: HotelDetailModal に `booking_url` フィールドあり → じゃらん・楽天等にアフィリエイトパラメータ付きで誘導可

### Phase 7 — 差別化拡張（未着手）
- [ ] AIチャット型旅行相談
- [ ] 予算最適化（最安日程提案）
- [ ] 同行者との共同編集
- [ ] 旅行履歴の蓄積・レコメンド（localStorageベースの基盤あり）
- [ ] LINE連携

### Phase 8 — 上級機能（仕様通り後回し）
- [ ] 予約メール自動解析
- [ ] ビザ・必要書類チェック
- [ ] 当日のQR/予約管理
- [ ] 完全アプリ化（iOS/Android）

### 番外 — インフラ・運用基盤（フェーズ表にない必須実装）

#### 編集体験
- [x] **自動保存**（編集停止から3秒後・debounce・手動保存ボタンも併用）
- [x] **Undo / Redo**（days + sidebarSpots の完全 Snapshot 方式）
- [x] **旅程タイトルのインライン編集**（ダブルクリックで input 化）
- [x] **おすすめスポットパネル**（カレンダー↔双方向ドラッグ）
- [x] **フリーブロックパネル**（型タグをドラッグしてカレンダーに配置）
- [x] **ギャップ注釈方式**（移動ブロックを AI に生成させず・空き時間ラベルで明示）
- [x] **カレンダー宿泊帯**（列ヘッダー直下・シングルクリックで HotelDetailModal）
- [x] **HotelDetailModal**（CI/CO時刻・料金・予約URL・メモ・Google Maps）
- [x] カレンダー sticky ヘッダー（日付＋宿泊帯がスクロール時も固定表示）
- [x] スポット詳細モーダル（種別・所要時間・予約・リンク・メモ・発着時刻・地図）
- [x] **日まとめラベル**（label を列ヘッダーに表示・ダブルクリックで編集・AI が説明的なテーマを生成）
- [x] カレンダー横スクロール無効化（可視領域に常にフィット）

#### 信頼性・権限
- [x] **edit_token による編集権限分離**（閲覧URL ≠ 編集URL・403 forbidden 検証）
- [x] PATCH API での edit_token 検証
- [x] ItineraryEditor の読み取り専用モード（閲覧バナー + コピーCTA）

#### リテンション暫定対応
- [x] **localStorage 「最近の旅程」**（最大20件・owner/viewer 区別）
- [x] ヘッダーに 🕘 最近ボタン（ドロップダウン・件数バッジ）

#### 計測・分析
- [x] **Vercel Analytics** 導入（PV・経路・離脱）

#### インフラ
- [x] GitHub Actions による Supabase keep-alive（3日ごと定期ping）
- [x] Spot の `address` フィールド（AI生成・市区町村＋町名 → Maps 検索精度向上）

---

## 🚀 次にやるべきこと — 優先順位付きロードマップ

### 🔴 公開直前の必須整備（Phase 4-B：1〜2日）

#### 1. 429 エラーハンドリング改善（30分）★最優先
- `/api/plan` `/api/generate` `/api/scrape` で 429 を検知
- 「AI生成のリクエスト上限に達しました」のような分かりやすいメッセージに変換
- フロント側でも429専用UI表示

#### 2. ユーザーあたりレート制限（2〜3時間）
- Tier 1 切替後のコスト爆発防止
- localStorage + IP（または cookie）ベースで「1日 N 回まで」
- 認証導入後はユーザー単位に切替予定

#### 3. Sentry エラー監視（1時間）
- 無料枠（5K errors/月）で十分
- `npx @sentry/wizard@latest -i nextjs`

#### 4. AI 精度改善（2〜4時間）
- プロンプトに「時間矛盾を避ける」「同一スポット重複禁止」を明示
- 生成後のバリデーション関数（重複・時間衝突チェック）
- 失敗ケースのフォールバック処理

#### 5. Gemini Tier 1 切替判断（5分 + $10）
- 上記4項目が入った後、公開直前に決断
- [AI コスト・ライセンス](#%EF%B8%8F-ai-コスト・ライセンスgemini-api) セクション参照

---

### 🟠 Phase 2 の残作業（小工数）

#### 6. 旅程の公開/非公開設定（半日）
- `trips.is_public boolean default true` を追加
- 旅程ページに「公開・非公開」トグル
- `/explore` で is_public=true のみ表示
- → Phase 6 のアフィリエイト導線とも親和性高い（公開のものだけ広告化）

#### 7. 観光地画像の自動補完（1〜2日）
- Wikimedia Commons API（無料・著作権安全）で観光地の代表画像取得
- スポット詳細モーダル・カレンダースポットにサムネ表示
- 旅程カード（TripCard）にも適用してビジュアル強化

---

### 🟠 Phase 3 の残作業（バイラル・SEO）

#### 8. タグ機能（半日〜1日）
- `trips.tags TEXT[]` 追加 or itinerary JSONB 内に格納
- /explore でタグフィルタ（カップル・グルメ・温泉・絶景・家族 など）
- タグはAIに自動推定させる選択肢も

#### 9. SEOページ自動生成（1〜2日）
- `/plans/[destination]/[duration]` を Next.js SSG で生成
- 「沖縄 2泊3日 モデルコース」「京都 1泊2日 おすすめ」等のキーワード狙い
- 公開済み旅程を埋め込み、旅程生成フォームへ誘導
- 月数万 PV のキーワードを取れれば集客の主力に

#### 10. 人気ランキング（数時間）
- `trips.view_count` `trips.copy_count` を追加
- /explore に「人気順」タブ追加
- TripCard に閲覧数・コピー数を小さく表示

---

### 🟡 Phase 4 UX強化（公開後・ユーザー反応次第）

#### 11. PWA化（半日）
- `manifest.json` + service worker
- インストール可能・オフライン読み取り
- ホーム画面追加で再訪率向上

#### 12. チェックリスト機能（1日）
- 旅程ごとに「持ち物・やること」リスト
- 行き先・季節・グループ種別から AI が初期リストを提案
- しおり表紙にも反映

#### 13. しおり機能の拡張（1〜2日）
- スポットへの画像添付（Wikimedia Commons or Supabase Storage）
- 持ち物・連絡先メモを表紙裏に
- QR コードでしおり URL を埋め込み（紙→スマホ復帰）
- 真の PDF 出力（`@react-pdf/renderer`）— 現状は window.print() ベース

---

## 🎨 しおりテーマ拡張仕様（数十パターン・一部有料） — Phase 4 / Phase 5 横断

### コンセプト
「旅のしおり = 自分らしく可愛くカスタマイズできる紙のアルバム」として、**最低 20〜30 パターン**のテーマを用意し、ユーザーが自由に選べる。**無料は10パターン程度、それ以外は有料**（プレミアム解放 or 単体購入）。

### ターゲット層別テーマ群
| カテゴリ | テーマ例 | ターゲット |
|---------|---------|-----------|
| 🌸 ガーリー（無料3＋有料） | Sakura・Pink Ribbon・Strawberry・Romantic Rose | 10代〜20代女性 |
| ☕ ナチュラル（無料2＋有料） | Cream Latte・Botanical・Linen Beige・Dusty Rose | 20代〜30代女性 |
| 🌿 ミント・清涼（無料1＋有料） | Mint Soda・Sky Journal・Ocean Breeze | 全年代女性 |
| 💜 ファンタジー（無料1＋有料） | Lavender Dream・Galaxy・Twilight | 10代〜20代 |
| 📷 ヴィンテージ（無料1＋有料） | Polaroid・Vintage Paper・Retro Travel・Y2K | 20代女性・トレンド層 |
| 🇰🇷 韓国風（有料） | Korean Beige・Minimal Ivory・Seoul Cafe | 10代〜20代女性 |
| 🎄 季節・イベント（有料） | Christmas・Halloween・夏祭り・Valentine | 期間限定 |
| 🏯 和風（有料） | Wagara・Sakura Wa・Edo | 30代以上・海外ユーザー |
| 🖤 シック（無料1＋有料） | Mono・Noir・Charcoal | 男性・大人向け |

### 各テーマに含めるべき要素
1. **配色**（背景・紙・カバー・アクセント・テキスト・サブテキスト）
2. **装飾モチーフ** — washi tape / polka dot / 花柄 / 星 / ハート / 雲 / なし
3. **タイポグラフィ** — 丸ゴシック / セリフ / 手書き風 / クラシック
4. **カードスタイル** — flat / shadow / sticker / polaroid / ribbon
5. **バッジ装飾** — 種別タグの形状（rounded / pill / sticker）
6. **表紙レイアウト** — minimalist / scrapbook / collage / postcard
7. **絵文字アクセント** — テーマに合わせた装飾絵文字（🌸🍓☁️🌙🪴 など）

### データモデル拡張
```typescript
type ThemeCategory = 'girly' | 'natural' | 'mint' | 'fantasy' | 'vintage' | 'korean' | 'seasonal' | 'wa' | 'chic'

type Theme = {
    name: ThemeName
    label: string
    description: string         // 「ピンクの可愛いさくら柄しおり」
    category: ThemeCategory
    isPremium: boolean          // false = 無料 / true = 有料
    isLimited?: boolean         // 期間限定（クリスマス等）
    previewEmoji: string        // テーマ選択UIで表示する代表絵文字

    // 配色
    pageBg, paperBg, paperBorder, coverBg, coverText, accent, subAccent, text, subText, timelineBar, typeColors

    // 装飾
    decoration: 'washi' | 'dots' | 'flowers' | 'stars' | 'hearts' | 'clouds' | 'polaroid' | 'sakura' | 'none'
    fontFamily: 'rounded' | 'serif' | 'casual' | 'classic'
    cardStyle: 'flat' | 'shadow' | 'sticker' | 'polaroid'
    badgeStyle: 'classic' | 'soft' | 'sticker'
    coverLayout: 'minimalist' | 'scrapbook' | 'postcard'
    coverEmoji?: string         // 表紙に散らす装飾絵文字（例: '🌸🌸🌸'）
}
```

### 課金モデル候補
1. **テーマパック（買い切り）**: 500〜800円で「ガーリーパック5種類」「韓国風パック4種類」など
2. **月額プレミアム**: 月額480円で全テーマ使い放題 + 新作テーマも順次解放
3. **単体購入**: 1テーマ150〜200円（試しやすい）
4. **季節限定無料配布**: イベント時にプレミアムテーマを期間限定で無料解放（流入施策）
5. **ブランド非表示**: しおり背表紙の「旅程ジェネレーター」クレジットを削除できる（プレミアム特典 or 単体購入）

→ **MVP 最初は単体購入のみ**を Stripe で実装、後に月額プラン拡張

### UI 設計
- **テーマピッカー**: ナビバーから「🎨 テーマ」ボタン → モーダルでカテゴリ別グリッド表示
- **プレビュー**: 各テーマのサムネ（カバー風小カード）をホバー or タップで拡大プレビュー
- **ロックUI**: 有料テーマは右上に 🔒 アイコン、選択時に「プレミアム解放」モーダルへ
- **おすすめ表示**: 旅行先・季節から相性のいいテーマを「あなたへのおすすめ」として上部に
- **適用後**: 「テーマ適用済み: Sakura」を localStorage に保存（`tripgen.bookletTheme.v1`）

### 実装ロードマップ
1. **Phase A（今すぐ）**: テーマ拡張インフラ整備（Theme 型拡張・10種類の無料テーマ実装・装飾レンダリング） ← **本セッションで着手**
2. **Phase B**: 有料テーマ10種類追加・テーマピッカーUIの刷新（カテゴリ別グリッド）
3. **Phase C**: Stripe Checkout 統合・購入済みテーマの localStorage 管理
4. **Phase D**: 認証導入後にユーザー単位の購入履歴へ移行（Supabase users テーブル拡張）

### 装飾レンダリング実装のヒント
- **washi tape**: CSS gradient 帯を表紙の角に rotated で配置（例: `transform: rotate(-15deg)`）
- **polka dot**: `background-image: radial-gradient(circle, ${color} 1px, transparent 1px)` で密度調整
- **sakura/flowers**: 角や余白に絵文字を `position: absolute` で点在
- **polaroid**: スポットカードを `box-shadow + rotate(0.5deg)` でランダムに傾ける
- **handwritten font**: Google Fonts の "Kosugi Maru" / "Klee One" / "Yusei Magic" を読み込み
- **stars**: `::before/::after` で✨絵文字を配置 or SVG パターン

### 注意事項
- `@media print` 対応: 装飾は印刷時にも崩れないようテスト必須
- パフォーマンス: テーマ切替時の再レンダリング負荷を localStorage キャッシュで軽減
- アクセシビリティ: コントラスト比 4.5:1 以上を確保（特にパステル系）

---

### 🟡 Phase 6 収益化基盤（マネタイズ判断後）

#### 14. アフィリエイト導線（数時間〜）
- HotelDetailModal に「じゃらんで探す」「楽天トラベルで探す」ボタン
- アフィリエイトパラメータ付き URL を自動構築
- スポット詳細にも「アクティビティを予約（KKday・Klook）」を追加検討
- **実装コスト低・期待収益はユーザー数に比例**

#### 15. 認証導入（Supabase Auth・1〜2日）
- メール magic link（無料・実装早い）
- `trips.user_id UUID NULL` 追加（NULL = ゲスト互換）
- /me ダッシュボードで自分の旅程一覧
- リテンション・メルマガ等の基盤に

---

### 🟢 中長期（Phase 7・需要見極め後）

- AIチャット型旅行相談
- 予算最適化（最安日程）
- 共同編集（複雑度高い・需要確認後）
- LINE連携（日本特化なら効果大）

### ❌ 仕様通りやらないこと
- 決済・サブスクの内製
- ネイティブアプリ化（PWA で十分）
- 多言語対応（まず日本特化）
- AI精度の完璧化（80点で十分）
- 完璧なUI/デザイン（実用最優先）
- グローバル展開（後回し）

---

## ⚠️ AI コスト・ライセンス（Gemini API）

### 背景（2026-05-16 時点）
公開運用中に **`429 Quota exceeded`** が発生。`gemini-2.5-flash-lite` の Free Tier 上限は **1日20リクエスト/モデル/プロジェクト** に制限されていることが判明。

### 2026年3月23日からの新料金体系
Google が `Prepaid billing system` を導入し、Tier 1 以上は **事前購入クレジット制** に変更。

| 項目 | Free Tier | Tier 1 |
|------|-----------|--------|
| 月額固定費 | $0 | $0（ただし$10の事前購入が必須） |
| 課金方式 | 無料 | 事前購入したクレジットから消費 |
| 1日リクエスト上限 | **20リクエスト/モデル** | $250/月の支出上限内で大幅緩和 |
| 無料枠の継続 | - | **❌ なし（Tier 1 では全使用がクレジット消費）** |
| クレジット最低額 | - | **$10** |
| クレジット最大保有 | - | $5,000 |
| クレジット有効期限 | - | **12ヶ月（使い切らないと失効）** |
| 後払い切替 | - | Tier 3 到達後のみ可能 |

### `gemini-2.5-flash-lite` の単価
- 入力: **$0.10 / 1M tokens**
- 出力: **$0.40 / 1M tokens**
- 1回あたり推定: 入力 2,000T + 出力 3,000T ≈ **$0.0014（約 0.21 円）**

### コスト試算
| 利用量 | 月額目安 |
|-------|---------|
| 100回/月 | ~$0.14（約 21 円） |
| 1,000回/月 | ~$1.40（約 210 円） |
| 5,000回/月 | ~$7（約 1,050 円） |
| **$10 のクレジットで何回?** | **約 7,000 回** |

### 3つの選択肢

#### 選択肢A: 無料枠のまま運用（個人テスト用途）
- メリット: 完全に費用ゼロ
- デメリット: **1日20リクエストで詰む**。公開して人を呼べない
- 適用: 個人テスト・少人数にシェアする段階

#### 選択肢B: Tier 1 切替（$10 前払い） ★公開運用ならこれ
- メリット: 大幅緩和、$10 で **約7,000回** 使える（MVP数ヶ月分）
- デメリット: $10 は使い切る前提（12ヶ月失効）、月 $250 上限
- 適用: MVP公開・初期ユーザー獲得段階で最も現実的

#### 選択肢C: 認証 + BYOK（ユーザーが自分の API キー登録）
- メリット: 集約コストを開発者が負担しなくて済む
- デメリット: ユーザーの心理的ハードル高い、UI 複雑
- 適用: Tier 1 でもコストが膨らんできた長期発展案

### 推奨アクション
1. **当面（個人テスト）**: 選択肢A のまま運用、明日17時のリセットで開発継続
2. **公開直前**: 上記の[公開直前の必須整備](#-公開直前の必須整備phase-4-b1〜2日)を完了 → 選択肢B に切替
3. **コスト爆発防止**: 429 ハンドリング + ユーザーあたりレート制限を必ず先に実装
4. **長期**: 認証導入後、選択肢C（BYOK）も視野

### 公式ソース
- [Billing - Gemini API](https://ai.google.dev/gemini-api/docs/billing)
- [Rate limits - Gemini API](https://ai.google.dev/gemini-api/docs/rate-limits)
- [Pricing](https://ai.google.dev/pricing)
- [Google blog: Gemini API costs control](https://blog.google/innovation-and-ai/technology/developers-tools/more-control-over-gemini-api-costs/)

---

## 🗺️ 地図機能ロードマップ

### Step 1（実装済み）: Google Maps URL ボタン
- `?api=1&origin=...&destination=...&waypoints=...` 形式。APIキー不要
- `spot.address`（AI生成住所）でスポット名＋住所での検索精度向上

### Step 2（実装済み）: スポット詳細・宿泊モーダル内 Google Maps 埋め込み
- `maps.google.com/maps?q=...&output=embed` の非公式 iframe。APIキー不要・完全無料
- リスク: 非公式のため Google 側の変更で壊れる可能性あり

#### Google Maps 埋め込み方式の比較
| 方式 | 費用 | APIキー | 安定性 |
|------|------|---------|--------|
| 非公式 iframe（現採用） | 完全無料 | 不要 | △ 非公式 |
| Google Maps Embed API | 月28,000回まで無料 | 必要（クレカ登録） | ○ 公式 |
| OpenStreetMap iframe | 完全無料 | 不要 | ○ 公式 |

### Step 3（未着手）: アプリ内ルート地図（Leaflet + Nominatim）
- react-leaflet + Nominatim（OSM無料API）でアプリ内にピン＋矢印マップ
- レート制限 1req/秒、User-Agentヘッダー必須
- 旅程ページに「地図タブ」として追加予定

---

## 📁 ファイル構成

```
src/
├── app/
│   ├── page.tsx                          # トップページ（ヒーロー統合フォーム・LP）
│   ├── layout.tsx                        # 共通レイアウト（モダンヘッダー・フッター・Analytics）
│   ├── globals.css                       # グローバルCSS・アニメーション・ヘッダーレスポンシブ
│   ├── loading.tsx                       # スケルトンローディング
│   ├── not-found.tsx                     # 404
│   ├── explore/page.tsx                  # /explore 旅程発見ページ
│   ├── trips/page.tsx                    # /trips → /explore へリダイレクト
│   ├── trips/[id]/page.tsx               # 旅程詳細（OGP動的・?edit=token 判定）
│   ├── trips/[id]/opengraph-image.tsx    # 動的 OG 画像生成（1200×630）
│   ├── trips/[id]/loading.tsx            # 旅程詳細ロード中
│   ├── trips/[id]/booklet/page.tsx       # ★しおりページ（A4印刷対応・3テーマ）
│   └── api/
│       ├── plan/route.ts                 # POST: 統合フォーム→並行スクレイプ→AI生成→保存
│       ├── generate/route.ts             # POST: 条件→AI生成
│       ├── scrape/route.ts               # POST: URL→スクレイプ→AI生成
│       ├── trips/[share_id]/route.ts     # GET/PATCH: 旅程取得・保存（edit_token検証）
│       └── trips/copy/route.ts           # POST: 旅程コピー（新 share_id + edit_token）
├── components/trips/
│   ├── PlanForm.tsx                      # ★統合フォーム
│   ├── GeneratingOverlay.tsx             # AI生成中フルスクリーンオーバーレイ
│   ├── DatePicker.tsx                    # 航空会社スタイル日程ピッカー
│   ├── ItineraryEditor.tsx               # 旅程詳細画面の親（editable 制御）
│   ├── CalendarView.tsx                  # ★Outlookスタイルカレンダー（最重要・sticky対応）
│   ├── SuggestedSpotsPanel.tsx           # おすすめスポットサイドパネル
│   ├── FreeBlocksPanel.tsx               # フリーブロックパネル
│   ├── SpotDetailModal.tsx               # スポット詳細モーダル
│   ├── HotelDetailModal.tsx              # 宿泊詳細モーダル
│   ├── TripCard.tsx                      # 旅程カード（/・/explore で共用）
│   ├── ShareButton.tsx                   # 共有リンクコピー（閲覧URLのみ）
│   ├── CopyButton.tsx                    # 旅程コピー→ edit_token 付きURLへ
│   ├── TripViewTracker.tsx               # 閲覧履歴を localStorage に保存
│   └── RecentTripsButton.tsx             # ヘッダー🕘最近ボタン（ドロップダウン）
├── components/booklet/
│   ├── BookletView.tsx                   # ルートコンテナ・config 管理・ページ並び順生成
│   ├── BookletNav.tsx                    # 上部ツールバー（戻る・テーマ・設定・シェア・印刷）
│   ├── BookletCover.tsx                  # 表紙ページ（タイトル＋旅行日程・インライン編集・DatePickerOverlay で FROM/TO 選択）
│   ├── BookletBackCover.tsx              # 背表紙ページ（テーマ装飾のみ・右下に「旅程ジェネレーター」）
│   ├── BookletDayPage.tsx                # 日別ページ（時系列タイムライン・宿泊・メモ/メモ続きを分割記事で出力）
│   ├── BookletOptionalPage.tsx           # オプショナルページ汎用（持ち物→チェックボックス・1/2/3列・ページ分割）
│   ├── BookletGapControl.tsx             # ページ間ギャップUI（オプショナルページをインラインで挿入位置指定）
│   ├── BookletSettings.tsx               # 設定モーダル（ページ番号のみ）
│   ├── BookletThemePicker.tsx            # テーマピッカー（カテゴリ別グリッド）
│   ├── BookletDecorations.tsx            # 装飾レイヤー（CSSパターンのみ・絵文字なし）
│   ├── bookletFont.ts                    # フォント family ヘルパー（丸ゴシック/明朝/標準）
│   ├── bookletConfig.ts                  # BookletConfig 型・localStorage IO・ページ並び順計算
│   └── bookletThemes.ts                  # テーマ定義（13テーマ・絵文字なし）
├── hooks/
│   ├── useIsMobile.ts                    # window.matchMedia ベース判定
│   └── useRecentTrips.ts                 # localStorage「最近の旅程」フック
├── lib/
│   ├── ai/gemini.ts                      # Gemini API ラッパー
│   ├── db/trips.ts                       # Supabase CRUD（edit_token生成・検証）
│   ├── db/supabase.ts                    # Supabase クライアント
│   ├── destinationEmoji.ts               # 目的地→絵文字マップ（40件以上）
│   └── scraper/index.ts                  # URL→本文テキスト抽出
├── types/index.ts                        # 全型定義
docs/
└── migrations/
    └── 001_add_edit_token.sql            # edit_token カラム追加 SQL
```

---

## ⚙️ 重要な技術設計（Claude が変更時に参照）

### CalendarView の設計
**ファイル**: `src/components/trips/CalendarView.tsx`

- グリッド: **6〜24時**、高さ **min(720px, calc(100vh - 220px))**（内部スクロール）
- 列ヘッダー（○日目）と宿泊帯は1つの `position: sticky; top: 0` ラッパーで一括固定
- 外側に `isolation: 'isolate'`（ドラッグ中 z-index 漏れ防止）
- `BASE_PPM = 1.0`（1分=1px 基準）、実 ppm = `BASE_PPM * zoom`
- 初期スクロール: コンテンツ開始時刻の 1時間前
- **モバイル**: `mobileDayIdx` で1日表示、‹ 前日 / 翌日 › ナビ
- **宿泊帯**: 列ヘッダー直下・シングルクリックで HotelDetailModal を開く
- **ドラッグ**: `DRAG_THRESHOLD = 5px`、`e.detail > 1` 早期リターン（dblclick保護）、タッチ対応
- **リサイズ**: 上端/下端ドラッグ + `applyResize()` で cascade push

### ItineraryEditor の設計
- `editable` プロップで全編集UIを制御（false 時はサイドバー・undo/redo・保存・タイトル編集を非表示）
- 閲覧モードでは黄色いバナー＋コピーCTA、ShareButton と CopyButton は表示継続
- 自動保存: `handleUpdateDays` 等のたびに 3秒 debounce タイマーをセット、`saveToDbRef` で常に最新 state を参照
- タイトル編集: ダブルクリックで input 化、Enter/blur で確定・Escape でキャンセル

### 編集権限の設計（edit_token）
- 閲覧URL: `/trips/[share_id]` — 誰でもアクセス可・編集不可
- 編集URL: `/trips/[share_id]?edit=[token]` — トークン一致で編集可
- DB: `trips.edit_token` カラム（NULL = レガシー後方互換）
- 検証:
  1. クライアント: TripPage が `searchParams.edit` を読み取り、`trip.edit_token` と比較
  2. サーバー: PATCH /api/trips/[share_id] が body の `edit_token` を検証、不一致なら403
  3. GET API は `edit_token` をレスポンスから除外（漏洩防止）
- 新規旅程作成フロー: POST → `{share_id, edit_token}` 取得 → `?edit=token` 付きURLへ遷移 → localStorage に owner として記録

### SpotDetailModal の設計
**移動ブロックの発着時刻モデル**:
- `depTime`: state（HH:MM）、`arrTime`: state（HH:MM）
- `duration`: **derived**（`Math.max(1, arrTime分 - depTime分)`）

編集ルール:
- 発を編集 → 着は固定・所要時間が変わる
- 着を編集 → 発は固定・所要時間が変わる
- 所要時間を編集 → 発は固定・着が変わる

### HotelDetailModal の設計
| フィールド | 型 | 備考 |
|-----------|-----|------|
| name | string（必須） | 保存ボタンは name が空だと無効化 |
| address | string? | Google Maps 検索精度向上 |
| check_in / check_out | string? | "HH:MM" 形式 |
| price_per_night | number? | 円 |
| booking_confirmed | boolean? | チェックボックス |
| booking_url | string? | 入力後「予約ページを開く →」リンク表示 |
| memo | string? | 駐車場・朝食・アクセス等 |

- Google Maps iframe 埋め込みあり（name 入力後に表示）
- HotelInfo は `ItineraryDay.hotel` に格納（itinerary JSONB内・DBスキーマ変更不要）

### localStorage「最近の旅程」の設計
- キー: `tripgen.recentTrips.v1`、最大20件
- フォーマット: `RecentTrip[]`（share_id・title・destination・duration_days・role・edit_token?・accessed_at）
- `role`: `'owner'`（自分が作成 or コピー）= edit_token を保存、`'viewer'`（閲覧のみ）= edit_token なし
- owner レコードは viewer で上書きしない（owner 優先）
- 他タブ同期、ヘッダー🕘最近ボタンで開閉

### OGP 設定
- `layout.tsx`: metadataBase（NEXT_PUBLIC_SITE_URL or VERCEL_URL）、openGraph.siteName "旅程ジェネレーター"、twitter.card "summary_large_image"
- `trips/[id]/opengraph-image.tsx`: Next.js 組み込み `ImageResponse` で1200×630 を動的生成
  - ランタイム: `nodejs`（Supabase SDK が動作するため）
  - デザイン: 青グラデーション背景・旅程タイトル・目的地・日数

### しおり機能の設計（/trips/[id]/booklet）
**コンセプト**: カレンダーで完成した旅程を「持ち歩ける・印刷できるしおり」に変換するビュー。

**ファイル**:
- `src/app/trips/[id]/booklet/page.tsx` — サーバーコンポーネント（trip取得・edit_token引継）
- `src/components/booklet/BookletView.tsx` — ルートクライアント（config 管理・ページ並び順生成）
- `src/components/booklet/BookletNav.tsx` — 上部ツールバー（戻る・テーマ・設定・シェア・印刷）
- `src/components/booklet/BookletCover.tsx` — 表紙（タイトル＋旅行日程・インライン編集・DatePickerOverlay で FROM/TO 選択・PATCH で DB 保存）
- `src/components/booklet/BookletBackCover.tsx` — 背表紙（テーマ装飾・装飾円のみ。テキストは右下に「旅程ジェネレーター」のみ表示。タイトル・メッセージ等は削除済み）
- `src/components/booklet/BookletDayPage.tsx` — 日別ページ（時系列タイムライン・宿泊先・NOW/NEXT判定・メモ分割記事）
- `src/components/booklet/BookletOptionalPage.tsx` — オプショナルページ（持ち物→チェックボックス・1/2/3列・ページ分割）
- `src/components/booklet/BookletGapControl.tsx` — ページ間ギャップUI（オプショナルページをインラインで挿入位置指定）
- `src/components/booklet/BookletSettings.tsx` — 設定モーダル（ページ番号のみ）
- `src/components/booklet/BookletThemePicker.tsx` — テーマピッカー（カテゴリ別グリッド・絵文字レンダリングなし）
- `src/components/booklet/BookletDecorations.tsx` — 装飾レイヤー（CSSパターンのみ：dots/lines/grid/wave/washi）
- `src/components/booklet/bookletThemes.ts` — テーマ定義（13テーマ・絵文字プロパティ削除済）
- `src/components/booklet/bookletConfig.ts` — BookletConfig 型・localStorage IO・ページ並び順計算（フラット統合構造）
- `src/components/booklet/bookletFont.ts` — フォント family ヘルパー

### しおりテーマ（絵文字削除版）
全テーマから `coverEmoji` `previewEmoji` プロパティおよび絵文字ベースの装飾（sakura/stars/hearts/clouds）を削除。装飾は CSS パターンのみ：

| DecorationKind | 効果 |
|----------------|------|
| `none` | 装飾なし |
| `dots` | 細かいポルカドット（radial-gradient） |
| `lines` | 斜めストライプ（repeating-linear-gradient） |
| `grid` | 細い格子 |
| `wave` | 控えめなウェーブパターン |
| `washi` | washi tape 風の斜め帯（表紙の角に配置） |

### BookletConfig（しおり構成データ・localStorage管理）
**ファイル**: `src/components/booklet/bookletConfig.ts`
**localStorage キー**: `tripgen.booklet.config.${shareId}` — trip 単位で別個に保存

```typescript
type BookletConfig = {
    optionalPages: Record<OptionalPageKind, OptionalPageEntry>
    dayMemos: Record<number, string[]>  // dayIdx → メモ配列
    showPageNumbers: boolean
    themeName: string
}

type OptionalPageEntry = {
    enabled: boolean
    position: InsertPosition
    content: string
    columns?: 1 | 2 | 3    // 持ち物リストの列数
}

type InsertPosition =
    | { kind: 'after-cover' }
    | { kind: 'after-day', dayIdx: number }
    | { kind: 'before-back-cover' }
```

`computePageOrder(config, daysCount)` が `PageKey[]` を返し、`BookletView` がそれを順に描画。表紙→（任意ページ）→1日目→（任意ページ）→2日目…→背表紙の順で組み立てる。

`enabledPagesAt(config, pos)` が指定位置で有効な `OptionalPageKind[]` を返す。`positionLabel(pos, daysCount)` が位置のラベル文字列を返す。

旧 `screen/print` 二重構造は廃止。旧フォーマットを `loadBookletConfig` 内のマイグレーションで自動変換。

### ページ番号
- `config.showPageNumbers` で表示/非表示を切替
- 表紙・背表紙以外のページに通し番号を振る（1, 2, 3, ...）
- 表示形式: `— N —`（控えめなセンタリング）
- 印刷時も同じスタイルで残る
- **実装**: `pageNumber?: number` prop を `BookletDayPage` / `BookletOptionalPage` に渡し、各 `<article>` 末尾（内部）に描画。外部 sibling `<p>` 方式は廃止（枠外にはみ出す問題があったため）

### オプショナルページ（ページ間に挿入）
| ページ | デフォルト位置 | プレースホルダー例 |
|--------|--------------|------------------|
| 編集メンバー | 表紙の直後 | 田中太郎（リーダー）/ 佐藤花子 |
| 集合時間・場所 | 表紙の直後 | 日時 / 場所 / 備考 |
| 持ち物リスト | 表紙の直後 | パスポート / 充電器 / 常備薬 |
| 緊急連絡先 | 背表紙の直前 | ホテル番号 / 保険会社 / 家族 |
| メモ | 背表紙の直前 | 自由記述 |
| 金額メモ | 背表紙の直前 | 交通費 / 宿泊費 / 食費 |
| 自由ページ | 背表紙の直前 | 自由記述 |

- 挿入位置はドロップダウンではなく、各ページの間に **BookletGapControl** を表示してその場で ON/OFF 切替
- 他の位置で既に有効なページは灰色で表示（ツールチップで「○○で追加済み」表示）

**持ち物リスト（packing）の特別挙動**:
- チェックボックスリストで表示（常時）
- 1 / 2 / 3 列表示を切替可能（ヘッダーの列数ボタン）
- `ITEMS_PER_COL = 14` ── 1列14行を超える場合は続きページを自動追加
- 編集モード: 各行を `<input type="text">` で直接編集・× で削除・「＋ 追加」ボタン
- その他のページ（メンバー等）は textarea / pre 表示

### 各日ページのメモ機能
- メモが 0 件の場合: 編集モードのみ「＋ メモを追加」ボタンを表示（MEMO コンテナは非表示）
- 「＋ メモを追加」を押すと MEMO コンテナが現れ textarea が追加される
- `MEMOS_PER_PAGE = 8` ── 8行を超える場合はメモ専用の続きページ（`booklet-memo-cont` 記事）を自動追加
- 各メモには × ボタンで削除可能（最後の 1 件を消すと MEMO コンテナも非表示に戻る）
- 編集権限（`editToken` あり）の時のみボタン表示・編集可能。閲覧モードでは入力済みメモのみ表示
- `config.dayMemos[dayIdx]` に文字列配列として保存
- メモ記事は日別ページと独立した `<article className="booklet-page booklet-memo-cont">` で出力（Fragment の複数 article）

**NOW / NEXT 判定**（旅行当日のみ動作）:
- `useEffect` でマウント後のみ `setInterval(60s)` で現在時刻を更新（SSR 差異回避）
- 進行中の予定 = NOW（青パルス・🔵 NOW バッジ）
- 次の予定（進行中なし時）= NEXT（⏭ NEXT バッジ）
- TODAY バッジを日付ヘッダーにも表示

**印刷対応**（`globals.css` の `@media print`）:
- `body > header`, `body > footer`, `.no-print` を非表示
- `.booklet-cover` `.booklet-day` `.booklet-optional` `.booklet-back-cover` に `page-break-after / before: always`
- `.booklet-memo-cont`（メモ続きページ・持ち物続きページ）に `page-break-after: always; break-inside: avoid`
- `@page { size: A4; margin: 12mm 10mm }`
- リンクの `::after` URL 表示を抑止
- 真の PDF 出力は未実装（`window.print()` ベース・将来 `@react-pdf/renderer` 検討）

**ItineraryEditor からの遷移**:
- ツールバーに「📖 しおり」ボタン（オレンジグラデ）
- `editable && editToken` なら `?edit=token` を引継ぎ、しおりからカレンダーに戻った時も編集モードを維持
- 編集権限がある時のみメモ・オプショナルページの編集UIが表示される

### 移動ブロックの設計方針（ギャップ注釈方式）
- AI はスポット間に空き時間を設けるだけ（移動ブロック非生成）
- カレンダー上の空き時間を「XX分」ラベルで表示
- ユーザーが手動でフリーブロックパネルから配置 or ギャップタップで挿入
- 移動ブロックは1分単位・発着時刻入力対応・ルートメモ欄あり

---

## 📡 API の重要仕様

### エラーハンドリング（必須ルール）
Vercel timeout 時にプレーンテキストが返るため `res.json()` は**使わない**:
```typescript
const text = await res.text()
try { data = JSON.parse(text) } catch {
    throw new Error(`サーバーエラー: ${text.slice(0, 120)}`)
}
```

### タイムアウト対策
- APIルートに `export const maxDuration = 60`

### フォームボタンの必須ルール
- `type="button"` + `onClick` のみ（`type="submit"` 禁止・Enter誤送信防止）

### POST /api/plan, /generate, /scrape のレスポンス
```typescript
{ trip_id, share_id, edit_token }
```
クライアントは `edit_token` を URL クエリに付けて遷移：`/trips/[share_id]?edit=[edit_token]`

---

## 🧰 技術メモ（Claude 向け）

- **Next.js params**: `params: Promise<{ id: string }>` → `const { id } = await params`
- **Tailwind v4**: 設定ファイル不要。**重要なレイアウトは inline styles**（v4 で一部ユーティリティが効かない場合があるため）
- **itinerary の型**: `{ days, trip_style?, trip_style_reason?, start_date?, end_date?, sidebar_spots? }`
- **hotel の格納場所**: `itinerary.days[i].hotel`（JSONB内・DBスキーマ変更不要）
- **CalendarView PPM**: `BASE_PPM = 1.0`。ppm = BASE_PPM * zoom
- **isolation: isolate**: CalendarView 外側ラッパーに必須
- **overscroll-behavior: contain**: カレンダースクロールコンテナに必須
- **useIsMobile**: SSR では `false`、クライアントマウント後に `window.matchMedia` で判定
- **Google Maps 埋め込み**: `maps.google.com/maps?q=...&output=embed`（非公式・無料）
- **ISR**: `/` と `/explore` は `export const revalidate = 60`（1分キャッシュ）
- **OG画像**: `runtime = 'nodejs'`（edge runtime で Supabase Node SDK が動かない場合あり）
- **details/summary**: globals.css でデフォルトマーカー非表示、`.faq-toggle` で ＋/− 切替
- **ヘッダー**: inline styles + `.nav-hover` `.cta-hover` ホバー、`.nav-label` `.logo-text` でモバイル省略
- **edit_token 32文字**: a-zA-Z0-9 から `generateEditToken()` で生成（lib/db/trips.ts）
- **しおり印刷**: `@media print` で `body > header`・`body > footer`・`.no-print` を全て非表示。`.booklet-cover` `.booklet-day` に `page-break-after: always`
- **しおりテーマ**: `tripgen.bookletTheme.v1` キーで localStorage 保存・SSR ハイドレーション差異を避けるため初期値は 'classic' 固定
- **しおり NOW 判定**: `useEffect` でマウント後のみ `setInterval(60_000)`、SSR では計算しない
- **しおり表紙タイトル編集**: クリックで `<input>` に切替・Enter/blur で確定・Escape でキャンセル。PATCH で `{ itinerary, title, edit_token }` を送信
- **しおり表紙日程フィールド**: タイトル下 28px に配置。`height:44px` 固定コンテナ＋ヒントを `opacity` 切替のみにすることでレイアウトシフトを防止
  - **表示**: `formatDateRange(start, end)` で日本語整形。同月「5月5日（火）〜 7日（木）」・月跨ぎ・年跨ぎ・日帰り（1日）対応。フォント 22px
  - **初期値**: `itinerary.start_date` / `end_date` を使用。`end_date` 未設定時は `start_date + duration_days - 1` で算出
  - **未設定時**: 編集権限ありなら「＋ 日程を追加」（22px・opacity 0.7）を表示
  - **編集UI（DatePickerOverlay）**: ネイティブ date input の年/月/日セグメント問題・フォント・文字間隔を避けるため、**input をノーマルフロー（固定幅 9.5em・opacity:0）に置いてコンテナ幅を確定させ、`formatSingleDate()` の可視スパンを `position:absolute; inset:0; pointer-events:none` でオーバーレイ**する方式。初回選択前後で input 幅が変わらないためギャップが発生しない。コンポーネントはファイルスコープで定義（関数内定義だと毎レンダリングで unmount/remount されて ref が壊れる）
  - **カレンダー起動**: `openDateEdit(target: 'start' | 'end' = 'start')` で開くピッカーを指定。`flushSync` でDOM即時更新 → `requestAnimationFrame` 後に対象 ref の `showPicker()` を呼ぶ（rAF 前に呼ぶと座標 (0,0) でページ左上にポップアップが出る）。FROM・TO それぞれの input の `onClick` でも `showPicker()` を呼ぶ
  - **表示状態のクリック挙動**: 日程は FROM と TO を個別の `<span>` で表示。FROM をクリック→FROMピッカー、TO をクリック→TOピッカーが開く。日帰り（start === end）は FROM のみ表示
  - **TO 年省略**: FROM と同じ西暦なら TO は `月日（曜）` のみ表示（`formatDateNoYear`）。年跨ぎの場合のみ年を表示
  - **日付順序の警告**: `localEndDate < localStartDate` の場合に「旅行終了日が旅行開始日より前になっています」を 20px の赤文字で条件付きレンダリング。編集中はドラフト値・表示中は保存値で判定するため、日付を正しく修正して保存するまで警告が消えない。「クリックして編集」のヒント文は削除済み
  - **保存**: コンテナ外 blur または Enter → `saveDate()` → `localStartDate / localEndDate` 更新 → PATCH で `{ itinerary: { ...itinerary, start_date, end_date }, title, edit_token }` を送信
  - **クリア**: FROM・TO を両方削除して確定すると `localStartDate=''` → `dateRangeLabel=null` →「＋ 日程を追加」に戻る
  - **カレンダーポップアップ**: `color-scheme:light` で白基調（globals.css で `.booklet-cover input[type="date"]` に適用）
- **しおりメモ分割**: `MEMOS_PER_PAGE=8`・超えたら続き記事を React Fragment で返す（`BookletDayPage`）
- **持ち物チェックボックス分割**: `ITEMS_PER_COL=14`・列×行数で超えたら続き記事（`BookletOptionalPage`）
- **BookletConfig マイグレーション**: 旧 `screen/print` 構造を `loadBookletConfig` で自動変換（`parsed.screen` を source とする）
