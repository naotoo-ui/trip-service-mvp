import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'

async function main() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { data: data2 } = await supabase
        .from('trips')
        .select('title, destination, duration_days, wishes')
        .eq('is_official', true)
        .or('destination.ilike.%京都%,destination.ilike.%大阪%')
        .limit(10)
    console.log('=== 京都/大阪関連（被りチェック） ===')
    data2?.forEach((t: { title: string; destination: string; duration_days: number; wishes: string }) => console.log(`${t.duration_days}日 | ${t.title}\n  → ${t.destination} | ${t.wishes}\n`))

    const { data: data4 } = await supabase
        .from('trips')
        .select('title, destination, duration_days, wishes')
        .eq('is_official', true)
        .ilike('destination', '%パリ%')
        .limit(10)
    console.log('\n=== パリ関連 ===')
    data4?.forEach((t: { title: string; destination: string; duration_days: number; wishes: string }) => console.log(`${t.duration_days}日 | ${t.title}\n  → ${t.destination} | ${t.wishes}\n`))

    const { data: dataAll } = await supabase
        .from('trips')
        .select('destination')
        .eq('is_official', true)
    const destSet = new Set(dataAll?.map((t: { destination: string }) => t.destination))
    console.log(`\n=== 目的地の種類数: ${destSet.size} ===`)
    Array.from(destSet).sort().forEach(d => console.log(d))
}
main()
