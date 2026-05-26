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
│   ├── BookletView.tsx                   # ブロックベース描画ルート・@dnd-kit並び替え・localDays/onSpotUpdate
│   ├── BookletNav.tsx                    # 上部ツールバー（戻る・テーマ・設定・シェア・印刷）
│   ├── BookletCover.tsx                  # 表紙ブロック（タイトル＋旅行日程・インライン編集・DatePickerOverlay）
│   ├── BookletBackCover.tsx              # 背表紙ブロック（テーマ装飾のみ・右下に「旅程ジェネレーター」）
│   ├── BookletDayHeader.tsx              # 日別ページのタイトルヘッダー（Day N / 日付 / TODAY バッジ）
│   ├── BookletDayPage.tsx                # 日別ページ本体（タイムライン・宿泊・スポット別メモ/URL/QRコード）
│   ├── blocks/
│   │   ├── TextBlock.tsx                 # 汎用テキストインラインブロック（カードなし）
│   │   ├── PackingBlock.tsx              # 持ち物リストインラインブロック（チェックボックス・1/2/3列）
│   │   ├── DividerBlock.tsx              # 区切り線
│   │   ├── SpacerBlock.tsx               # スペーサー（高さ指定）
│   │   ├── BlockPalette.tsx              # ページ追加パレット（右サイドバー・D&D/クリック）
│   │   ├── SortablePage.tsx              # 外側 @dnd-kit/sortable ラッパー（ページ全体・ハンドル＋削除＋ドロップヒント）
│   │   └── SortableInnerBlock.tsx        # 内側 @dnd-kit/sortable ラッパー（ページ内ブロック・小ハンドル＋削除＋リサイズ＋ドロップヒント）
│   ├── BookletSettings.tsx               # 設定モーダル（全体/PC/印刷の3セクション）
│   ├── BookletThemePicker.tsx            # テーマピッカー（カテゴリ別グリッド）
│   ├── BookletDecorations.tsx            # 装飾レイヤー（CSSパターン）
│   ├── bookletFont.ts                    # フォント family ヘルパー
│   ├── bookletConfig.ts                  # BookletBlock 型・localStorage IO・旧データ自動マイグレーション
│   └── bookletThemes.ts                  # テーマ定義（13テーマ）
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
**コンセプト**: カレンダーで完成した旅程を「持ち歩ける・印刷できるしおり」に変換するビュー。**ブロックベース構成**（2026-05-21〜）：ユーザーが自由にブロック（表紙・各日・テキスト・持ち物・区切り線・スペーサーなど）を組み合わせて1ページを作る。PC版はドラッグ&ドロップで並び替え可能。印刷時は用紙サイズに応じてCSSで自動レイアウト・自動改ページ。

**ファイル**:
- `src/app/trips/[id]/booklet/page.tsx` — サーバーコンポーネント（trip取得・edit_token引継）
- `src/components/booklet/BookletView.tsx` — ルートクライアント（`config.blocks` を順に描画・@dnd-kit で並び替え・`handleSpotUpdate` → PATCH保存）
- `src/components/booklet/BookletNav.tsx` — 上部ツールバー（戻る・テーマ・設定・シェア・印刷）
- `src/components/booklet/BookletCover.tsx` — 表紙ブロック（タイトル＋旅行日程・インライン編集・DatePickerOverlay）
- `src/components/booklet/BookletBackCover.tsx` — 背表紙ブロック（装飾円のみ・右下に「旅程ジェネレーター」）
- `src/components/booklet/BookletDayPage.tsx` — 日別ブロック（時系列タイムライン・宿泊先・NOW/NEXT判定・スポット別メモ/URL・QRコード）。**dayMemos機能は削除し独立TextBlockへ移行**
- `src/components/booklet/blocks/TextBlock.tsx` — 汎用テキストブロック（編集可能タイトル＋本文 textarea）
- `src/components/booklet/blocks/PackingBlock.tsx` — 持ち物リストブロック（チェックボックス・1/2/3列）
- `src/components/booklet/blocks/DividerBlock.tsx` — 区切り線（solid/dashed/dotted）
- `src/components/booklet/blocks/SpacerBlock.tsx` — スペーサー（高さ指定）
- `src/components/booklet/blocks/BlockPalette.tsx` — 「＋ページを追加」パレット（表紙直後に表示・@dnd-kit/useDraggable + onClick で追加）
- `src/components/booklet/blocks/SortableBlock.tsx` — @dnd-kit/sortable ラッパー（ドラッグハンドル＋削除ボタン＋下端の高さリサイズハンドル）
- `src/components/booklet/BookletSettings.tsx` — 設定モーダル（全体/PC/印刷の3セクション）
- `src/components/booklet/BookletThemePicker.tsx` — テーマピッカー（カテゴリ別グリッド）
- `src/components/booklet/BookletDecorations.tsx` — 装飾レイヤー（CSSパターン）
- `src/components/booklet/bookletThemes.ts` — テーマ定義（13テーマ）
- `src/components/booklet/bookletConfig.ts` — `BookletBlock` 型・localStorage IO・旧データ自動マイグレーション
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

