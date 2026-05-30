import type { MultiCountryRoute } from '../types'

// 欧州周遊ルート 10種
// legs.destinationId は overseas-3 の id と一致させる

export const EUROPE_ROUTES: MultiCountryRoute[] = [
    {
        id: 'paris-london', name: 'パリ→ロンドン',
        legs: [
            { destinationId: 'paris', days: 3 },
            { destinationId: 'london', days: 3 },
        ],
        themes: ['sg', 'hs', 'ar', 'cp', 'gm'],
    },
    {
        id: 'london-paris-amsterdam', name: 'ロンドン→パリ→アムステルダム',
        legs: [
            { destinationId: 'london', days: 3 },
            { destinationId: 'paris', days: 3 },
            { destinationId: 'amsterdam', days: 2 },
        ],
        themes: ['sg', 'hs', 'ar', 'wh'],
    },
    {
        id: 'rome-paris', name: 'ローマ→パリ',
        legs: [
            { destinationId: 'rome', days: 3 },
            { destinationId: 'paris', days: 3 },
        ],
        themes: ['sg', 'hs', 'wh', 'ar'],
    },
    {
        id: 'paris-berlin-prague', name: 'パリ→ベルリン→プラハ',
        legs: [
            { destinationId: 'paris', days: 3 },
            { destinationId: 'berlin', days: 2 },
            { destinationId: 'prague', days: 2 },
        ],
        themes: ['sg', 'hs', 'ar'],
    },
    {
        id: 'barcelona-rome', name: 'バルセロナ→ローマ',
        legs: [
            { destinationId: 'barcelona', days: 3 },
            { destinationId: 'rome', days: 3 },
        ],
        themes: ['sg', 'hs', 'wh', 'gm', 'ar'],
    },
    {
        id: 'vienna-prague', name: 'ウィーン→プラハ',
        legs: [
            { destinationId: 'vienna', days: 3 },
            { destinationId: 'prague', days: 3 },
        ],
        themes: ['sg', 'hs', 'wh', 'ar', 'cp'],
    },
    {
        id: 'london-amsterdam', name: 'ロンドン→アムステルダム',
        legs: [
            { destinationId: 'london', days: 3 },
            { destinationId: 'amsterdam', days: 3 },
        ],
        themes: ['sg', 'ar', 'cp'],
    },
    {
        id: 'paris-rome', name: 'パリ→ローマ',
        legs: [
            { destinationId: 'paris', days: 3 },
            { destinationId: 'rome', days: 3 },
        ],
        themes: ['sg', 'hs', 'wh', 'gm', 'cp'],
    },
    {
        id: 'berlin-amsterdam-paris', name: 'ベルリン→アムステルダム→パリ',
        legs: [
            { destinationId: 'berlin', days: 2 },
            { destinationId: 'amsterdam', days: 2 },
            { destinationId: 'paris', days: 3 },
        ],
        themes: ['sg', 'ar', 'hs'],
    },
    {
        id: 'paris-amsterdam-berlin-prague', name: 'パリ→アムステルダム→ベルリン→プラハ',
        legs: [
            { destinationId: 'paris', days: 3 },
            { destinationId: 'amsterdam', days: 2 },
            { destinationId: 'berlin', days: 2 },
            { destinationId: 'prague', days: 2 },
        ],
        themes: ['sg', 'hs', 'ar'],
    },
]
