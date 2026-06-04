import type { DestinationEntry } from '../types'

// 海外追加 第4弾：カナダ詳細・中南米・インド南/聖地・アフリカ・北欧・中東を強化

export const OVERSEAS_EXTRA_4: DestinationEntry[] = [
    // ──────────── カナダ：トロント・ナイアガラ ────────────
    {
        id: 'toronto-niagara', name: 'トロント・ナイアガラ', country: 'カナダ', region: 'overseas_america',
        trip_style: 'overseas_transit', intra_mode: '電車', intra_gap_min: 30,
        themes: ['sg', 'np', 'fm', 'gm'],
        areas: [
            { id: 'toronto', name: 'トロント' },
            { id: 'niagara', name: 'ナイアガラ' },
        ],
        spots: [
            { n: 'ナイアガラの滝（カナダ滝）', d: '世界三大瀑布のひとつ', t: '観光', dur: 240, addr: 'ナイアガラフォールズ', area: 'niagara', th: ['np', 'sg', 'fm'], pop: 5 },
            { n: 'ホーンブロワー・クルーズ', d: '滝の真下まで近づくクルーズ', t: '観光', dur: 90, addr: 'ナイアガラフォールズ', area: 'niagara', th: ['ex', 'np', 'fm'], pop: 5 },
            { n: 'ナイアガラ・オン・ザ・レイク', d: '19世紀の街並みとワイナリー', t: '観光', dur: 180, addr: 'ナイアガラ・オン・ザ・レイク', area: 'niagara', th: ['sg', 'gm', 'cp'], pop: 4 },
            { n: 'CNタワー', d: 'トロントのシンボル展望塔', t: '観光', dur: 90, addr: 'トロント', area: 'toronto', th: ['np', 'sg', 'ng'], pop: 5 },
            { n: 'カサ・ロマ', d: 'ゴシック様式の城館', t: '観光', dur: 120, addr: 'トロント', area: 'toronto', th: ['sg', 'hs'], pop: 4 },
            { n: 'セント・ローレンス・マーケット', d: '北米屈指のフードマーケット', t: 'グルメ', dur: 90, addr: 'トロント', area: 'toronto', th: ['gm', 'sg'], pop: 4 },
            { n: 'ディスティラリー地区', d: '蒸留所跡のおしゃれエリア', t: '観光', dur: 90, addr: 'トロント', area: 'toronto', th: ['sg', 'cp', 'sp'], pop: 4 },
            { n: 'ロイヤル・オンタリオ博物館', d: 'カナダ最大の博物館', t: '観光', dur: 150, addr: 'トロント', area: 'toronto', th: ['sg', 'ar', 'fm'], pop: 3 },
        ],
        hotels: [
            { n: 'リッツ・カールトン トロント', addr: 'トロント', area: 'toronto', price: 58000 },
            { n: 'シェラトン・オン・ザ・フォールズ', addr: 'ナイアガラフォールズ', area: 'niagara', price: 32000 },
        ],
    },

    // ──────────── カナダ：モントリオール・ケベック ────────────
    {
        id: 'montreal-quebec', name: 'モントリオール・ケベック', country: 'カナダ', region: 'overseas_america',
        trip_style: 'overseas_transit', intra_mode: '電車', intra_gap_min: 30,
        themes: ['sg', 'hs', 'wh', 'gm', 'cp'],
        areas: [
            { id: 'montreal', name: 'モントリオール' },
            { id: 'quebec-city', name: 'ケベックシティ' },
        ],
        spots: [
            { n: 'ノートルダム大聖堂（モントリオール）', d: 'ゴシック・リバイバルの傑作', t: '観光', dur: 90, addr: 'モントリオール', area: 'montreal', th: ['sg', 'hs', 'ar'], pop: 5 },
            { n: 'モン・ロワイヤル公園', d: '街を見下ろす丘の公園', t: '観光', dur: 120, addr: 'モントリオール', area: 'montreal', th: ['np', 'nt', 'cp'], pop: 4 },
            { n: 'オールド・モントリオール', d: '石畳の歴史的旧市街', t: '観光', dur: 150, addr: 'モントリオール', area: 'montreal', th: ['sg', 'hs', 'cp'], pop: 5 },
            { n: 'ジャン・タロン市場', d: '北米最大級の野外市場', t: 'グルメ', dur: 90, addr: 'モントリオール', area: 'montreal', th: ['gm', 'sg'], pop: 4 },
            { n: 'ケベック旧市街', d: '北米唯一の城壁都市・世界遺産', t: '観光', dur: 180, addr: 'ケベックシティ', area: 'quebec-city', th: ['sg', 'hs', 'wh', 'cp'], pop: 5 },
            { n: 'シャトー・フロンテナック', d: '世界一撮影されたホテル', t: '観光', dur: 90, addr: 'ケベックシティ', area: 'quebec-city', th: ['sg', 'hs', 'np'], pop: 5 },
            { n: 'プチシャンプラン通り', d: '北米最古の商店街', t: '観光', dur: 120, addr: 'ケベックシティ', area: 'quebec-city', th: ['sg', 'cp', 'sp'], pop: 5 },
            { n: 'モンモランシーの滝', d: 'ナイアガラより高い大瀑布', t: '観光', dur: 120, addr: 'ケベックシティ近郊', area: 'quebec-city', th: ['np'], pop: 4 },
            { n: 'プーティン（ケベック名物）', d: 'フライドポテト＋チーズ＋グレイビー', t: 'グルメ', dur: 45, addr: 'ケベック各地', area: 'quebec-city', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: 'フェアモント ル・シャトー・フロンテナック', addr: 'ケベックシティ', area: 'quebec-city', price: 65000 },
            { n: 'ホテル・ボナベンチャー・モントリオール', addr: 'モントリオール', area: 'montreal', price: 38000 },
        ],
    },

    // ──────────── カナダ：プリンスエドワード島 ────────────
    {
        id: 'pei', name: 'プリンスエドワード島', country: 'カナダ', region: 'overseas_america',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 40,
        themes: ['np', 'cp', 'fm', 'nt'],
        areas: [{ id: 'pei-c', name: 'PEI' }],
        spots: [
            { n: 'グリーン・ゲイブルズ（赤毛のアン家）', d: '物語の舞台の家', t: '観光', dur: 120, addr: 'キャベンディッシュ', area: 'pei-c', th: ['sg', 'hs', 'cp'], pop: 5 },
            { n: 'アボンリー村', d: 'モンゴメリ作品の世界観の再現村', t: '観光', dur: 120, addr: 'キャベンディッシュ', area: 'pei-c', th: ['sg', 'fm'], pop: 4 },
            { n: 'PEI国立公園', d: '赤土の海岸と砂浜', t: '観光', dur: 240, addr: 'PEI北岸', area: 'pei-c', th: ['np', 'nt', 'bc'], pop: 5 },
            { n: 'コンフェデレーションブリッジ', d: '世界最長級の海上橋', t: '観光', dur: 60, addr: 'PEI', area: 'pei-c', th: ['sg', 'np'], pop: 4 },
            { n: 'シャーロットタウン旧市街', d: 'カナダ建国の地', t: '観光', dur: 120, addr: 'シャーロットタウン', area: 'pei-c', th: ['sg', 'hs'], pop: 4 },
            { n: 'ロブスター・サパー', d: 'PEI名物の海の幸', t: 'グルメ', dur: 120, addr: 'PEI各地', area: 'pei-c', th: ['gm'], pop: 5 },
        ],
        hotels: [
            { n: 'ザ・グリーン・ゲイブルズ・ホテル', addr: 'キャベンディッシュ', area: 'pei-c', price: 28000 },
            { n: 'デルタ・プリンスエドワード', addr: 'シャーロットタウン', area: 'pei-c', price: 24000 },
        ],
    },

    // ──────────── ブラジル：リオデジャネイロ ────────────
    {
        id: 'rio', name: 'リオデジャネイロ', country: 'ブラジル', region: 'overseas_america',
        trip_style: 'overseas_transit', intra_mode: 'タクシー', intra_gap_min: 30,
        themes: ['np', 'bc', 'sg', 'cp', 'ng', 'wh'],
        areas: [{ id: 'rio-c', name: 'リオ中心' }],
        spots: [
            { n: 'コルコバードの丘（キリスト像）', d: '世界遺産の巨大キリスト像', t: '観光', dur: 180, addr: 'リオ', area: 'rio-c', th: ['sg', 'np', 'wh'], pop: 5 },
            { n: 'シュガーローフ山', d: 'ロープウェイで登る奇岩', t: '観光', dur: 180, addr: 'リオ', area: 'rio-c', th: ['np', 'sg', 'cp'], pop: 5 },
            { n: 'コパカバーナビーチ', d: 'リオを代表する4kmの白浜', t: '観光', dur: 180, addr: 'リオ', area: 'rio-c', th: ['bc', 'cp', 'sg'], pop: 5 },
            { n: 'イパネマビーチ', d: 'おしゃれセレブリティが集う海', t: '観光', dur: 180, addr: 'リオ', area: 'rio-c', th: ['bc', 'cp'], pop: 5 },
            { n: 'セラロン階段', d: 'カラフルなタイルアート', t: '観光', dur: 60, addr: 'リオ', area: 'rio-c', th: ['ar', 'cp', 'sg'], pop: 5 },
            { n: 'マラカナン・スタジアム', d: 'ワールドカップ決勝の聖地', t: '観光', dur: 90, addr: 'リオ', area: 'rio-c', th: ['sg', 'ex'], pop: 3 },
            { n: 'ティジューカ国立公園', d: '世界最大級の都市内熱帯雨林', t: '観光', dur: 240, addr: 'リオ', area: 'rio-c', th: ['nt', 'np'], pop: 3 },
            { n: 'サンバショー（プラチナレ）', d: 'リオならではの夜', t: '観光', dur: 180, addr: 'リオ', area: 'rio-c', th: ['ng', 'ex', 'cp'], pop: 4 },
            { n: 'シュラスコ料理', d: 'ブラジル名物の肉料理', t: 'グルメ', dur: 120, addr: 'リオ各地', area: 'rio-c', th: ['gm'], pop: 5 },
        ],
        hotels: [
            { n: 'ベルモンド コパカバーナ パレス', addr: 'リオ', area: 'rio-c', price: 78000 },
            { n: 'フェアモント リオ', addr: 'リオ', area: 'rio-c', price: 52000 },
        ],
    },

    // ──────────── イグアスの滝 ────────────
    {
        id: 'iguazu', name: 'イグアスの滝', country: 'ブラジル/アルゼンチン', region: 'overseas_america',
        trip_style: 'mixed', intra_mode: 'バス', intra_gap_min: 60,
        themes: ['np', 'nt', 'wh', 'ex'],
        areas: [
            { id: 'iguazu-br', name: 'ブラジル側' },
            { id: 'iguazu-ar', name: 'アルゼンチン側' },
        ],
        spots: [
            { n: 'イグアス国立公園（ブラジル側）', d: '滝群を一望する世界遺産', t: '観光', dur: 240, addr: 'ブラジル側', area: 'iguazu-br', th: ['np', 'wh', 'nt'], pop: 5 },
            { n: '悪魔の喉笛（アルゼンチン側）', d: '滝の最大落差ポイント', t: '観光', dur: 240, addr: 'アルゼンチン側', area: 'iguazu-ar', th: ['np', 'wh', 'ex'], pop: 5 },
            { n: 'マクコ・サファリ（滝つぼボート）', d: '滝の下まで突入するボート', t: '観光', dur: 120, addr: 'ブラジル側', area: 'iguazu-br', th: ['ex', 'np'], pop: 5, bk: true },
            { n: 'ヘリコプター遊覧', d: '上空からのイグアス絶景', t: '観光', dur: 60, addr: 'ブラジル側', area: 'iguazu-br', th: ['np', 'ex', 'cp'], pop: 4 },
            { n: '鳥の楽園パーク', d: '南米熱帯鳥の保護施設', t: '観光', dur: 90, addr: 'ブラジル側', area: 'iguazu-br', th: ['nt', 'fm'], pop: 3 },
        ],
        hotels: [
            { n: 'ベルモンド ホテル・ダス・カタラタス', addr: 'ブラジル国立公園内', area: 'iguazu-br', price: 95000 },
            { n: 'グラン・メリア・イグアス', addr: 'アルゼンチン側', area: 'iguazu-ar', price: 58000 },
        ],
    },

    // ──────────── ブエノスアイレス ────────────
    {
        id: 'buenos-aires', name: 'ブエノスアイレス', country: 'アルゼンチン', region: 'overseas_america',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 25,
        themes: ['sg', 'gm', 'ar', 'cp', 'ng'],
        areas: [{ id: 'ba-c', name: 'ブエノスアイレス' }],
        spots: [
            { n: 'カミニート（ボカ地区）', d: 'カラフルなタンゴの街', t: '観光', dur: 120, addr: 'ボカ地区', area: 'ba-c', th: ['sg', 'cp', 'ar'], pop: 5 },
            { n: 'レコレータ墓地', d: 'エビータが眠る豪華な墓地', t: '観光', dur: 90, addr: 'レコレータ', area: 'ba-c', th: ['sg', 'hs'], pop: 4 },
            { n: 'コロン劇場', d: '世界三大歌劇場のひとつ', t: '観光', dur: 90, addr: 'ブエノスアイレス', area: 'ba-c', th: ['sg', 'ar', 'hs'], pop: 4 },
            { n: 'プエルト・マデロ', d: '再開発された港湾エリア', t: '観光', dur: 120, addr: 'プエルトマデロ', area: 'ba-c', th: ['sg', 'cp', 'gm'], pop: 3 },
            { n: 'サン・テルモ日曜市', d: 'アンティーク市と路上タンゴ', t: '観光', dur: 180, addr: 'サンテルモ', area: 'ba-c', th: ['sg', 'sp', 'ng'], pop: 5 },
            { n: 'タンゴショー', d: '本場のタンゴディナーショー', t: '観光', dur: 180, addr: 'ブエノスアイレス', area: 'ba-c', th: ['ng', 'cp', 'ex'], pop: 5, bk: true },
            { n: 'アサード（ステーキ）', d: 'アルゼンチン名物グリル', t: 'グルメ', dur: 120, addr: '各地', area: 'ba-c', th: ['gm'], pop: 5 },
        ],
        hotels: [
            { n: 'パークハイアット ブエノスアイレス', addr: 'ブエノスアイレス', area: 'ba-c', price: 58000 },
            { n: 'アルベア パレス', addr: 'ブエノスアイレス', area: 'ba-c', price: 48000 },
        ],
    },

    // ──────────── パタゴニア ────────────
    {
        id: 'patagonia', name: 'パタゴニア', country: 'チリ/アルゼンチン', region: 'overseas_america',
        trip_style: 'rental_car', intra_mode: 'バス', intra_gap_min: 60,
        themes: ['np', 'nt', 'ex'],
        areas: [
            { id: 'torres-paine', name: 'トーレス・デル・パイネ' },
            { id: 'calafate', name: 'カラファテ' },
        ],
        spots: [
            { n: 'トーレス・デル・パイネ国立公園', d: 'パタゴニアの象徴的三本峰', t: '観光', dur: 480, addr: 'チリ側', area: 'torres-paine', th: ['np', 'nt', 'ex'], pop: 5 },
            { n: 'ペリト・モレノ氷河', d: '崩落で有名な巨大氷河', t: '観光', dur: 300, addr: 'カラファテ', area: 'calafate', th: ['np', 'nt', 'ex'], pop: 5 },
            { n: 'アイスウォーク（ペリト・モレノ）', d: '氷河の上を歩く体験', t: '観光', dur: 240, addr: 'カラファテ', area: 'calafate', th: ['ex', 'np'], pop: 4, bk: true },
            { n: 'フィッツロイ展望（エル・チャルテン）', d: 'トレッキングの聖地', t: '観光', dur: 480, addr: 'エル・チャルテン', area: 'calafate', th: ['nt', 'ex', 'np'], pop: 5 },
            { n: 'ペンギンコロニー', d: 'マゼランペンギンを観察', t: '観光', dur: 240, addr: 'プエルト・マドリン他', area: 'torres-paine', th: ['nt', 'fm'], pop: 4 },
        ],
        hotels: [
            { n: 'エクスプローラ・パタゴニア', addr: 'トーレス・デル・パイネ', area: 'torres-paine', price: 145000 },
            { n: 'ロス・ナランホス・アパート', addr: 'カラファテ', area: 'calafate', price: 32000 },
        ],
    },

    // ──────────── イースター島 ────────────
    {
        id: 'easter-island', name: 'イースター島', country: 'チリ', region: 'overseas_america',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 40,
        themes: ['sg', 'hs', 'wh', 'np'],
        areas: [{ id: 'rapa-nui', name: 'ラパ・ヌイ' }],
        spots: [
            { n: 'アフ・トンガリキ（15体のモアイ）', d: '島最大のモアイ群・朝日の名所', t: '観光', dur: 180, addr: 'イースター島', area: 'rapa-nui', th: ['sg', 'hs', 'wh', 'np'], pop: 5 },
            { n: 'ラノ・ララクのモアイ採石場', d: '完成途上のモアイが残る山', t: '観光', dur: 180, addr: 'イースター島', area: 'rapa-nui', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'アナケナビーチ', d: '島で最も美しい砂浜', t: '観光', dur: 180, addr: 'イースター島', area: 'rapa-nui', th: ['bc', 'np'], pop: 4 },
            { n: 'オロンゴ祭祀村', d: '鳥人崇拝の聖地', t: '観光', dur: 120, addr: 'イースター島', area: 'rapa-nui', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'アフ・タハイ（夕日）', d: '夕日に染まるモアイ', t: '観光', dur: 90, addr: 'ハンガロア', area: 'rapa-nui', th: ['np', 'cp'], pop: 5 },
        ],
        hotels: [
            { n: 'エクスプローラ・ラパヌイ', addr: 'イースター島', area: 'rapa-nui', price: 165000 },
            { n: 'ハンガロア・エコ・ヴィレッジ', addr: 'ハンガロア', area: 'rapa-nui', price: 58000 },
        ],
    },

    // ──────────── コスタリカ ────────────
    {
        id: 'costa-rica', name: 'コスタリカ', country: 'コスタリカ', region: 'overseas_america',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 60,
        themes: ['nt', 'ex', 'np', 'bc'],
        areas: [
            { id: 'arenal', name: 'アレナル火山' },
            { id: 'monteverde', name: 'モンテベルデ' },
            { id: 'manuel-antonio', name: 'マヌエル・アントニオ' },
        ],
        spots: [
            { n: 'アレナル火山国立公園', d: 'コーン型の活火山', t: '観光', dur: 240, addr: 'アレナル', area: 'arenal', th: ['np', 'nt'], pop: 5 },
            { n: 'タバコン温泉', d: '火山由来の天然温泉', t: '観光', dur: 180, addr: 'アレナル', area: 'arenal', th: ['on', 'cp'], pop: 5 },
            { n: 'モンテベルデ雲霧林', d: '雲に包まれた原生林', t: '観光', dur: 240, addr: 'モンテベルデ', area: 'monteverde', th: ['nt', 'np', 'ex'], pop: 5 },
            { n: 'スカイウォーク・ジップライン', d: '森の頂上を渡る吊橋とジップ', t: '観光', dur: 180, addr: 'モンテベルデ', area: 'monteverde', th: ['ex', 'nt'], pop: 5, bk: true },
            { n: 'マヌエル・アントニオ国立公園', d: 'ナマケモノと白浜', t: '観光', dur: 240, addr: 'マヌエル・アントニオ', area: 'manuel-antonio', th: ['nt', 'bc', 'np'], pop: 5 },
            { n: 'カヤック＆ホエール', d: 'ザトウクジラ＆カヤック体験', t: '観光', dur: 240, addr: '太平洋岸', area: 'manuel-antonio', th: ['ex', 'nt'], pop: 4 },
        ],
        hotels: [
            { n: 'タバコン・グランド・スパ・サーマル・リゾート', addr: 'アレナル', area: 'arenal', price: 48000 },
            { n: 'モンテベルデ・ロッジ＆ガーデンズ', addr: 'モンテベルデ', area: 'monteverde', price: 28000 },
        ],
    },

    // ──────────── コロンビア・カルタヘナ ────────────
    {
        id: 'cartagena', name: 'カルタヘナ・コロンビア', country: 'コロンビア', region: 'overseas_america',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 20,
        themes: ['sg', 'hs', 'wh', 'cp', 'bc', 'gm'],
        areas: [{ id: 'cartagena-c', name: 'カルタヘナ' }],
        spots: [
            { n: 'カルタヘナ旧市街', d: 'カリブ海の世界遺産植民都市', t: '観光', dur: 240, addr: 'カルタヘナ', area: 'cartagena-c', th: ['sg', 'hs', 'wh', 'cp'], pop: 5 },
            { n: 'サン・フェリペ要塞', d: '南米最大級のスペイン要塞', t: '観光', dur: 120, addr: 'カルタヘナ', area: 'cartagena-c', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '時計塔と城壁散策', d: '夕日に染まる城壁を歩く', t: '観光', dur: 90, addr: 'カルタヘナ', area: 'cartagena-c', th: ['sg', 'cp', 'np'], pop: 5 },
            { n: 'ロサリオ諸島', d: 'カリブ海の楽園諸島', t: '観光', dur: 480, addr: 'カルタヘナ沖', area: 'cartagena-c', th: ['bc', 'np', 'ex'], pop: 5 },
            { n: 'ボデゴン地区（ゲットセマニ）', d: 'ストリートアートの街', t: '観光', dur: 90, addr: 'カルタヘナ', area: 'cartagena-c', th: ['ar', 'sg'], pop: 4 },
        ],
        hotels: [
            { n: 'ソフィテル・レジェンド・サンタクララ', addr: 'カルタヘナ旧市街', area: 'cartagena-c', price: 62000 },
            { n: 'カサ・サン・アグスティン', addr: 'カルタヘナ旧市街', area: 'cartagena-c', price: 48000 },
        ],
    },

    // ──────────── アマゾン ────────────
    {
        id: 'amazon', name: 'アマゾン（マナウス）', country: 'ブラジル', region: 'overseas_america',
        trip_style: 'mixed', intra_mode: '船', intra_gap_min: 90,
        themes: ['nt', 'np', 'ex'],
        areas: [{ id: 'manaus', name: 'マナウス・アマゾン' }],
        spots: [
            { n: 'アマゾン川クルーズ', d: '世界最大の流域をボートで', t: '観光', dur: 480, addr: 'マナウス', area: 'manaus', th: ['ex', 'nt', 'np'], pop: 5, bk: true },
            { n: '川の出会い（黒い川と白い川）', d: '２つの川が混じり合わずに並ぶ', t: '観光', dur: 120, addr: 'マナウス', area: 'manaus', th: ['np', 'nt', 'sg'], pop: 5 },
            { n: 'アマゾン熱帯雨林トレッキング', d: '原生のジャングル体験', t: '観光', dur: 360, addr: 'マナウス周辺', area: 'manaus', th: ['nt', 'ex'], pop: 4 },
            { n: 'ピンクイルカ観察', d: '希少種ピンクのイルカと泳ぐ', t: '観光', dur: 180, addr: 'マナウス周辺', area: 'manaus', th: ['nt', 'ex', 'fm'], pop: 4 },
            { n: 'マナウス劇場', d: 'アマゾンの中の壮麗なオペラ座', t: '観光', dur: 75, addr: 'マナウス', area: 'manaus', th: ['sg', 'hs', 'ar'], pop: 3 },
        ],
        hotels: [
            { n: 'アナビーリャ・ジャングルロッジ', addr: 'マナウス近郊', area: 'manaus', price: 58000 },
            { n: 'ジュマ・アマゾン・ロッジ', addr: 'マナウス近郊', area: 'manaus', price: 65000 },
        ],
    },

    // ──────────── 南インド・ケララ ────────────
    {
        id: 'kerala', name: 'ケララ・南インド', country: 'インド', region: 'overseas_asia_far',
        trip_style: 'mixed', intra_mode: '船', intra_gap_min: 60,
        themes: ['np', 'nt', 'on', 'gm', 'cp'],
        areas: [
            { id: 'cochin', name: 'コチ' },
            { id: 'backwaters', name: 'バックウォーター' },
            { id: 'munnar', name: 'ムンナール' },
        ],
        spots: [
            { n: 'バックウォーター・ハウスボート', d: '水郷を貸切舟で巡る', t: '観光', dur: 600, addr: 'アレッピー', area: 'backwaters', th: ['np', 'cp', 'nt'], pop: 5, bk: true },
            { n: 'チャイニーズフィッシングネット', d: 'コチ名物の手動漁網', t: '観光', dur: 60, addr: 'コチ', area: 'cochin', th: ['sg', 'hs'], pop: 4 },
            { n: 'マッタンチェリー・パレス', d: 'ポルトガル人建造の宮殿', t: '観光', dur: 90, addr: 'コチ', area: 'cochin', th: ['sg', 'hs'], pop: 3 },
            { n: 'ムンナール紅茶畑', d: '南インドの紅茶郷', t: '観光', dur: 240, addr: 'ムンナール', area: 'munnar', th: ['np', 'nt', 'gm'], pop: 5 },
            { n: 'カタカリ舞踊鑑賞', d: '南インド古典舞踊', t: '観光', dur: 120, addr: 'コチ', area: 'cochin', th: ['ar', 'hs', 'cp'], pop: 4 },
            { n: 'アーユルヴェーダ', d: '本場の伝統医学スパ', t: 'その他', dur: 120, addr: 'ケララ各地', area: 'backwaters', th: ['on', 'cp', 'ex'], pop: 5, bk: true },
            { n: '南インドカレー（ミールス）', d: 'バナナの葉でいただく定食', t: 'グルメ', dur: 75, addr: 'ケララ各地', area: 'cochin', th: ['gm', 'hs'], pop: 4 },
        ],
        hotels: [
            { n: 'カイラリ・ザ・ヒーリング・ヴィレッジ', addr: 'パラッカード', area: 'backwaters', price: 38000 },
            { n: 'ザ・リーラ・コチ', addr: 'コチ', area: 'cochin', price: 28000 },
        ],
    },

    // ──────────── バラナシ・ガンジス川 ────────────
    {
        id: 'varanasi', name: 'バラナシ・ガンジス川', country: 'インド', region: 'overseas_asia_far',
        trip_style: 'walking', intra_mode: '徒歩', intra_gap_min: 25,
        themes: ['sg', 'hs', 'ar'],
        areas: [{ id: 'varanasi-c', name: 'バラナシ' }],
        spots: [
            { n: 'ガンジス川早朝沐浴', d: 'ヒンドゥー教徒の聖なる朝', t: '観光', dur: 120, addr: 'バラナシ', area: 'varanasi-c', th: ['sg', 'hs', 'ex'], pop: 5, morningOk: true },
            { n: 'ガンジス川ボート', d: '日の出のガートを舟から見る', t: '観光', dur: 90, addr: 'バラナシ', area: 'varanasi-c', th: ['sg', 'hs', 'np'], pop: 5 },
            { n: 'マニカルニカ・ガート', d: '聖なる火葬場', t: '観光', dur: 60, addr: 'バラナシ', area: 'varanasi-c', th: ['sg', 'hs'], pop: 4 },
            { n: 'ダシャシュワメード・ガート', d: '毎晩のアールティ（祈祷）', t: '観光', dur: 90, addr: 'バラナシ', area: 'varanasi-c', th: ['sg', 'hs', 'cp'], pop: 5, eveningOk: true },
            { n: 'サールナート', d: 'ブッダ初説法の聖地', t: '観光', dur: 180, addr: 'バラナシ近郊', area: 'varanasi-c', th: ['sg', 'hs'], pop: 4 },
            { n: 'バラナシ旧市街の路地', d: '迷路のような聖なる路地', t: '観光', dur: 180, addr: 'バラナシ', area: 'varanasi-c', th: ['sg', 'hs', 'sp'], pop: 4 },
        ],
        hotels: [
            { n: 'タージ・ガンジス', addr: 'バラナシ', area: 'varanasi-c', price: 32000 },
            { n: 'ブリジ・ラマ・パレス', addr: 'バラナシ', area: 'varanasi-c', price: 18000 },
        ],
    },

    // ──────────── タンザニア・ザンジバル ────────────
    {
        id: 'tanzania-zanzibar', name: 'タンザニア・ザンジバル', country: 'タンザニア', region: 'overseas_middleeast',
        trip_style: 'mixed', intra_mode: '飛行機', intra_gap_min: 60,
        themes: ['nt', 'np', 'wh', 'ex', 'bc'],
        areas: [
            { id: 'serengeti', name: 'セレンゲティ' },
            { id: 'ngorongoro', name: 'ンゴロンゴロ' },
            { id: 'zanzibar', name: 'ザンジバル' },
        ],
        spots: [
            { n: 'セレンゲティ国立公園', d: '大移動の舞台・世界遺産', t: '観光', dur: 480, addr: 'セレンゲティ', area: 'serengeti', th: ['nt', 'np', 'wh'], pop: 5 },
            { n: 'ンゴロンゴロ・クレーター', d: '巨大カルデラのサファリ', t: '観光', dur: 360, addr: 'ンゴロンゴロ', area: 'ngorongoro', th: ['nt', 'np', 'wh'], pop: 5 },
            { n: 'タランギーレ国立公園', d: 'バオバブと象の楽園', t: '観光', dur: 360, addr: 'タランギーレ', area: 'serengeti', th: ['nt', 'np'], pop: 4 },
            { n: 'ストーンタウン（ザンジバル）', d: '世界遺産の旧市街', t: '観光', dur: 180, addr: 'ザンジバル', area: 'zanzibar', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ヌングィビーチ（ザンジバル）', d: 'インド洋の白浜', t: '観光', dur: 240, addr: 'ザンジバル北部', area: 'zanzibar', th: ['bc', 'cp', 'np'], pop: 5 },
            { n: 'スパイスツアー', d: 'ザンジバルの香辛料農園', t: '観光', dur: 180, addr: 'ザンジバル', area: 'zanzibar', th: ['gm', 'ex', 'fm'], pop: 4 },
        ],
        hotels: [
            { n: 'フォーシーズンズ・サファリロッジ・セレンゲティ', addr: 'セレンゲティ', area: 'serengeti', price: 145000 },
            { n: 'パーク・ハイアット・ザンジバル', addr: 'ザンジバル', area: 'zanzibar', price: 58000 },
        ],
    },

    // ──────────── マダガスカル ────────────
    {
        id: 'madagascar', name: 'マダガスカル', country: 'マダガスカル', region: 'overseas_middleeast',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 60,
        themes: ['nt', 'np', 'ex'],
        areas: [{ id: 'mada-c', name: 'マダガスカル' }],
        spots: [
            { n: 'バオバブ街道', d: '世界的に有名な巨木の並木', t: '観光', dur: 180, addr: 'モロンダバ', area: 'mada-c', th: ['np', 'nt', 'cp'], pop: 5 },
            { n: 'キリンディ森林保護区', d: '夜行性キツネザル探索', t: '観光', dur: 240, addr: 'モロンダバ', area: 'mada-c', th: ['nt', 'ex'], pop: 4 },
            { n: 'アンダシベ国立公園', d: 'インドリ（最大キツネザル）', t: '観光', dur: 240, addr: 'アンダシベ', area: 'mada-c', th: ['nt', 'np'], pop: 5 },
            { n: 'ツィンギ・デ・ベマラハ', d: '針の山と称される世界遺産', t: '観光', dur: 360, addr: 'ベマラハ', area: 'mada-c', th: ['np', 'wh', 'ex'], pop: 4 },
            { n: 'ノシ・ベ島', d: 'インド洋の美しいリゾート島', t: '観光', dur: 360, addr: 'ノシ・ベ', area: 'mada-c', th: ['bc', 'np', 'cp'], pop: 4 },
        ],
        hotels: [
            { n: 'パラディジエ・サマラ・ロッジ', addr: 'ノシ・ベ', area: 'mada-c', price: 38000 },
            { n: 'バオバブ・カフェ', addr: 'モロンダバ', area: 'mada-c', price: 18000 },
        ],
    },

    // ──────────── ヴィクトリアの滝 ────────────
    {
        id: 'victoria-falls', name: 'ヴィクトリアの滝', country: 'ジンバブエ/ザンビア', region: 'overseas_middleeast',
        trip_style: 'rental_car', intra_mode: 'バス', intra_gap_min: 45,
        themes: ['np', 'wh', 'ex', 'nt'],
        areas: [{ id: 'vic-falls', name: 'ヴィクトリアの滝' }],
        spots: [
            { n: 'ヴィクトリアの滝（ジンバブエ側）', d: '世界三大瀑布・世界遺産', t: '観光', dur: 180, addr: 'ヴィクトリアフォールズ', area: 'vic-falls', th: ['np', 'wh', 'nt'], pop: 5 },
            { n: '滝のヘリ遊覧', d: '上空から見る圧巻の絶景', t: '観光', dur: 60, addr: 'ヴィクトリアフォールズ', area: 'vic-falls', th: ['np', 'ex'], pop: 5 },
            { n: 'デビルズプール（ザンビア側）', d: '滝の縁の天然プール', t: '観光', dur: 240, addr: 'リビングストン', area: 'vic-falls', th: ['ex', 'np'], pop: 5, bk: true },
            { n: 'ザンベジ川サンセットクルーズ', d: '夕日のクルーズと野生動物', t: '観光', dur: 180, addr: 'ザンベジ川', area: 'vic-falls', th: ['cp', 'np', 'nt'], pop: 5 },
            { n: 'チョベ国立公園（日帰り）', d: 'ボツワナの象サファリ', t: '観光', dur: 480, addr: 'チョベ', area: 'vic-falls', th: ['nt', 'ex'], pop: 5 },
        ],
        hotels: [
            { n: 'ヴィクトリア・フォールズ・ホテル', addr: 'ジンバブエ側', area: 'vic-falls', price: 48000 },
            { n: 'ロイヤル・リビングストン', addr: 'ザンビア側', area: 'vic-falls', price: 78000 },
        ],
    },

    // ──────────── モーリシャス ────────────
    {
        id: 'mauritius', name: 'モーリシャス', country: 'モーリシャス', region: 'overseas_middleeast',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 40,
        themes: ['bc', 'cp', 'np', 'on'],
        areas: [{ id: 'mauritius-c', name: 'モーリシャス' }],
        spots: [
            { n: 'ル・モーンビーチ', d: '世界遺産の絶景ビーチ', t: '観光', dur: 240, addr: 'ル・モーン半島', area: 'mauritius-c', th: ['bc', 'cp', 'np', 'wh'], pop: 5 },
            { n: 'シャマレル7色の大地', d: '虹色の砂丘', t: '観光', dur: 120, addr: 'シャマレル', area: 'mauritius-c', th: ['np', 'sg'], pop: 5 },
            { n: 'ブラックリバー渓谷国立公園', d: '原生林ハイキング', t: '観光', dur: 240, addr: '南西部', area: 'mauritius-c', th: ['nt', 'np'], pop: 4 },
            { n: 'グランベイ（北部リゾート）', d: 'マリンアクティビティ拠点', t: '観光', dur: 240, addr: '北部', area: 'mauritius-c', th: ['bc', 'ex'], pop: 4 },
            { n: 'パンプルムース植物園', d: '世界屈指の熱帯植物園', t: '観光', dur: 120, addr: '北部', area: 'mauritius-c', th: ['nt', 'cp'], pop: 3 },
        ],
        hotels: [
            { n: 'ワン＆オンリー・ル・サン・ジェラン', addr: 'モーリシャス東岸', area: 'mauritius-c', price: 165000 },
            { n: 'コンスタンス・プランス・モーリス', addr: '北東岸', area: 'mauritius-c', price: 125000 },
        ],
    },

    // ──────────── イスラエル ────────────
    {
        id: 'israel', name: 'イスラエル', country: 'イスラエル', region: 'overseas_middleeast',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 45,
        themes: ['sg', 'hs', 'wh'],
        areas: [
            { id: 'jerusalem', name: 'エルサレム' },
            { id: 'tel-aviv', name: 'テルアビブ' },
        ],
        spots: [
            { n: '嘆きの壁', d: 'ユダヤ教最高の聖地', t: '観光', dur: 90, addr: 'エルサレム旧市街', area: 'jerusalem', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '聖墳墓教会', d: 'キリスト処刑・埋葬の地', t: '観光', dur: 120, addr: 'エルサレム旧市街', area: 'jerusalem', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: '岩のドーム', d: 'イスラム教第3の聖地', t: '観光', dur: 90, addr: 'エルサレム旧市街', area: 'jerusalem', th: ['sg', 'hs', 'wh', 'ar'], pop: 5 },
            { n: 'マサダ要塞', d: '世界遺産の岩山要塞', t: '観光', dur: 240, addr: 'マサダ', area: 'jerusalem', th: ['sg', 'hs', 'wh', 'np'], pop: 5 },
            { n: '死海の浮遊体験', d: '塩分濃度最高の不沈の海', t: '観光', dur: 180, addr: '死海', area: 'jerusalem', th: ['ex', 'np', 'on'], pop: 5 },
            { n: 'ベツレヘム生誕教会', d: 'キリスト生誕地の世界遺産', t: '観光', dur: 120, addr: 'ベツレヘム', area: 'jerusalem', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'テルアビブ・ビーチ', d: '地中海のリゾートビーチ', t: '観光', dur: 180, addr: 'テルアビブ', area: 'tel-aviv', th: ['bc', 'cp'], pop: 4 },
            { n: 'ヤッフォ旧市街', d: '世界最古の港町のひとつ', t: '観光', dur: 120, addr: 'テルアビブ', area: 'tel-aviv', th: ['sg', 'hs', 'cp'], pop: 4 },
        ],
        hotels: [
            { n: 'キング・デイヴィッド・ホテル', addr: 'エルサレム', area: 'jerusalem', price: 78000 },
            { n: 'ザ・ノーマン・テルアビブ', addr: 'テルアビブ', area: 'tel-aviv', price: 52000 },
        ],
    },

    // ──────────── ノルウェー・フィヨルド ────────────
    {
        id: 'norway-fjord', name: 'ノルウェー・フィヨルド', country: 'ノルウェー', region: 'overseas_europe',
        trip_style: 'mixed', intra_mode: '電車', intra_gap_min: 60,
        themes: ['np', 'nt', 'wh', 'cp'],
        areas: [
            { id: 'bergen', name: 'ベルゲン' },
            { id: 'flam', name: 'フロム' },
            { id: 'geiranger', name: 'ガイランゲル' },
        ],
        spots: [
            { n: 'ガイランゲル・フィヨルド', d: '世界遺産のフィヨルド絶景', t: '観光', dur: 240, addr: 'ガイランゲル', area: 'geiranger', th: ['np', 'wh', 'nt'], pop: 5 },
            { n: 'ソグネフィヨルド', d: 'ノルウェー最長のフィヨルド', t: '観光', dur: 240, addr: 'フロム', area: 'flam', th: ['np', 'nt'], pop: 5 },
            { n: 'フロム鉄道', d: '世界一美しいと評される山岳鉄道', t: '観光', dur: 90, addr: 'フロム', area: 'flam', th: ['np', 'ex'], pop: 5 },
            { n: 'ベルゲン・ブリッゲン地区', d: 'ハンザ同盟時代の世界遺産木造街', t: '観光', dur: 180, addr: 'ベルゲン', area: 'bergen', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ベルゲン魚市場', d: '北欧の海の幸', t: 'グルメ', dur: 90, addr: 'ベルゲン', area: 'bergen', th: ['gm', 'sg'], pop: 4 },
            { n: 'プレーケストーレン（説教壇岩）', d: '断崖の絶景', t: '観光', dur: 360, addr: 'スタヴァンゲル', area: 'bergen', th: ['np', 'ex'], pop: 5 },
        ],
        hotels: [
            { n: 'ホテル・ユニオン・ガイランゲル', addr: 'ガイランゲル', area: 'geiranger', price: 42000 },
            { n: 'ベルゲン・ブリッゲン・ヘリエ・ホテル', addr: 'ベルゲン', area: 'bergen', price: 38000 },
        ],
    },

    // ──────────── アイルランド ────────────
    {
        id: 'ireland', name: 'アイルランド', country: 'アイルランド', region: 'overseas_europe',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 50,
        themes: ['sg', 'hs', 'np', 'nt', 'gm'],
        areas: [
            { id: 'dublin', name: 'ダブリン' },
            { id: 'cliffs', name: 'モハーの断崖' },
        ],
        spots: [
            { n: 'ダブリン城', d: '700年以上の歴史', t: '観光', dur: 90, addr: 'ダブリン', area: 'dublin', th: ['sg', 'hs'], pop: 4 },
            { n: 'テンプル・バー地区', d: 'パブとライブミュージック', t: '観光', dur: 180, addr: 'ダブリン', area: 'dublin', th: ['ng', 'gm', 'sg'], pop: 5, eveningOk: true },
            { n: 'トリニティ・カレッジ', d: 'ケルズの書を見られる図書館', t: '観光', dur: 120, addr: 'ダブリン', area: 'dublin', th: ['sg', 'hs', 'ar'], pop: 5 },
            { n: 'ギネス・ストアハウス', d: 'ギネスビール醸造所見学', t: '観光', dur: 180, addr: 'ダブリン', area: 'dublin', th: ['gm', 'ex', 'sg'], pop: 5 },
            { n: 'モハーの断崖', d: '高さ200mの大西洋断崖', t: '観光', dur: 240, addr: 'クレア州', area: 'cliffs', th: ['np', 'nt'], pop: 5 },
            { n: 'ゴールウェイ旧市街', d: 'アイルランド西岸の港町', t: '観光', dur: 120, addr: 'ゴールウェイ', area: 'cliffs', th: ['sg', 'hs', 'gm'], pop: 4 },
            { n: 'ジャイアンツ・コーズウェー（北アイルランド）', d: '六角柱の世界遺産', t: '観光', dur: 240, addr: '北アイルランド', area: 'cliffs', th: ['np', 'wh', 'nt'], pop: 5 },
        ],
        hotels: [
            { n: 'ザ・シェルボーン', addr: 'ダブリン', area: 'dublin', price: 48000 },
            { n: 'アシュフォード城', addr: 'コング', area: 'cliffs', price: 95000 },
        ],
    },

    // ──────────── ポーランド ────────────
    {
        id: 'poland', name: 'ポーランド', country: 'ポーランド', region: 'overseas_europe',
        trip_style: 'overseas_transit', intra_mode: '電車', intra_gap_min: 30,
        themes: ['sg', 'hs', 'wh'],
        areas: [
            { id: 'krakow', name: 'クラクフ' },
            { id: 'warsaw', name: 'ワルシャワ' },
        ],
        spots: [
            { n: 'クラクフ旧市街', d: '中世そのままの世界遺産旧市街', t: '観光', dur: 180, addr: 'クラクフ', area: 'krakow', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ヴァヴェル城', d: 'ポーランド王の世界遺産城', t: '観光', dur: 150, addr: 'クラクフ', area: 'krakow', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ヴィエリチカ岩塩坑', d: '700年の世界遺産塩坑', t: '観光', dur: 180, addr: 'ヴィエリチカ', area: 'krakow', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'アウシュビッツ・ビルケナウ', d: '負の世界遺産', t: '観光', dur: 240, addr: 'オシフィエンチム', area: 'krakow', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ワルシャワ旧市街', d: '戦後復元の世界遺産', t: '観光', dur: 180, addr: 'ワルシャワ', area: 'warsaw', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'ショパン博物館', d: 'ポーランドが生んだ作曲家', t: '観光', dur: 90, addr: 'ワルシャワ', area: 'warsaw', th: ['sg', 'hs', 'ar'], pop: 4 },
            { n: 'ピエロギ（ポーランド餃子）', d: '伝統的家庭料理', t: 'グルメ', dur: 75, addr: '各地', area: 'krakow', th: ['gm', 'hs'], pop: 3 },
        ],
        hotels: [
            { n: 'ホテル・ステファン・バトリ', addr: 'クラクフ', area: 'krakow', price: 28000 },
            { n: 'ラッフルズ・ヨーロピアン・ワルシャワ', addr: 'ワルシャワ', area: 'warsaw', price: 42000 },
        ],
    },

    // ──────────── モンゴル ────────────
    {
        id: 'mongolia', name: 'モンゴル', country: 'モンゴル', region: 'overseas_asia_far',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 60,
        themes: ['nt', 'np', 'ex', 'cp'],
        areas: [
            { id: 'ub', name: 'ウランバートル' },
            { id: 'steppe', name: '草原・ゴビ砂漠' },
        ],
        spots: [
            { n: 'ウランバートル・スフバートル広場', d: 'モンゴルの首都中心', t: '観光', dur: 60, addr: 'ウランバートル', area: 'ub', th: ['sg', 'hs'], pop: 3 },
            { n: 'ガンダン寺', d: 'モンゴル仏教の中心', t: '観光', dur: 90, addr: 'ウランバートル', area: 'ub', th: ['sg', 'hs'], pop: 4 },
            { n: 'チンギスハーン像', d: '世界最大の騎馬像', t: '観光', dur: 90, addr: 'ウランバートル近郊', area: 'ub', th: ['sg', 'hs'], pop: 4 },
            { n: 'テレルジ国立公園', d: '草原と巨大岩のパノラマ', t: '観光', dur: 360, addr: 'テレルジ', area: 'steppe', th: ['np', 'nt', 'cp'], pop: 5 },
            { n: 'ゲル宿泊体験', d: '遊牧民の伝統テント', t: '観光', dur: 480, addr: '草原', area: 'steppe', th: ['ex', 'cp'], pop: 5 },
            { n: 'ゴビ砂漠ツアー', d: '荒涼たる砂漠と恐竜化石', t: '観光', dur: 720, addr: 'ゴビ砂漠', area: 'steppe', th: ['np', 'ex'], pop: 5 },
            { n: '乗馬体験', d: '草原を馬で疾走', t: '観光', dur: 180, addr: '草原', area: 'steppe', th: ['ex', 'fm'], pop: 4 },
        ],
        hotels: [
            { n: 'シャングリラ ウランバートル', addr: 'ウランバートル', area: 'ub', price: 28000 },
            { n: 'テレルジ・ジュルチン・ツーリストキャンプ', addr: 'テレルジ', area: 'steppe', price: 22000 },
        ],
    },
]
