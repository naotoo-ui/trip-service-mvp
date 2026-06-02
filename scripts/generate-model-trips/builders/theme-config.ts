/**
 * テーマごとに、生成される旅程の「形」を変えるためのパラメータ集
 */
import type { TopTheme } from '../types'

export interface ThemeShape {
    label: string                                  // 表示用
    // 1日に入れたいスポット型のバランス（残り = 観光/その他）
    targetGourmetPerDay: number                    // 食事系の最低件数
    targetGourmetMax: number                       // 食事系の上限
    // テーマ一致スポットの最低割合（合致しない variant はスキップする）
    minThemeShareInDay: number                     // 0.0〜1.0
    minThemeSpotsInDestination: number             // destination 全体で必要なテーマ一致スポット数
    // スコアリング
    themeMatchScore: number                        // テーマ一致時のボーナス
    areaMatchScore: number                         // エリア一致時のボーナス
    popMultiplier: number                          // 人気度の倍率
    // 1日のスポット数調整（中日デフォルトに対する加減）
    middleSpotsDelta: number
    // スポット間の標準的な移動時間（minute）の倍率
    gapMultiplier: number
    // 希望文（wishes）の語彙
    wishesPhrases: string[]
    // テーマ別ラベル語彙
    dayLabelPatterns: string[]
    // タイトル末尾のキャッチフレーズ候補
    titleSuffixes: string[]
}