### BookletConfig（しおり構成データ・localStorage管理・**ページ内ブロック2階層モデル**）
**ファイル**: `src/components/booklet/bookletConfig.ts`
**localStorage キー**: `tripgen.booklet.config.${shareId}` — trip 単位で別個に保存

```typescript
// プリミティブブロック：ページの中身として配置されるサブブロック
type PrimitiveBlock =
    | { id: string; kind: 'text'; title: string; content: string; minHeight?: number }
    | { id: string; kind: 'packing'; title: string; content: string; columns: 1|2|3; minHeight?: number }
    | { id: string; kind: 'divider'; style?: 'solid'|'dashed'|'dotted' }
    | { id: string; kind: 'spacer'; height: number }

// しおりの最上位ユニット（ページ）
type BookletItem =
    | { id: string; kind: 'cover' }
    | { id: string; kind: 'back-cover' }
    | { id: string; kind: 'day'; dayIdx: number; blocksAbove: PrimitiveBlock[]; blocksBelow: PrimitiveBlock[] }
    | { id: string; kind: 'composite'; blocks: PrimitiveBlock[] }

type BookletConfig = {
    items: BookletItem[]
    showPageNumbers: boolean
    showUrlQrCode: boolean
    themeName: string
}
```

**設計思想**: 旧フラット `blocks: BookletBlock[]` を2階層に変更。各 `BookletItem` が1ページ＝1カードとしてレンダリングされ、その中に複数の `PrimitiveBlock` を保持できる。日別ページ（`day`）は `blocksAbove` と `blocksBelow` で旅程ブロックの上下にサブブロックを並べる。これにより「旅程ブロックの途中には他ブロックを挿入不可」を構造的に保証。

**ブロック方式の設計思想**: 固定テンプレート（旧 cover→optional→days→optional→back-cover）を廃止し、ユーザーが自由にブロックを並べ替え・追加・削除できる柔軟構成に変更。PCでD&D並び替え、印刷時はCSSで自動レイアウト・自動改ページ（`break-inside: avoid` ベース）。

**マイグレーション** (`loadBookletConfig(shareId, daysCount)`):
1. 最新フォーマット（`parsed.items` あり）→ そのまま使用 + `reconcileDayItems`
2. 中間フォーマット（`parsed.blocks` フラット配列）→ `migrateFlatBlocksToItems` で items に変換（各 primitive ブロックを単独ページの composite に包む）
3. 旧フォーマット（optionalPages + dayMemos）→ `migrateLegacyToItems` で items に変換
4. データなし → `buildDefaultConfig(daysCount)` で `[cover, day×N, back-cover]` を生成

`reconcileDayItems` は旅程日数の変化に追従（不足分は背表紙の直前に追加、範囲外の dayIdx は除去）。

**ブロック編集（2階層）**:
- `updatePrimitive(id, updater)`: 全 items を横断して該当 ID の primitive block を更新
- `deletePrimitive(id)`: primitive block を削除。composite が空になったらページごと消滅
- `deleteItem(itemId)`: ページ単位の削除（composite のみ削除可能。cover/back-cover/day は保持）
- D&D並び替え: 2階層 SortableContext
  - **外側**: `config.items.map(it => it.id)` を items として登録 → ページ単位の並び替え（SortablePage）
  - **内側**: 各 day/composite item の中で `blocksAbove + day-anchor + blocksBelow` または `blocks` を items として登録 → ページ内ブロックの並び替え（SortableInnerBlock）
