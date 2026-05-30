import type { DestinationEntry } from '../types'

// 海外 アジア近距離: ソウル・釜山・台北・高雄・香港・済州・バンコク・シンガポール

export const OVERSEAS_PART1: DestinationEntry[] = [
    // ソウル
    {
        id: 'seoul', name: 'ソウル', country: '韓国', region: 'overseas_asia_near',
        trip_style: 'overseas_transit', intra_mode: '地下鉄', intra_gap_min: 30,
        themes: ['sg', 'gm', 'sp', 'cp', 'ng'],
        areas: [
            { id: 'myeongdong', name: '明洞' }, { id: 'gangnam', name: '江南' }, { id: 'hongdae', name: '弘大' }, { id: 'gyeongbok', name: '景福宮周辺' },
        ],
        spots: [
            { n: '景福宮', d: '朝鮮王朝の正宮、守門将交代式が見もの', t: '観光', dur: 120, addr: 'ソウル市鍾路区', area: 'gyeongbok', th: ['sg', 'hs'], pop: 5 },
            { n: '北村韓屋村', d: '伝統家屋が立ち並ぶ街並み', t: '観光', dur: 90, addr: 'ソウル市鍾路区', area: 'gyeongbok', th: ['sg', 'hs', 'cp'], pop: 5 },
            { n: '昌徳宮・秘苑', d: '世界遺産の宮殿と秘密の庭園', t: '観光', dur: 120, addr: 'ソウル市鍾路区', area: 'gyeongbok', th: ['sg', 'hs', 'wh'], pop: 4 },
            { n: '明洞', d: 'ソウル一の繁華街・コスメ', t: '観光', dur: 120, addr: 'ソウル市中区', area: 'myeongdong', th: ['sp', 'sg', 'gm'], pop: 5 },
            { n: '南山ソウルタワー', d: 'ソウルの絶景夜景タワー', t: '観光', dur: 90, addr: 'ソウル市龍山区', area: 'myeongdong', th: ['ng', 'cp', 'np'], pop: 5 },
            { n: '弘大エリア', d: '若者文化と夜のクラブ街', t: '観光', dur: 90, addr: 'ソウル市麻浦区', area: 'hongdae', th: ['sg', 'sp', 'ng', 'gm'], pop: 4 },
            { n: '江南エリア', d: '高級ブティックと洗練された街', t: '観光', dur: 120, addr: 'ソウル市江南区', area: 'gangnam', th: ['sp', 'cp'], pop: 4 },
            { n: 'COEXモール 別馬図書館', d: 'インスタ映え巨大本棚', t: '観光', dur: 60, addr: 'ソウル市江南区三成洞', area: 'gangnam', th: ['sg', 'cp'], pop: 4 },
            { n: '東大門デザインプラザ', d: '夜の流線ライトアップ', t: '観光', dur: 90, addr: 'ソウル市中区乙支路', area: 'myeongdong', th: ['ar', 'sg', 'ng'], pop: 4 },
            { n: 'ロッテワールドタワー ソウルスカイ', d: '韓国一の高層展望台', t: '観光', dur: 90, addr: 'ソウル市松坡区新川洞', area: 'gangnam', th: ['np', 'ng', 'cp'], pop: 4 },
            { n: '広蔵市場', d: '伝統市場で韓国屋台グルメ', t: 'グルメ', dur: 90, addr: 'ソウル市鍾路区礼智洞', area: 'gyeongbok', th: ['gm', 'sg'], pop: 5 },
            { n: 'ミシュラン店 鳳雛チムタク', d: '本場のチムタク', t: 'グルメ', dur: 75, addr: 'ソウル市中区明洞', area: 'myeongdong', th: ['gm'], pop: 4 },
            { n: '土俗村', d: '本場の参鶏湯老舗', t: 'グルメ', dur: 75, addr: 'ソウル市鍾路区体府洞', area: 'gyeongbok', th: ['gm', 'hs'], pop: 4 },
            { n: '聖水洞カフェ街', d: 'おしゃれカフェの集積地', t: 'グルメ', dur: 90, addr: 'ソウル市城東区聖水洞', area: 'gangnam', th: ['gm', 'cp', 'sp'], pop: 5 },
            { n: '梨泰院', d: '多国籍料理とナイトライフ', t: 'グルメ', dur: 90, addr: 'ソウル市龍山区梨泰院洞', area: 'myeongdong', th: ['gm', 'ng'], pop: 3 },
        ],
        hotels: [
            { n: 'シグニエルソウル', addr: 'ソウル市松坡区新川洞', area: 'gangnam', price: 65000 },
            { n: 'ロッテホテルソウル', addr: 'ソウル市中区小公洞', area: 'myeongdong', price: 38000 },
            { n: 'JWマリオット東大門スクエアソウル', addr: 'ソウル市鍾路区清渓川路', area: 'myeongdong', price: 32000 },
            { n: 'L7明洞 byロッテ', addr: 'ソウル市中区明洞', area: 'myeongdong', price: 22000 },
        ],
    },

    // 釜山
    {
        id: 'busan', name: '釜山', country: '韓国', region: 'overseas_asia_near',
        trip_style: 'overseas_transit', intra_mode: '地下鉄', intra_gap_min: 30,
        themes: ['sg', 'gm', 'np', 'cp', 'bc'],
        areas: [
            { id: 'haeundae', name: '海雲台' }, { id: 'nampo', name: '南浦洞' }, { id: 'gamcheon', name: '甘川文化村' },
        ],
        spots: [
            { n: '海雲台ビーチ', d: '釜山を代表する1.5kmの白浜', t: '観光', dur: 90, addr: '釜山広域市海雲台区', area: 'haeundae', th: ['bc', 'sg', 'cp'], pop: 5 },
            { n: 'X the SKY', d: '釜山一の高層展望台', t: '観光', dur: 90, addr: '釜山広域市海雲台区', area: 'haeundae', th: ['np', 'cp', 'ng'], pop: 4 },
            { n: 'チャガルチ市場', d: '韓国最大の海産物市場', t: '観光', dur: 90, addr: '釜山広域市中区南浦洞', area: 'nampo', th: ['gm', 'sg'], pop: 5 },
            { n: '甘川文化村', d: 'カラフルな階段集落', t: '観光', dur: 120, addr: '釜山広域市沙下区甘川洞', area: 'gamcheon', th: ['sg', 'cp', 'np', 'ar'], pop: 5 },
            { n: '太宗台', d: '海食崖と灯台の絶景', t: '観光', dur: 90, addr: '釜山広域市影島区東三洞', area: 'haeundae', th: ['np', 'sg'], pop: 4 },
            { n: '釜山タワー', d: '龍頭山公園の展望タワー', t: '観光', dur: 60, addr: '釜山広域市中区光復洞', area: 'nampo', th: ['sg', 'np', 'ng'], pop: 3 },
            { n: 'BIFF広場', d: '釜山国際映画祭の発祥地', t: '観光', dur: 75, addr: '釜山広域市中区南浦洞', area: 'nampo', th: ['sg', 'sp', 'gm'], pop: 3 },
            { n: '梵魚寺', d: '釜山の古刹', t: '観光', dur: 75, addr: '釜山広域市金井区青龍洞', area: 'haeundae', th: ['sg', 'hs'], pop: 3 },
            { n: '海東龍宮寺', d: '海岸線の絶景寺院', t: '観光', dur: 75, addr: '釜山広域市機張郡', area: 'haeundae', th: ['sg', 'hs', 'np'], pop: 4 },
            { n: '広安里ビーチ', d: '広安大橋の夜景が美しい', t: '観光', dur: 60, addr: '釜山広域市水営区広安洞', area: 'haeundae', th: ['bc', 'ng', 'cp'], pop: 4 },
            { n: 'カンジャンケジャン専門店ケジャンガル', d: '本場の蟹のしょうゆ漬け', t: 'グルメ', dur: 75, addr: '釜山広域市中区南浦洞', area: 'nampo', th: ['gm'], pop: 4 },
            { n: 'チャガルチ会(海鮮市場食堂)', d: '新鮮な刺身定食', t: 'グルメ', dur: 90, addr: '釜山広域市中区南浦洞', area: 'nampo', th: ['gm'], pop: 4 },
        ],
        hotels: [
            { n: 'パラダイスホテル釜山', addr: '釜山広域市海雲台区', area: 'haeundae', price: 48000 },
            { n: '釜山シーサイドホテル', addr: '釜山広域市海雲台区', area: 'haeundae', price: 22000 },
            { n: 'ロッテホテル釜山', addr: '釜山広域市釜山鎮区', area: 'nampo', price: 32000 },
        ],
    },

    // 台北
    {
        id: 'taipei', name: '台北', country: '台湾', region: 'overseas_asia_near',
        trip_style: 'overseas_transit', intra_mode: '地下鉄', intra_gap_min: 25,
        themes: ['sg', 'gm', 'sp', 'cp', 'ng'],
        areas: [
            { id: 'taipei101', name: '台北101' }, { id: 'ximending', name: '西門町' }, { id: 'jiufen', name: '九份・近郊' }, { id: 'shilin', name: '士林' },
        ],
        spots: [
            { n: '九份老街', d: '千と千尋の神隠しのモデル夜景', t: '観光', dur: 180, addr: '新北市瑞芳区', area: 'jiufen', th: ['sg', 'np', 'cp', 'ng'], pop: 5 },
            { n: '台北101', d: '508mのランドマークと展望台', t: '観光', dur: 90, addr: '台北市信義区', area: 'taipei101', th: ['sg', 'np', 'cp', 'ng'], pop: 5 },
            { n: '中正紀念堂', d: '台湾の代表的記念建造物', t: '観光', dur: 75, addr: '台北市中正区', area: 'taipei101', th: ['sg', 'hs'], pop: 4 },
            { n: '龍山寺', d: '台北最古の寺院', t: '観光', dur: 60, addr: '台北市萬華区', area: 'ximending', th: ['sg', 'hs'], pop: 4 },
            { n: '西門町', d: '若者文化の中心地', t: '観光', dur: 120, addr: '台北市萬華区', area: 'ximending', th: ['sg', 'sp', 'gm'], pop: 4 },
            { n: '士林夜市', d: '台北最大の夜市', t: 'グルメ', dur: 120, addr: '台北市士林区', area: 'shilin', th: ['gm', 'ng', 'sg'], pop: 5, eveningOk: true },
            { n: '迪化街', d: '伝統的な乾物・漢方の問屋街', t: '観光', dur: 75, addr: '台北市大同区', area: 'ximending', th: ['sg', 'hs', 'sp'], pop: 3 },
            { n: '故宮博物院', d: '中国美術の世界的コレクション', t: '観光', dur: 150, addr: '台北市士林区', area: 'shilin', th: ['sg', 'hs', 'ar'], pop: 4 },
            { n: '十分老街', d: 'ランタン上げ体験で有名', t: '観光', dur: 120, addr: '新北市平渓区', area: 'jiufen', th: ['ex', 'cp', 'sg'], pop: 4 },
            { n: '北投温泉', d: '台北郊外の名湯', t: '観光', dur: 120, addr: '台北市北投区', area: 'shilin', th: ['on', 'cp'], pop: 3 },
            { n: '鼎泰豐 本店', d: '世界的に有名な小籠包', t: 'グルメ', dur: 75, addr: '台北市大安区', area: 'taipei101', th: ['gm'], pop: 5 },
            { n: '阿宗麺線', d: '西門町名物の麺線', t: 'グルメ', dur: 30, addr: '台北市萬華区', area: 'ximending', th: ['gm'], pop: 4 },
            { n: '春水堂', d: 'タピオカミルクティー発祥', t: 'グルメ', dur: 45, addr: '台北市信義区', area: 'taipei101', th: ['gm', 'cp'], pop: 4 },
            { n: '阿妹茶樓', d: '九份の絶景お茶屋', t: 'グルメ', dur: 75, addr: '新北市瑞芳区', area: 'jiufen', th: ['gm', 'cp'], pop: 5 },
        ],
        hotels: [
            { n: 'マンダリンオリエンタル台北', addr: '台北市松山区', area: 'taipei101', price: 58000 },
            { n: 'シャングリラ ファーイースタンプラザホテル台北', addr: '台北市大安区', area: 'taipei101', price: 42000 },
            { n: 'ホテル ロイヤル ニッコー 台北', addr: '台北市中山区', area: 'taipei101', price: 28000 },
        ],
    },

    // 高雄
    {
        id: 'kaohsiung', name: '高雄', country: '台湾', region: 'overseas_asia_near',
        trip_style: 'overseas_transit', intra_mode: '地下鉄', intra_gap_min: 30,
        themes: ['sg', 'gm', 'np', 'ar'],
        areas: [
            { id: 'kaohsiung-c', name: '高雄中心' }, { id: 'lotus', name: '蓮池潭' },
        ],
        spots: [
            { n: '蓮池潭・龍虎塔', d: '高雄を象徴する湖と塔', t: '観光', dur: 90, addr: '高雄市左営区', area: 'lotus', th: ['sg', 'hs', 'np'], pop: 5 },
            { n: '駁二芸術特区', d: '倉庫を再生したアート空間', t: '観光', dur: 120, addr: '高雄市塩埕区', area: 'kaohsiung-c', th: ['ar', 'cp', 'sg'], pop: 4 },
            { n: '六合観光夜市', d: '高雄最大の夜市', t: 'グルメ', dur: 120, addr: '高雄市新興区', area: 'kaohsiung-c', th: ['gm', 'ng'], pop: 5, eveningOk: true },
            { n: '愛河', d: '高雄市内を流れる夜景スポット', t: '観光', dur: 60, addr: '高雄市', area: 'kaohsiung-c', th: ['cp', 'ng', 'np'], pop: 4 },
            { n: '美麗島駅', d: '光のドーム駅構内', t: '観光', dur: 30, addr: '高雄市新興区', area: 'kaohsiung-c', th: ['sg', 'ar'], pop: 4 },
            { n: '高雄85ビル', d: '南台湾の高層展望', t: '観光', dur: 60, addr: '高雄市苓雅区', area: 'kaohsiung-c', th: ['np', 'ng'], pop: 3 },
            { n: '佛光山', d: '巨大仏のある仏教聖地', t: '観光', dur: 180, addr: '高雄市大樹区', area: 'lotus', th: ['sg', 'hs'], pop: 3 },
            { n: '旗津半島', d: 'フェリーで渡れる海辺の島', t: '観光', dur: 180, addr: '高雄市旗津区', area: 'kaohsiung-c', th: ['sg', 'bc', 'gm'], pop: 4 },
            { n: '瑞豐夜市', d: '地元民で賑わう夜市', t: 'グルメ', dur: 90, addr: '高雄市鼓山区', area: 'kaohsiung-c', th: ['gm', 'ng'], pop: 4 },
            { n: '老江紅茶牛奶', d: '高雄名物ミルク紅茶', t: 'グルメ', dur: 30, addr: '高雄市新興区', area: 'kaohsiung-c', th: ['gm'], pop: 3 },
        ],
        hotels: [
            { n: 'グランドハイレジス ホテル高雄', addr: '高雄市左営区', area: 'lotus', price: 28000 },
            { n: 'ハワードプラザホテル高雄', addr: '高雄市苓雅区', area: 'kaohsiung-c', price: 22000 },
        ],
    },

    // 香港
    {
        id: 'hongkong', name: '香港', country: '中国（香港）', region: 'overseas_asia_near',
        trip_style: 'overseas_transit', intra_mode: '地下鉄', intra_gap_min: 25,
        themes: ['sg', 'gm', 'sp', 'ng', 'fm'],
        areas: [
            { id: 'central', name: 'セントラル' }, { id: 'kowloon', name: '九龍' }, { id: 'lantau', name: 'ランタオ・ディズニー' },
        ],
        spots: [
            { n: 'ヴィクトリア・ピーク', d: '香港夜景の代表スポット', t: '観光', dur: 120, addr: '香港島中西区', area: 'central', th: ['np', 'ng', 'cp'], pop: 5 },
            { n: 'スター・フェリー', d: 'ヴィクトリア湾を渡る連絡船', t: '観光', dur: 30, addr: '中環フェリーピア', area: 'central', th: ['sg', 'cp'], pop: 4 },
            { n: 'ネイザンロード（尖沙咀）', d: '九龍のメインショッピングストリート', t: '観光', dur: 120, addr: '九龍尖沙咀', area: 'kowloon', th: ['sp', 'sg', 'gm'], pop: 4 },
            { n: 'シンフォニー・オブ・ライツ', d: '世界最大の光と音のショー', t: '観光', dur: 30, addr: '九龍尖沙咀海浜', area: 'kowloon', th: ['ng', 'cp'], pop: 5, eveningOk: true },
            { n: '黄大仙廟', d: '香港最大の道教寺院', t: '観光', dur: 60, addr: '九龍黄大仙区', area: 'kowloon', th: ['sg', 'hs'], pop: 3 },
            { n: '香港ディズニーランド', d: '世界中の家族に人気', t: '観光', dur: 480, addr: 'ランタオ島', area: 'lantau', th: ['fm', 'cp'], pop: 5, bk: true },
            { n: '天壇大仏（昂坪360）', d: '巨大青銅の仏様とロープウェイ', t: '観光', dur: 180, addr: 'ランタオ島大嶼山', area: 'lantau', th: ['sg', 'hs', 'np'], pop: 4 },
            { n: '女人街', d: '油麻地の活気ある夜市', t: '観光', dur: 75, addr: '九龍油麻地', area: 'kowloon', th: ['sp', 'sg', 'ng'], pop: 4 },
            { n: 'ランカイフォン', d: '香港のナイトライフ拠点', t: '観光', dur: 90, addr: '香港島中環', area: 'central', th: ['ng', 'gm'], pop: 3 },
            { n: 'ハーバーシティ', d: '香港最大のショッピングモール', t: '観光', dur: 180, addr: '九龍尖沙咀広東道', area: 'kowloon', th: ['sp'], pop: 4 },
            { n: '澳門茶餐廳', d: '本場のミルクティーとパイナップルパン', t: 'グルメ', dur: 45, addr: '九龍尖沙咀', area: 'kowloon', th: ['gm'], pop: 4 },
            { n: '一蘭ラーメン 銅鑼湾店', d: '香港の人気とんこつ', t: 'グルメ', dur: 45, addr: '香港島銅鑼湾', area: 'central', th: ['gm'], pop: 3 },
            { n: '糖朝', d: '香港式デザートの名店', t: 'グルメ', dur: 60, addr: '九龍尖沙咀', area: 'kowloon', th: ['gm', 'cp'], pop: 4 },
        ],
        hotels: [
            { n: 'ザ・ペニンシュラ香港', addr: '九龍尖沙咀', area: 'kowloon', price: 85000 },
            { n: 'マンダリン オリエンタル 香港', addr: '香港島中環', area: 'central', price: 78000 },
            { n: 'コーディスホテル香港', addr: '九龍旺角', area: 'kowloon', price: 32000 },
        ],
    },

    // 済州島
    {
        id: 'jeju', name: '済州島', country: '韓国', region: 'overseas_asia_near',
        trip_style: 'rental_car', intra_mode: 'レンタカー', intra_gap_min: 40,
        themes: ['np', 'cp', 'bc', 'sg', 'gm'],
        areas: [
            { id: 'jeju-c', name: '済州市' }, { id: 'seogwipo', name: '西帰浦' },
        ],
        spots: [
            { n: '城山日出峰', d: '世界自然遺産の絶景火山口', t: '観光', dur: 120, addr: '西帰浦市城山邑', area: 'seogwipo', th: ['np', 'wh', 'sg'], pop: 5 },
            { n: 'ハンラ山', d: '韓国最高峰のトレッキング', t: '観光', dur: 240, addr: '済州市', area: 'jeju-c', th: ['nt', 'np', 'ex'], pop: 4 },
            { n: '萬丈窟', d: '世界遺産の長大溶岩洞窟', t: '観光', dur: 90, addr: '済州市朝天邑', area: 'jeju-c', th: ['sg', 'wh', 'fm'], pop: 4 },
            { n: 'テディベアミュージアム', d: '可愛い世界のテディベア', t: '観光', dur: 75, addr: '西帰浦市中文観光団地', area: 'seogwipo', th: ['cp', 'fm'], pop: 3 },
            { n: '天地淵瀑布', d: '神秘的な滝', t: '観光', dur: 60, addr: '西帰浦市天地洞', area: 'seogwipo', th: ['np'], pop: 4 },
            { n: '正房瀑布', d: '海に直接落ちる珍しい滝', t: '観光', dur: 60, addr: '西帰浦市東烘洞', area: 'seogwipo', th: ['np'], pop: 3 },
            { n: '牛島', d: '済州島の隣のサンゴ砂浜', t: '観光', dur: 240, addr: '済州市牛島面', area: 'jeju-c', th: ['bc', 'np', 'cp'], pop: 4 },
            { n: '挾才海水浴場', d: '済州西部のエメラルドビーチ', t: '観光', dur: 90, addr: '済州市翰林邑', area: 'jeju-c', th: ['bc', 'np', 'cp'], pop: 4 },
            { n: 'カメリアヒル', d: '6000本の椿園', t: '観光', dur: 90, addr: '西帰浦市安徳面', area: 'seogwipo', th: ['np', 'cp'], pop: 3 },
            { n: '黒豚通り（済州市）', d: '済州黒豚専門店街', t: 'グルメ', dur: 90, addr: '済州市健入洞', area: 'jeju-c', th: ['gm'], pop: 4 },
            { n: '東門市場', d: '済州の伝統市場', t: 'グルメ', dur: 75, addr: '済州市二徒一洞', area: 'jeju-c', th: ['gm', 'sg'], pop: 4 },
        ],
        hotels: [
            { n: 'グランド ハイアット 済州', addr: '済州市老衡洞', area: 'jeju-c', price: 38000 },
            { n: 'パルナス済州', addr: '西帰浦市中文観光団地', area: 'seogwipo', price: 42000 },
            { n: 'ロッテホテル済州', addr: '西帰浦市色達洞', area: 'seogwipo', price: 35000 },
        ],
    },

    // バンコク
    {
        id: 'bangkok', name: 'バンコク', country: 'タイ', region: 'overseas_asia_far',
        trip_style: 'overseas_transit', intra_mode: '地下鉄', intra_gap_min: 35,
        themes: ['sg', 'gm', 'sp', 'cp', 'hs'],
        areas: [
            { id: 'sukhumvit', name: 'スクンビット' }, { id: 'oldtown', name: '王宮周辺' }, { id: 'chinatown', name: 'チャイナタウン' },
        ],
        spots: [
            { n: 'ワット・ポー', d: '巨大寝釈迦仏のある世界遺産', t: '観光', dur: 90, addr: 'プラナコーン区', area: 'oldtown', th: ['sg', 'hs', 'wh'], pop: 5 },
            { n: 'ワット・アルン', d: '暁の寺・チャオプラヤー川沿い', t: '観光', dur: 90, addr: 'バンコクヤイ区', area: 'oldtown', th: ['sg', 'hs', 'np'], pop: 5 },
            { n: '王宮・エメラルド寺院', d: 'タイ王室の至宝', t: '観光', dur: 120, addr: 'プラナコーン区', area: 'oldtown', th: ['sg', 'hs'], pop: 5 },
            { n: 'チャオプラヤー川クルーズ', d: '水上の絶景', t: '観光', dur: 120, addr: 'バンコク中心', area: 'oldtown', th: ['sg', 'cp', 'ng'], pop: 4 },
            { n: 'カオサン通り', d: 'バックパッカー街と屋台', t: '観光', dur: 90, addr: 'プラナコーン区', area: 'oldtown', th: ['sg', 'gm', 'ng'], pop: 4 },
            { n: 'マハナコン スカイウォーク', d: 'バンコク一の絶景展望', t: '観光', dur: 90, addr: 'バーンラック区', area: 'sukhumvit', th: ['np', 'cp', 'ng'], pop: 4 },
            { n: 'チャトゥチャック市場', d: '世界最大級の週末マーケット', t: '観光', dur: 180, addr: 'チャトゥチャック区', area: 'sukhumvit', th: ['sp', 'sg', 'gm'], pop: 4 },
            { n: 'アジアティーク・ザ・リバーフロント', d: '夜の市場と観覧車', t: '観光', dur: 120, addr: 'バーンコーレム区', area: 'sukhumvit', th: ['sp', 'ng', 'cp'], pop: 4 },
            { n: 'サイアム・スクエア', d: '若者文化と最新トレンド', t: '観光', dur: 120, addr: 'パトゥムワン区', area: 'sukhumvit', th: ['sp', 'sg'], pop: 4 },
            { n: 'ヤワラート（チャイナタウン）', d: 'バンコク中華街の夜の食べ歩き', t: 'グルメ', dur: 90, addr: 'サンパンタウォン区', area: 'chinatown', th: ['gm', 'ng', 'sg'], pop: 4, eveningOk: true },
            { n: 'ジムトンプソンの家', d: 'タイシルク王の博物館', t: '観光', dur: 75, addr: 'パトゥムワン区', area: 'sukhumvit', th: ['sg', 'hs', 'ar'], pop: 3 },
            { n: 'ターチャン市場', d: '本場のソムタムとガパオ', t: 'グルメ', dur: 60, addr: 'プラナコーン区', area: 'oldtown', th: ['gm'], pop: 3 },
            { n: '伝統的タイマッサージ ワット・ポー本院', d: '本場の伝統マッサージ', t: 'その他', dur: 90, addr: 'プラナコーン区', area: 'oldtown', th: ['ex', 'cp'], pop: 4, bk: true },
        ],
        hotels: [
            { n: 'マンダリン オリエンタル バンコク', addr: 'バーンラック区', area: 'sukhumvit', price: 72000 },
            { n: 'ザ・ペニンシュラ バンコク', addr: 'クロンサーン区', area: 'sukhumvit', price: 65000 },
            { n: 'シャングリラ ホテル バンコク', addr: 'バーンラック区', area: 'sukhumvit', price: 48000 },
            { n: 'シェラトン グランデ スクンビット', addr: 'クロントゥーイ区', area: 'sukhumvit', price: 32000 },
        ],
    },

    // シンガポール
    {
        id: 'singapore', name: 'シンガポール', country: 'シンガポール', region: 'overseas_asia_near',
        trip_style: 'overseas_transit', intra_mode: '地下鉄', intra_gap_min: 30,
        themes: ['sg', 'gm', 'fm', 'cp', 'ng'],
        areas: [
            { id: 'marina', name: 'マリーナベイ' }, { id: 'sentosa', name: 'セントーサ' }, { id: 'orchard', name: 'オーチャード' }, { id: 'chinatown', name: 'チャイナタウン' },
        ],
        spots: [
            { n: 'マリーナベイ・サンズ展望台', d: '空中プールで有名な絶景展望', t: '観光', dur: 90, addr: 'マリーナベイ', area: 'marina', th: ['np', 'cp', 'ng'], pop: 5 },
            { n: 'ガーデンズ・バイ・ザ・ベイ', d: '巨大スーパーツリーとライトショー', t: '観光', dur: 180, addr: 'マリーナベイ', area: 'marina', th: ['np', 'cp', 'ng', 'fm'], pop: 5 },
            { n: 'マーライオン公園', d: 'シンガポールのシンボル', t: '観光', dur: 30, addr: 'マリーナベイ', area: 'marina', th: ['sg', 'cp'], pop: 4 },
            { n: 'ユニバーサル・スタジオ・シンガポール', d: '東南アジア初のテーマパーク', t: '観光', dur: 480, addr: 'セントーサ島', area: 'sentosa', th: ['fm', 'cp', 'ex'], pop: 5, bk: true },
            { n: 'シンガポール動物園 ナイトサファリ', d: '世界初の夜行性動物園', t: '観光', dur: 180, addr: 'マンダイレイク', area: 'sentosa', th: ['fm', 'sg'], pop: 5, bk: true },
            { n: 'シンガポール動物園', d: 'オープン展示の動物園', t: '観光', dur: 180, addr: 'マンダイレイク', area: 'sentosa', th: ['fm', 'sg'], pop: 5 },
            { n: 'チャイナタウン', d: '寺院と屋台の文化区域', t: '観光', dur: 90, addr: 'チャイナタウン', area: 'chinatown', th: ['sg', 'gm', 'hs'], pop: 4 },
            { n: 'リトルインディア', d: '色とりどりのインド人街', t: '観光', dur: 90, addr: 'リトルインディア', area: 'chinatown', th: ['sg', 'gm', 'hs'], pop: 4 },
            { n: 'アラブストリート', d: 'スルタンモスク周辺の街並み', t: '観光', dur: 75, addr: 'カンポングラム', area: 'chinatown', th: ['sg', 'hs', 'sp'], pop: 4 },
            { n: 'オーチャードロード', d: 'アジア有数のショッピング街', t: '観光', dur: 150, addr: 'オーチャード', area: 'orchard', th: ['sp', 'gm'], pop: 4 },
            { n: 'クラーク・キー', d: '川沿いのナイトライフ', t: '観光', dur: 90, addr: 'クラーク・キー', area: 'marina', th: ['gm', 'ng', 'cp'], pop: 4 },
            { n: 'ラッフルズホテル ロングバー', d: 'シンガポールスリング発祥', t: 'グルメ', dur: 60, addr: 'シティホール', area: 'marina', th: ['gm', 'cp', 'hs'], pop: 4 },
            { n: 'ホーカーセンター マックスウェル', d: 'チキンライスの聖地', t: 'グルメ', dur: 60, addr: 'チャイナタウン', area: 'chinatown', th: ['gm'], pop: 5 },
            { n: 'ラオパサ・フェスティバルマーケット', d: 'シンガポール屋台のシンボル', t: 'グルメ', dur: 75, addr: 'マリーナベイ', area: 'marina', th: ['gm', 'sg'], pop: 4 },
        ],
        hotels: [
            { n: 'マリーナベイ・サンズ', addr: 'マリーナベイ', area: 'marina', price: 85000 },
            { n: 'ラッフルズ シンガポール', addr: 'シティホール', area: 'marina', price: 95000 },
            { n: 'マンダリン オリエンタル シンガポール', addr: 'マリーナベイ', area: 'marina', price: 65000 },
            { n: 'シャングリラ ホテル シンガポール', addr: 'オーチャード', area: 'orchard', price: 58000 },
        ],
    },
]