export const THEME_SHAPES: Record<TopTheme, ThemeShape> = {
    sg: {
        label: '王道観光', targetGourmetPerDay: 1, targetGourmetMax: 2,
        minThemeShareInDay: 0.4, minThemeSpotsInDestination: 5,
        themeMatchScore: 400, areaMatchScore: 100, popMultiplier: 30,
        middleSpotsDelta: 0, gapMultiplier: 1.0,
        wishesPhrases: ['定番の名所を効率よく巡りたい', '初めての訪問なので有名スポット中心', '王道の観光地を制覇したい'],
        dayLabelPatterns: ['{area}の王道スポット', '{area}名所巡り', '{area}観光ハイライト', '{area}主要観光地'],
        titleSuffixes: ['王道観光プラン', '名所巡りモデルコース', '定番観光プラン', 'ハイライト周遊'],
    },
    gm: {
        label: 'グルメ', targetGourmetPerDay: 3, targetGourmetMax: 4,
        minThemeShareInDay: 0.5, minThemeSpotsInDestination: 4,
        themeMatchScore: 500, areaMatchScore: 50, popMultiplier: 25,
        middleSpotsDelta: 0, gapMultiplier: 0.9,
        wishesPhrases: ['ご当地グルメを朝・昼・夜しっかり楽しみたい', '名物料理と市場巡りメインで', '老舗から最新グルメまで食べ歩きたい'],
        dayLabelPatterns: ['{area}名物グルメ満喫', '{area}食べ歩きデー', '{area}グルメ巡り', '{area}市場と老舗グルメ'],
        titleSuffixes: ['ご当地グルメプラン', 'グルメ満喫モデルコース', '食べ歩きプラン', '名物グルメ巡り'],
    },
    np: {
        label: '絶景', targetGourmetPerDay: 1, targetGourmetMax: 2,
        minThemeShareInDay: 0.5, minThemeSpotsInDestination: 4,
        themeMatchScore: 500, areaMatchScore: 80, popMultiplier: 30,
        middleSpotsDelta: -1, gapMultiplier: 1.2,
        wishesPhrases: ['SNS映えする絶景スポットを巡りたい', '展望台や自然の景観を中心に', '写真に残したい美しい景色を狙う'],
        dayLabelPatterns: ['{area}絶景巡り', '{area}フォトスポット', '{area}景観ハイライト', '{area}映えスポット'],
        titleSuffixes: ['絶景巡りプラン', 'フォトスポット周遊', '映えスポットコース', '景観モデルプラン'],
    },
    on: {
        label: '温泉', targetGourmetPerDay: 2, targetGourmetMax: 3,
        minThemeShareInDay: 0.3, minThemeSpotsInDestination: 1,
        themeMatchScore: 500, areaMatchScore: 100, popMultiplier: 25,
        middleSpotsDelta: -1, gapMultiplier: 1.3,
        wishesPhrases: ['名湯にゆっくり浸かって体を癒したい', '温泉宿で過ごす時間を最大化', '湯めぐりと温泉街散策が目的'],
        dayLabelPatterns: ['{area}温泉でくつろぐ', '{area}湯めぐりデー', '{area}温泉街散策', '{area}名湯満喫'],
        titleSuffixes: ['温泉満喫プラン', '湯めぐりモデルコース', '温泉宿プラン', '癒しの温泉旅'],
    },
    hs: {
        label: '歴史・文化', targetGourmetPerDay: 1, targetGourmetMax: 2,
        minThemeShareInDay: 0.5, minThemeSpotsInDestination: 4,
        themeMatchScore: 500, areaMatchScore: 80, popMultiplier: 25,
        middleSpotsDelta: 0, gapMultiplier: 1.0,
        wishesPhrases: ['歴史を感じる寺社・城・遺跡を巡りたい', '日本の伝統文化に触れたい', '世界遺産や国宝を中心に'],
        dayLabelPatterns: ['{area}歴史散策', '{area}世界遺産巡り', '{area}寺社巡り', '{area}伝統文化散策'],
        titleSuffixes: ['歴史散策プラン', '寺社巡りモデルコース', '伝統文化を辿る旅', '世界遺産巡り'],
    },
    cp: {
        label: 'カップル', targetGourmetPerDay: 2, targetGourmetMax: 3,
        minThemeShareInDay: 0.6, minThemeSpotsInDestination: 4,
        themeMatchScore: 500, areaMatchScore: 80, popMultiplier: 30,
        middleSpotsDelta: -1, gapMultiplier: 1.2,
        wishesPhrases: ['ふたりでロマンチックに過ごしたい', 'おしゃれカフェと夜景を中心に', '記念日にもふさわしい特別な場所'],
        dayLabelPatterns: ['{area}デート定番', '{area}ロマンチック散策', '{area}カップルコース', '{area}おしゃれ散歩'],
        titleSuffixes: ['カップルデートプラン', '記念日モデルコース', 'ロマンチック旅', 'ふたり旅プラン'],
    },
    fm: {
        label: '家族', targetGourmetPerDay: 1, targetGourmetMax: 3,
        minThemeShareInDay: 0.5, minThemeSpotsInDestination: 3,
        themeMatchScore: 500, areaMatchScore: 60, popMultiplier: 25,
        middleSpotsDelta: -1, gapMultiplier: 1.3,
        wishesPhrases: ['子供も大人も楽しめる場所', '動物園・水族館・体験型施設を中心に', '家族みんなで楽しみたい'],
        dayLabelPatterns: ['{area}ファミリー定番', '{area}家族で楽しむ', '{area}体験スポット', '{area}こどもと一緒'],
        titleSuffixes: ['家族旅行プラン', 'こども連れモデルコース', 'ファミリー旅', '家族で楽しむプラン'],
    },
    sp: {
        label: 'ショッピング', targetGourmetPerDay: 2, targetGourmetMax: 3,
        minThemeShareInDay: 0.4, minThemeSpotsInDestination: 3,
        themeMatchScore: 450, areaMatchScore: 100, popMultiplier: 20,
        middleSpotsDelta: 0, gapMultiplier: 0.9,
        wishesPhrases: ['ショッピングと街歩きを楽しみたい', '最新トレンドのお店を巡りたい', '土産物と買い物中心の旅'],
        dayLabelPatterns: ['{area}ショッピングデー', '{area}街歩きと買い物', '{area}繁華街散策', '{area}ショップ巡り'],
        titleSuffixes: ['ショッピングプラン', '街歩きモデルコース', '繁華街巡り', 'ショップハント'],
    },
    bc: {
        label: 'ビーチ', targetGourmetPerDay: 1, targetGourmetMax: 2,
        minThemeShareInDay: 0.5, minThemeSpotsInDestination: 2,
        themeMatchScore: 500, areaMatchScore: 100, popMultiplier: 25,
        middleSpotsDelta: -1, gapMultiplier: 1.2,
        wishesPhrases: ['美しいビーチでゆっくり過ごしたい', 'マリンアクティビティも楽しみたい', '南国リゾートの時間を満喫'],
        dayLabelPatterns: ['{area}ビーチデー', '{area}海辺の絶景', '{area}リゾート時間', '{area}マリン体験'],
        titleSuffixes: ['ビーチリゾートプラン', '海辺モデルコース', '南国リゾート旅', 'マリンプラン'],
    },
    wh: {
        label: '世界遺産', targetGourmetPerDay: 1, targetGourmetMax: 2,
        minThemeShareInDay: 0.5, minThemeSpotsInDestination: 3,
        themeMatchScore: 500, areaMatchScore: 80, popMultiplier: 30,
        middleSpotsDelta: 0, gapMultiplier: 1.1,
        wishesPhrases: ['世界遺産を中心に巡りたい', '歴史的価値の高い場所を見学', '一度は行きたい世界の至宝'],
        dayLabelPatterns: ['{area}世界遺産巡り', '{area}歴史遺産散策', '{area}文化遺産巡り', '{area}遺産ハイライト'],
        titleSuffixes: ['世界遺産巡りプラン', '歴史遺産モデルコース', '文化遺産周遊', '至宝の旅'],
    },
    ar: {
        label: 'アート', targetGourmetPerDay: 1, targetGourmetMax: 2,
        minThemeShareInDay: 0.4, minThemeSpotsInDestination: 2,
        themeMatchScore: 500, areaMatchScore: 80, popMultiplier: 25,
        middleSpotsDelta: -1, gapMultiplier: 1.1,
        wishesPhrases: ['美術館とアート建築を中心に巡りたい', '現代アートと美術史を堪能', 'デザイン・建築・写真の名所を狙う'],
        dayLabelPatterns: ['{area}アート巡り', '{area}ミュージアム散策', '{area}美術館巡り', '{area}建築探訪'],
        titleSuffixes: ['アート巡りプラン', 'ミュージアムモデルコース', '美術館周遊', 'アート鑑賞旅'],
    },
    ng: {
        label: '夜景', targetGourmetPerDay: 2, targetGourmetMax: 3,
        minThemeShareInDay: 0.3, minThemeSpotsInDestination: 1,
        themeMatchScore: 500, areaMatchScore: 100, popMultiplier: 25,
        middleSpotsDelta: 0, gapMultiplier: 1.0,
        wishesPhrases: ['夜景スポットと夜の街を楽しみたい', '展望台と夜の食事中心', 'ロマンチックな夜の時間を大切に'],
        dayLabelPatterns: ['{area}夜景スポット', '{area}夜の街歩き', '{area}イルミネーション', '{area}夜のハイライト'],
        titleSuffixes: ['夜景満喫プラン', '夜のモデルコース', 'ナイトツアー', 'ロマンチック夜景旅'],
    },
    nt: {
        label: '自然', targetGourmetPerDay: 1, targetGourmetMax: 2,
        minThemeShareInDay: 0.5, minThemeSpotsInDestination: 3,
        themeMatchScore: 500, areaMatchScore: 80, popMultiplier: 25,
        middleSpotsDelta: -1, gapMultiplier: 1.3,
        wishesPhrases: ['自然の中でリフレッシュしたい', 'トレッキングや森歩きを楽しむ', 'アウトドアと景観を満喫'],
        dayLabelPatterns: ['{area}自然散策', '{area}アウトドア体験', '{area}自然満喫デー', '{area}森と滝の景観'],
        titleSuffixes: ['自然満喫プラン', 'アウトドアモデルコース', '自然散策旅', 'ネイチャーツアー'],
    },
    ex: {
        label: '体験・アクティビティ', targetGourmetPerDay: 1, targetGourmetMax: 2,
        minThemeShareInDay: 0.3, minThemeSpotsInDestination: 1,
        themeMatchScore: 500, areaMatchScore: 60, popMultiplier: 25,
        middleSpotsDelta: -1, gapMultiplier: 1.2,
        wishesPhrases: ['体験型アクティビティで思い出を作りたい', '工芸・スポーツ・自然体験を楽しむ', 'いつもと違う旅を求めている'],
        dayLabelPatterns: ['{area}アクティビティ体験', '{area}体験スポット巡り', '{area}冒険デー', '{area}思い出体験'],
        titleSuffixes: ['アクティビティプラン', '体験型モデルコース', '冒険体験旅', 'アドベンチャープラン'],
    },
}