- 同じ親の同じ配列内でのみブロックを並び替え可能（`reorderInnerBlock` が `findBlockOrItem` で親一致をチェック）
- cover/back-cover はページレベルでドラッグ不可

**ブロック追加（BlockPalette・Canva風サイドバー）**:
- PC（>960px）では右サイドバーに `position: sticky; top: 80px` で固定表示・スクロールしても画面内に追従
- モバイル（≤960px）ではしおり本体の下に通常配置（useIsMobile(960) で判定）
- 編集モード時のみ表示
- レイアウトは flex：左=しおり本体（max-width: 800px）+ 右=パレット（240px）
- パレットアイテムは `BLOCK_TEMPLATES` 配列（持ち物リスト・編集メンバー・集合時間・緊急連絡先・メモ・金額メモ・自由ページ・区切り線）。spacer ブロック型は残してあるが、現在はパレットから追加できない（既存データとの互換のため）
- パレット内部は縦並びの button リスト（アイコン＋ラベル＋⋮⋮）・hoverで枠色変化
- 2通りの追加方法：
  1. **クリック**: 表紙直後に新規 composite ページとして追加（`addBlockFromPalette`）
  2. **ドラッグ**: @dnd-kit/useDraggable で任意のページ・ブロックの**上半分** or **下半分**にドロップ → `insertFromPalette` が挿入先を判定
- **挿入先の判定**（`insertFromPalette(template, overId, side)`）:
  - over.id が `__new-page-gap-{idx}` → 新規 composite ページとして items の idx 位置に挿入
  - over.id が day-anchor (`{itemId}__day-anchor`) → 該当日の `blocksAbove`（上半分なら末尾）or `blocksBelow`（下半分なら先頭）に追加
  - over.id が item の id（cover/back-cover）→ 新規 composite ページとして前後に挿入
  - over.id が composite item の id → `item.blocks` の先頭 or 末尾に追加（ページ内）
  - over.id が day item の id → 該当日の `blocksAbove` or `blocksBelow` に追加
  - over.id が primitive block の id → 同じ親（composite.blocks / day.blocksAbove / day.blocksBelow）の同配列内、target の直前 or 直後に挿入
- **新規ページとして追加**: パレットからドラッグ中、各ページ間に `NewPageGap`（破線の青いゾーン）が現れる。これに drop すると新規 composite ページとしてその位置に挿入される。`paletteDragActive` state（onDragStart で true / onDragEnd・onDragCancel で false）で表示制御
- **挿入位置の精密制御**: `handleDragMove` で active.rect の中心と over.rect の中心を比較し `dragHint: { overId, side: 'above'|'below' }` を計算。SortablePage / SortableInnerBlock 双方に `dropHint` を渡し、上端/下端に青いインジケーター（横長バー）をプレビュー
- **旅程ページの構造**: 旅程ページ（day item）はカード最上部に `BookletDayHeader`（Day N / labelText / 日付）を SortableContext 外で常時表示。その下に `blocksAbove` → 旅程本体（DayAnchor）→ `blocksBelow` を配置。これにより「上に追加」がページタイトルより下・旅程本体より上に挿入される
- **旅程ブロックの保護**: 日別ブロック本体（DayAnchor）はドラッグ不可かつ削除不可で、上下挿入のみ受け付ける。タイムライン内部に他ブロックが入ることはない

**SortableInnerBlock のコントロール配置**:
- 並び替えハンドル（⋮⋮）と削除ボタン（✕）はブロック右上に `position: absolute; top: 6; right: 0` で固定表示
- ブロック内コンテンツは `<div className="booklet-inner-content" style={{ paddingRight: 60 }}>` でラップ（編集モード時のみ）
- これにより、`PackingBlock` の列数トグル（列 1/2/3）など右寄せの内部UIがコントロールと重ならない
- 印刷時は `globals.css` の `@media print` で `.booklet-inner-content { padding-right: 0 !important }` に解除
- 印刷時はサイドバー (`.booklet-palette-sidebar`) を非表示、`.booklet-layout` の flex を block に戻して全幅に

**ブロック高さリサイズ**:
- text/packing/spacer ブロックに対応
- SortableBlock の下端（bottom: -10）にハンドル（横長の青バー）を配置
- PointerDown → pointermove で連続的に高さを変更、pointerup で確定
- text/packing は `minHeight` を更新（コンテンツが多ければ minHeight より大きくなる）
- spacer は `height` を直接更新
- 最小高さ40pxでクランプ

