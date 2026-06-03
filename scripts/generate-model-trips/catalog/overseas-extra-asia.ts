import type { DestinationEntry } from '../types'

// アジア追加 destination
// アンコール（カンボジア）、ダナン・ホイアン（ベトナム中部）、チェンマイ、コタキナバル等

export const OVERSEAS_EXTRA_ASIA: DestinationEntry[] = [
    // ──────────── アンコールワット（カンボジア） ────────────
    {
        id: 'angkor', name: 'シェムリアップ・アンコール', country: 'カンボジア', region: 'overseas_asia_far',
        trip_style: 'overseas_transit', intra_mode: 'タクシー', intra_gap_min: 30,
        themes: ['sg', 'hs', 'wh', 'ar'],
        areas: [
            { id: 'angkor', name: 'アンコール遺跡群' },
            { id: 'siemreap', name: 'シェムリアップ' },
        ],
        spots: [
            { n: 'アンコールワット', d: 'クメール文明の最高傑作（世界遺産）', t: '観光', dur: 180, addr: 'アンコール', area: 'angkor', th: ['sg', 'hs', 'wh', 'np'], pop: 5 },
            { n: 'アンコールトム・バイヨン寺院', d: '四面仏の謎の遺跡', t: '観光', dur: 150, addr: 'アンコール', area: 'angkor', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'タ・プローム', d: 'ガジュマルに覆われた遺跡', t: '観光', dur: 90, addr: 'アンコール', area: 'angkor', th: ['sg', 'np', 'wh'], pop: 5 },
            { n: 'プレループ（夕日）', d: '夕焼けに染まる遺跡', t: '観光', dur: 90, addr: 'アンコール', area: 'angkor', th: ['np', 'cp', 'sg'], pop: 4 },
            { n: 'バンテアイ・スレイ', d: '東洋のモナリザがある美の遺跡', t: '観光', dur: 90, addr: 'アンコール', area: 'angkor', th: ['ar', 'hs', 'wh'], pop: 4 },
            { n: 'パブ・ストリート', d: 'シェムリアップの繁華街', t: 'グルメ', dur: 90, addr: 'シェムリアップ', area: 'siemreap', th: ['gm', 'ng'], pop: 4 },
            { n: 'ナイト・マーケット', d: 'カンボジア土産と屋台', t: '観光', dur: 75, addr: 'シェムリアップ', area: 'siemreap', th: ['sp', 'gm'], pop: 3 },
            { n: 'トンレサップ湖クルーズ', d: '水上集落の生活風景', t: '観光', dur: 180, addr: '近郊', area: 'siemreap', th: ['sg', 'ex'], pop: 3 },
        ],
        hotels: [
            { n: 'ラッフルズ ホテル ル・ロイヤル', addr: 'シェムリアップ', area: 'siemreap', price: 42000 },
            { n: 'ソフィテル・アンコール・プキートラ ゴルフ＆スパ', addr: 'シェムリアップ', area: 'siemreap', price: 35000 },
            { n: 'ヴィクトリア・アンコール・リゾート', addr: 'シェムリアップ', area: 'siemreap', price: 22000 },
        ],
    },

    // ──────────── ダナン・ホイアン（ベトナム中部） ────────────
    {
        id: 'danang-hoian', name: 'ダナン・ホイアン', country: 'ベトナム', region: 'overseas_asia_far',
        trip_style: 'overseas_transit', intra_mode: 'タクシー', intra_gap_min: 35,
        themes: ['sg', 'gm', 'bc', 'wh', 'cp', 'np'],
        areas: [
            { id: 'danang', name: 'ダナン' },
            { id: 'hoian', name: 'ホイアン' },
            { id: 'bana', name: 'バナヒルズ' },
        ],
        spots: [
            { n: 'ホイアン旧市街', d: 'ランタンの世界遺産古都', t: '観光', dur: 120, addr: 'ホイアン', area: 'hoian', th: ['sg', 'hs', 'wh', 'cp'], pop: 5 },
            { n: 'ホイアン・ナイトマーケット', d: 'ランタンが灯る幻想的な街並み', t: '観光', dur: 90, addr: 'ホイアン', area: 'hoian', th: ['cp', 'ng', 'sg'], pop: 5 },
            { n: '来遠橋', d: 'ホイアンのシンボル日本橋', t: '観光', dur: 30, addr: 'ホイアン', area: 'hoian', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: 'ミーソン聖域', d: 'チャム王国の世界遺産遺跡', t: '観光', dur: 180, addr: '近郊', area: 'hoian', th: ['sg', 'hs', 'wh'], pop: 3 },
            { n: 'バナヒルズ（ゴールデンブリッジ）', d: '巨大な手に支えられた橋', t: '観光', dur: 240, addr: 'バナヒルズ', area: 'bana', th: ['sg', 'np', 'cp', 'fm'], pop: 5, bk: true },
            { n: 'ミーケービーチ', d: 'ダナンの白浜リゾート', t: '観光', dur: 120, addr: 'ダナン', area: 'danang', th: ['bc', 'cp'], pop: 4 },
            { n: '五行山（マーブルマウンテン）', d: '大理石の山と石仏', t: '観光', dur: 90, addr: 'ダナン', area: 'danang', th: ['sg', 'hs'], pop: 3 },
            { n: 'ドラゴンブリッジ', d: 'ダナンのシンボル龍の橋', t: '観光', dur: 30, addr: 'ダナン', area: 'danang', th: ['sg', 'ng'], pop: 3 },
            { n: 'ホイアン名物カオラウ', d: 'ホイアン独自の麺料理', t: 'グルメ', dur: 45, addr: 'ホイアン', area: 'hoian', th: ['gm', 'hs'], pop: 4 },
        ],
        hotels: [
            { n: 'フォーシーズンズ ザ・ナム・ハイ', addr: 'ホイアン', area: 'hoian', price: 75000 },
            { n: 'インターコンチネンタル ダナン・サン・ペニンシュラ・リゾート', addr: 'ダナン', area: 'danang', price: 58000 },
            { n: 'アナンタラ・ホイアン・リゾート', addr: 'ホイアン', area: 'hoian', price: 42000 },
        ],
    },

    // ──────────── チェンマイ ────────────
    {
        id: 'chiangmai', name: 'チェンマイ', country: 'タイ', region: 'overseas_asia_far',
        trip_style: 'overseas_transit', intra_mode: 'タクシー', intra_gap_min: 30,
        themes: ['sg', 'hs', 'gm', 'cp', 'ex'],
        areas: [
            { id: 'oldcity', name: '旧市街' },
            { id: 'doi-suthep', name: 'ドイステープ周辺' },
        ],
        spots: [
            { n: 'ワット・プラタート・ドイ・ステープ', d: 'チェンマイのシンボル寺院', t: '観光', dur: 90, addr: 'ドイステープ', area: 'doi-suthep', th: ['sg', 'hs', 'np'], pop: 5 },
            { n: 'ワット・チェディ・ルアン', d: '旧市街の崩れかけの大仏塔', t: '観光', dur: 60, addr: '旧市街', area: 'oldcity', th: ['sg', 'hs'], pop: 4 },
            { n: 'ワット・プラ・シン', d: '旧市街の中心寺院', t: '観光', dur: 60, addr: '旧市街', area: 'oldcity', th: ['sg', 'hs'], pop: 4 },
            { n: 'サンデーマーケット', d: '日曜夜の歩行者天国', t: '観光', dur: 120, addr: '旧市街', area: 'oldcity', th: ['sg', 'sp', 'gm', 'ng'], pop: 5 },
            { n: 'チェンマイ・ナイトバザール', d: '毎晩開催の屋台市場', t: '観光', dur: 90, addr: 'チャンクラン', area: 'oldcity', th: ['sg', 'sp', 'gm'], pop: 4 },
            { n: '象使い体験', d: 'エレファントキャンプ', t: '観光', dur: 240, addr: '郊外', area: 'doi-suthep', th: ['ex', 'fm'], pop: 4, bk: true },
            { n: 'カオソーイ・クンヤイ', d: 'チェンマイ名物カオソーイ', t: 'グルメ', dur: 45, addr: '旧市街', area: 'oldcity', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: '137 ピラーズ ハウス チェンマイ', addr: '中心部', area: 'oldcity', price: 38000 },
            { n: 'フォーシーズンズ チェンマイ', addr: '郊外', area: 'doi-suthep', price: 72000 },
            { n: 'ル・メリディアン・チェンマイ', addr: '中心部', area: 'oldcity', price: 22000 },
        ],
    },

    // ──────────── 済州島 強化 ────────────
    // 既存に jeju あり、追加なし
]
