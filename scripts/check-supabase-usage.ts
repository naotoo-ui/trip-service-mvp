/**
 * Supabase 使用量の概算チェック
 * - trips テーブルの全レコード数
 * - is_official 別の内訳
 * - 平均 JSON サイズから DB 容量を推定
 *
 * 実行: npx ts-node --compiler-options '{"module":"commonjs","esModuleInterop":true,"target":"ES2017"}' scripts/check-supabase-usage.ts
 */
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('env が読み込めません')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function main() {
    console.log('==== Supabase 使用量チェック ====\n')

    // 1) 全件数
    const { count: totalCount, error: e1 } = await supabase
        .from('trips')
        .select('*', { count: 'exact', head: true })
    if (e1) { console.error('count error:', e1.message); return }
    console.log(`📊 trips テーブル総レコード数: ${totalCount?.toLocaleString()} 件`)

    // 2) is_official 別
    const { count: officialCount } = await supabase
        .from('trips')
        .select('*', { count: 'exact', head: true })
        .eq('is_official', true)
    const { count: userCount } = await supabase
        .from('trips')
        .select('*', { count: 'exact', head: true })
        .eq('is_official', false)
    console.log(`   ├─ 公式モデル (is_official=true): ${officialCount?.toLocaleString()} 件`)
    console.log(`   └─ ユーザー作成 (is_official=false): ${userCount?.toLocaleString()} 件\n`)

    // 3) サンプル取得して平均サイズ計測
    const SAMPLE_SIZE = 200
    const { data: officialSample } = await supabase
        .from('trips')
        .select('*')
        .eq('is_official', true)
        .limit(SAMPLE_SIZE)
    const { data: userSample } = await supabase
        .from('trips')
        .select('*')
        .eq('is_official', false)
        .limit(50)

    function avgSize(rows: object[] | null): number {
        if (!rows || rows.length === 0) return 0
        const total = rows.reduce((s, r) => s + Buffer.byteLength(JSON.stringify(r), 'utf8'), 0)
        return total / rows.length
    }

    const officialAvg = avgSize(officialSample)
    const userAvg = avgSize(userSample)
    console.log(`📏 1レコードあたり平均サイズ（JSON ベース概算）`)
    console.log(`   ├─ 公式モデル平均: ${(officialAvg / 1024).toFixed(2)} KB / 件`)
    console.log(`   └─ ユーザー作成平均: ${(userAvg / 1024).toFixed(2)} KB / 件\n`)

    // 4) 推定総サイズ
    const estimatedOfficialBytes = (officialCount ?? 0) * officialAvg
    const estimatedUserBytes = (userCount ?? 0) * userAvg
    const estimatedTotalMB = (estimatedOfficialBytes + estimatedUserBytes) / 1024 / 1024
    console.log(`💾 推定 DB 使用量（trips テーブルのみ）`)
    console.log(`   ├─ 公式モデル: 約 ${(estimatedOfficialBytes / 1024 / 1024).toFixed(2)} MB`)
    console.log(`   ├─ ユーザー作成: 約 ${(estimatedUserBytes / 1024 / 1024).toFixed(2)} MB`)
    console.log(`   └─ 合計: 約 ${estimatedTotalMB.toFixed(2)} MB\n`)

    // 5) 無料枠との比較
    const FREE_DB_MB = 500
    const usagePercent = (estimatedTotalMB / FREE_DB_MB) * 100
    console.log(`🆓 Supabase 無料枠 DB 容量: 500 MB`)
    console.log(`   ├─ 使用率: ${usagePercent.toFixed(2)}%`)
    console.log(`   ├─ 残り: 約 ${(FREE_DB_MB - estimatedTotalMB).toFixed(2)} MB`)
    if (usagePercent < 50) console.log(`   └─ ✅ 余裕あり`)
    else if (usagePercent < 80) console.log(`   └─ ⚠️ 半分以上使用。様子を見て調整推奨`)
    else console.log(`   └─ 🚨 危険レベル。即座に対応必要`)

    console.log('\n📝 注意: 上記は trips テーブルの JSON 概算のみ。')
    console.log('   実際のPostgreSQL DBはインデックス・メタデータ・他テーブルも含むため')
    console.log(`   1.2〜1.5倍程度大きくなります（推定 ${(estimatedTotalMB * 1.3).toFixed(2)} MB 前後）`)
    console.log(`   実値推定: 約 ${(estimatedTotalMB * 1.3).toFixed(2)} MB（30%バッファ込み）`)
}

main().catch(e => { console.error(e); process.exit(1) })