**ページ番号**:
- `isCountedBlock(b)` が `true` のブロック（day/text/packing）のみ番号を振る
- divider/spacer/cover/back-cover はカウント外
- `pageNumMap: Map<blockId, number>` を BookletView で事前計算し各ブロックに渡す

### しおり設定モーダル（BookletSettings）
3セクション構成：
- **全体設定**: ページ番号を表示する（`config.showPageNumbers`）
- **スマホ/PC 表示用設定**: 現在は項目なし（将来の設定枠）
- **印刷用設定**: URLをQRコードで表示（`config.showUrlQrCode`）

`showUrlQrCode` が true のとき、`BookletDayPage` がスポットカードを flex レイアウトに切替。左に通常のスポット情報、右に `QRCodeSVG`（qrcode.react）を60×60px で縦並び表示。URLが2件以上のときは「URL 1」「URL 2」のラベルを付加。QRコードはSVGなので印刷時も鮮明。

### ページ番号
- `config.showPageNumbers` で表示/非表示を切替
- 表紙・背表紙以外のブロック（day/text/packing）に通し番号を振る（1, 2, 3, ...）
- divider/spacer はカウント外
- 表示形式: `— N —`（控えめなセンタリング）
- **実装**: `pageNumber?: number` prop を各ブロックに渡し、`<article>` 末尾（内部）に描画

### ブロックの種類とプリセット
| 種類 | 説明 | 削除可 | ドラッグ可 |
|------|------|--------|-----------|
| `cover` | 表紙ブロック（1個・固定） | × | × |
| `back-cover` | 背表紙ブロック（1個・固定） | × | × |
| `day` | 旅程の日ブロック（日数分自動生成） | × | ○ |
| `text` | 汎用テキスト（タイトル＋本文） | ○ | ○ |
| `packing` | 持ち物リスト（チェックボックス・1/2/3列） | ○ | ○ |
| `divider` | 区切り線（solid/dashed/dotted） | ○ | ○ |
| `spacer` | スペーサー（高さ指定） | ○ | ○ |

`text` ブロックは旧オプショナルページ（編集メンバー・集合時間・緊急連絡先・メモ・金額メモ・自由ページ）の置き換え。タイトルもユーザーが自由に編集可能。

**持ち物リスト（packing）の挙動**:
- チェックボックスリスト（常時）・1/2/3列切替（ヘッダーの列数ボタン）
- 編集モード: 各行を `<input type="text">` で編集・× で削除・「＋ アイテムを追加」ボタン
- 印刷時の自動分割は CSS の `break-inside: avoid` に委譲（手動 `ITEMS_PER_COL` 分割は廃止）

### スポットごとのメモ・URL機能（BookletDayPage）
- スポットの `description`（AI生成説明文）は非表示（代わりにメモ・URLで手動補完）
- **スポットメモ**: `spot.memo?: string` フィールドに格納。入力済みなら本文表示＋鉛筆編集ボタン、未入力かつ編集可なら「＋ メモを追加」ボタン（点線ボーダー）。押下で `<textarea>` が開き 保存/キャンセル で確定
- **スポットURL**: `spot.links?: string[]` フィールドに格納（最大5件）。入力済みリンクは `<a>` で表示＋✕ 削除ボタン。「＋ URLを追加」ボタン（点線ボーダー）で `<input type="url">` が開き 追加/キャンセルで確定
- **アクションバー（横並び）**: 「＋ メモを追加」と「＋ URLを追加」は独立したボタンではなく、`display: flex; gap: 8` のアクションバー div にまとめて横並びで表示。メモ編集中・URL編集中は非表示。メモ入力済みなら「メモを追加」は消え「URLを追加」のみ表示
- 編集権限（`editToken` あり）の時のみ編集UIを表示。閲覧モードでは保存済みデータのみ表示
- **スポットソート**: `sortedSpots = day.spots.map((spot, origIdx) => ({ spot, origIdx })).sort(by time)` で元インデックスを保持。PATCH 送信時に `origIdx` で正しいスポットを特定
- **保存フロー**: `onSpotUpdate(origIdx, { memo })` → `BookletView.handleSpotUpdate(dayIdx, spotIdx, update)` → `localDays` 更新 → PATCH `/api/trips/${share_id}` で `{ itinerary: { ...trip.itinerary, days: newDays }, title, edit_token }`
- `localDays` は `BookletView` の `useState<ItineraryDay[]>` として管理（`trip.itinerary.days` を初期値）

**NOW / NEXT 判定**（旅行当日のみ動作）:
- `useEffect` でマウント後のみ `setInterval(60s)` で現在時刻を更新（SSR 差異回避）
- 進行中の予定 = NOW（青パルス・🔵 NOW バッジ）
- 次の予定（進行中なし時）= NEXT（⏭ NEXT バッジ）
- TODAY バッジを日付ヘッダーにも表示

**印刷対応**（`globals.css` の `@media print`・ブロックベース自動レイアウト）:
- `body > header`, `body > footer`, `.no-print` を非表示
- `.booklet-cover` に `break-after: page`、`.booklet-back-cover` に `break-before: page`（表紙/背表紙は独立ページ）
- `.booklet-page`（text/packing 等のブロック内 `<article>`）に `break-inside: avoid`（収まれば分割しない）
- `.booklet-day` のみ `break-inside: auto`（長い日程は自動分割を許可）
- `.booklet-divider`, `.booklet-spacer` も `break-inside: avoid`
- mainのD&Dハンドル領域（`padding-left: 56px`）は `padding: 0` に解除
- `.booklet-block-wrap` の `transform` をリセット（D&Dの並び替えアニメを印刷に出さない）
- `@page { size: A4; margin: 12mm 10mm }`
- リンクの `::after` URL 表示を抑止
- 真の PDF 出力は未実装（`window.print()` ベース・将来 `@react-pdf/renderer` 検討）

**ItineraryEditor からの遷移**:
- ツールバーに「📖 しおり」ボタン（オレンジグラデ）
- `editable && editToken` なら `?edit=token` を引継ぎ、しおりからカレンダーに戻った時も編集モードを維持
- 編集権限がある時のみブロックのD&Dハンドル・削除ボタン・編集UI が表示される

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
- **しおりブロック方式**: `config.blocks: BookletBlock[]` をユーザーがD&Dで並び替え・追加・削除（@dnd-kit）。印刷時は `break-inside: avoid` で自動レイアウト・自動改ページ
- **しおり旧データ自動マイグレーション**: `optionalPages`/`dayMemos` を持つ旧 localStorage を `migrateLegacyConfig` が blocks 配列に変換（次回保存時に新形式で上書き）
- **BookletConfig マイグレーション**: 旧 `screen/print` 構造を `loadBookletConfig` で自動変換（`parsed.screen` を source とする）


---

## ローカルLLM導入の経緯と判断(2026-05-23)

### 動機
- Gemini API のコスト削減
- 将来「ネット検索エージェント」「過去プランRAG」機能を追加する基盤

### 採用構成
- ランタイム: Ollama(MacBook Air M2/8GB に常駐)
- モデル: Qwen3 4B(汎用) + Qwen2.5 3B(抽出特化)
- 戦略: ハイブリッド(ローカル=軽い抽出処理、Gemini=重い生成処理)

### 段階的移行計画
- [x] フェーズD(基盤整備): Ollama インストール、共通クライアント作成
- [x] フェーズA(部分ローカル化): `generateTripFromArticle` を Ollama 化
- [ ] フェーズB(過去プランRAG): 蓄積されたプランからの類似検索・推薦
- [ ] フェーズC(ネット検索エージェント): 新規機能として開発

### フェーズB:過去プランRAG構想
旅程プランが蓄積されるにつれ、新規プランを組む際に「行き先・テーマが近い既存プラン」から
最適なものを提案する。

- Embedding: `nomic-embed-text` (Ollama, 274MB, 高速・無料)
- ベクトルDB: Supabase の pgvector 拡張(既存DBに統合)
- LLM(推薦理由生成): Qwen3 4B(既存)
- ローカルLLM優位性: Embedding は無料・類似検索は LLM 不要・推薦は短文で4B十分

### 参照
- 全体設計: `~/Documents/ClaudeCode/local-llm/docs/design.md`
- 統合仕様: `./docs/local-llm-integration.md`
- 実装プラン: `~/Documents/ClaudeCode/local-llm/docs/plans/2026-05-23-phase-D-foundation-and-phase-A-integration.md`
