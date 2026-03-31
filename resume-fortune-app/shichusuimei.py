"""
四柱推命（Four Pillars of Destiny）エンジン
本格的な天干地支・十神・通変星・大運計算
"""

from datetime import datetime, timedelta
import math

# 天干（十干）
TENKAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]

# 地支（十二支）
CHISHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]

# 五行
GOGYO = ["木", "火", "土", "金", "水"]

# 天干の五行対応
TENKAN_GOGYO = {
    "甲": "木", "乙": "木",
    "丙": "火", "丁": "火",
    "戊": "土", "己": "土",
    "庚": "金", "辛": "金",
    "壬": "水", "癸": "水",
}

# 天干の陰陽
TENKAN_INYO = {
    "甲": "陽", "乙": "陰",
    "丙": "陽", "丁": "陰",
    "戊": "陽", "己": "陰",
    "庚": "陽", "辛": "陰",
    "壬": "陽", "癸": "陰",
}

# 地支の五行対応
CHISHI_GOGYO = {
    "子": "水", "丑": "土", "寅": "木", "卯": "木",
    "辰": "土", "巳": "火", "午": "火", "未": "土",
    "申": "金", "酉": "金", "戌": "土", "亥": "水",
}

# 地支の陰陽
CHISHI_INYO = {
    "子": "陽", "丑": "陰", "寅": "陽", "卯": "陰",
    "辰": "陽", "巳": "陰", "午": "陽", "未": "陰",
    "申": "陽", "酉": "陰", "戌": "陽", "亥": "陰",
}

# 地支の蔵干（本気・中気・余気）
ZOKAN = {
    "子": {"本気": "癸"},
    "丑": {"本気": "己", "中気": "癸", "余気": "辛"},
    "寅": {"本気": "甲", "中気": "丙", "余気": "戊"},
    "卯": {"本気": "乙"},
    "辰": {"本気": "戊", "中気": "乙", "余気": "癸"},
    "巳": {"本気": "丙", "中気": "庚", "余気": "戊"},
    "午": {"本気": "丁", "中気": "己"},
    "未": {"本気": "己", "中気": "丁", "余気": "乙"},
    "申": {"本気": "庚", "中気": "壬", "余気": "戊"},
    "酉": {"本気": "辛"},
    "戌": {"本気": "戊", "中気": "辛", "余気": "丁"},
    "亥": {"本気": "壬", "中気": "甲"},
}

# 十神の関係テーブル
# 日干から見た他の天干の十神
JUSSHIN_TABLE = {
    # (日干の五行, 相手の五行, 陰陽同異) -> 十神
}

# 五行相生: 木→火→土→金→水→木
# 五行相剋: 木→土→水→火→金→木
SOUSHOU = {"木": "火", "火": "土", "土": "金", "金": "水", "水": "木"}
SOUKOKU = {"木": "土", "土": "水", "水": "火", "火": "金", "金": "木"}
SOUSHOU_REV = {v: k for k, v in SOUSHOU.items()}  # 被生
SOUKOKU_REV = {v: k for k, v in SOUKOKU.items()}  # 被剋


def get_jusshin(nichi_tenkan, target_tenkan):
    """日干から見た対象天干の十神を求める"""
    nichi_gogyo = TENKAN_GOGYO[nichi_tenkan]
    target_gogyo = TENKAN_GOGYO[target_tenkan]
    nichi_inyo = TENKAN_INYO[nichi_tenkan]
    target_inyo = TENKAN_INYO[target_tenkan]
    same_inyo = (nichi_inyo == target_inyo)

    if nichi_gogyo == target_gogyo:
        return "比肩" if same_inyo else "劫財"
    elif SOUSHOU[nichi_gogyo] == target_gogyo:
        return "食神" if same_inyo else "傷官"
    elif SOUKOKU[nichi_gogyo] == target_gogyo:
        return "偏財" if same_inyo else "正財"
    elif SOUSHOU_REV[nichi_gogyo] == target_gogyo:
        return "偏印" if same_inyo else "印綬"
    elif SOUKOKU_REV[nichi_gogyo] == target_gogyo:
        return "偏官" if same_inyo else "正官"
    return "不明"


# 十二運
JUUNIUNSEI = ["長生", "沐浴", "冠帯", "建禄", "帝旺", "衰", "病", "死", "墓", "絶", "胎", "養"]

# 日干から見た十二運の起点（地支インデックス）
JUUNIUNSEI_START = {
    "甲": 11,  # 亥から長生
    "乙": 6,   # 午から長生
    "丙": 2,   # 寅から長生
    "丁": 9,   # 酉から長生
    "戊": 2,   # 寅から長生
    "己": 9,   # 酉から長生
    "庚": 5,   # 巳から長生
    "辛": 0,   # 子から長生
    "壬": 8,   # 申から長生
    "癸": 3,   # 卯から長生
}

# 陽干は順行、陰干は逆行
def get_juuniunsei(nichi_tenkan, chishi):
    """日干と地支から十二運を求める"""
    chishi_idx = CHISHI.index(chishi)
    start = JUUNIUNSEI_START[nichi_tenkan]
    if TENKAN_INYO[nichi_tenkan] == "陽":
        offset = (chishi_idx - start) % 12
    else:
        offset = (start - chishi_idx) % 12
    return JUUNIUNSEI[offset]


# 節入り日テーブル（簡易版 - 各月の節入り日の近似値）
# 実際には年ごとに異なるが、近似的に固定値を使用
SETSUIRI = {
    1: 6,   # 小寒
    2: 4,   # 立春
    3: 6,   # 啓蟄
    4: 5,   # 清明
    5: 6,   # 立夏
    6: 6,   # 芒種
    7: 7,   # 小暑
    8: 8,   # 立秋
    9: 8,   # 白露
    10: 8,  # 寒露
    11: 7,  # 立冬
    12: 7,  # 大雪
}


def get_setsu_month(year, month, day):
    """節入り日を考慮した月を返す（旧暦ベース）"""
    setsu_day = SETSUIRI[month]
    if day < setsu_day:
        # 節入り前なので前月扱い
        if month == 1:
            return 12, year - 1
        return month - 1, year
    return month, year


def calc_year_kanshi(year):
    """年柱の干支を求める"""
    # 甲子年の基準: 1984年が甲子
    idx = (year - 4) % 60
    tenkan = TENKAN[idx % 10]
    chishi = CHISHI[idx % 12]
    return tenkan, chishi


def calc_month_kanshi(year, month, day):
    """月柱の干支を求める（節入り日考慮）"""
    setsu_month, setsu_year = get_setsu_month(year, month, day)

    year_tenkan, _ = calc_year_kanshi(setsu_year)

    # 年干から月干を導出（年干×5の法則）
    year_tenkan_idx = TENKAN.index(year_tenkan)

    # 寅月（旧暦1月=新暦2月頃）を基準とする
    # 立春（2月）が寅月の始まり
    if setsu_month >= 2:
        lunar_month = setsu_month - 1  # 2月→寅(1), 3月→卯(2), ...
    else:
        lunar_month = setsu_month + 11  # 1月→丑(12)

    # 月干の計算: 甲己の年は丙寅から、乙庚の年は戊寅から...
    month_tenkan_base = {
        0: 2,  # 甲・己 → 丙寅始まり
        1: 4,  # 乙・庚 → 戊寅始まり
        2: 6,  # 丙・辛 → 庚寅始まり
        3: 8,  # 丁・壬 → 壬寅始まり
        4: 0,  # 戊・癸 → 甲寅始まり
    }
    base = month_tenkan_base[year_tenkan_idx % 5]
    month_tenkan_idx = (base + lunar_month - 1) % 10
    month_chishi_idx = (lunar_month + 1) % 12  # 寅=2

    tenkan = TENKAN[month_tenkan_idx]
    chishi = CHISHI[month_chishi_idx]
    return tenkan, chishi


def calc_day_kanshi(year, month, day):
    """日柱の干支を求める"""
    # 基準日: 2000年1月7日 = 甲子日
    base_date = datetime(2000, 1, 7)
    target_date = datetime(year, month, day)
    diff = (target_date - base_date).days
    idx = diff % 60
    tenkan = TENKAN[idx % 10]
    chishi = CHISHI[idx % 12]
    return tenkan, chishi


def calc_hour_kanshi(year, month, day, hour=None):
    """時柱の干支を求める（時間不明の場合はNone）"""
    if hour is None:
        return None, None

    day_tenkan, _ = calc_day_kanshi(year, month, day)
    day_tenkan_idx = TENKAN.index(day_tenkan)

    # 時支の決定（2時間ごと）
    hour_chishi_idx = ((hour + 1) // 2) % 12

    # 時干の計算
    hour_tenkan_base = {
        0: 0,  # 甲・己日 → 甲子時始まり
        1: 2,  # 乙・庚日 → 丙子時始まり
        2: 4,  # 丙・辛日 → 戊子時始まり
        3: 6,  # 丁・壬日 → 庚子時始まり
        4: 8,  # 戊・癸日 → 壬子時始まり
    }
    base = hour_tenkan_base[day_tenkan_idx % 5]
    hour_tenkan_idx = (base + hour_chishi_idx) % 10

    tenkan = TENKAN[hour_tenkan_idx]
    chishi = CHISHI[hour_chishi_idx]
    return tenkan, chishi


def calc_tsuhensei(nichi_tenkan, pillars):
    """各柱の通変星を計算"""
    result = {}
    for pillar_name, (tenkan, chishi) in pillars.items():
        if tenkan is None:
            continue
        # 天干の通変星
        tenkan_tsuhen = get_jusshin(nichi_tenkan, tenkan) if tenkan != nichi_tenkan or pillar_name != "日柱" else "（日主）"
        # 地支蔵干の本気から通変星
        zokan_info = ZOKAN.get(chishi, {})
        honki = zokan_info.get("本気", "")
        chishi_tsuhen = get_jusshin(nichi_tenkan, honki) if honki else "不明"

        result[pillar_name] = {
            "天干通変星": tenkan_tsuhen,
            "地支通変星": chishi_tsuhen,
        }
    return result


def calc_daiun(year, month, day, gender):
    """大運を計算する"""
    year_tenkan, _ = calc_year_kanshi(year)
    is_yojun = (TENKAN_INYO[year_tenkan] == "陽" and gender == "男") or \
               (TENKAN_INYO[year_tenkan] == "陰" and gender == "女")

    month_tenkan, month_chishi = calc_month_kanshi(year, month, day)
    month_tenkan_idx = TENKAN.index(month_tenkan)
    month_chishi_idx = CHISHI.index(month_chishi)

    daiun_list = []
    for i in range(1, 9):  # 8つの大運
        if is_yojun:
            t_idx = (month_tenkan_idx + i) % 10
            c_idx = (month_chishi_idx + i) % 12
        else:
            t_idx = (month_tenkan_idx - i) % 10
            c_idx = (month_chishi_idx - i) % 12

        tenkan = TENKAN[t_idx]
        chishi = CHISHI[c_idx]
        start_age = i * 10  # 簡易的に10年ごと
        daiun_list.append({
            "開始年齢": start_age,
            "天干": tenkan,
            "地支": chishi,
            "干支": tenkan + chishi,
            "十二運": get_juuniunsei(calc_day_kanshi(year, month, day)[0], chishi),
        })

    return daiun_list


def get_gogyo_balance(pillars):
    """五行のバランスを計算"""
    balance = {"木": 0, "火": 0, "土": 0, "金": 0, "水": 0}
    for pillar_name, (tenkan, chishi) in pillars.items():
        if tenkan is None:
            continue
        balance[TENKAN_GOGYO[tenkan]] += 1
        balance[CHISHI_GOGYO[chishi]] += 1
        # 蔵干も加算
        zokan = ZOKAN.get(chishi, {})
        for key, kan in zokan.items():
            weight = {"本気": 0.6, "中気": 0.3, "余気": 0.1}.get(key, 0)
            balance[TENKAN_GOGYO[kan]] += weight

    return balance


def get_personality_from_nichi_tenkan(nichi_tenkan):
    """日干から基本的な性格を導出"""
    personalities = {
        "甲": {
            "象意": "大木・樹木",
            "基本性格": "まっすぐで正義感が強い。リーダーシップがあり、向上心旺盛。頑固な一面もあるが、包容力があり人望を集める。困難にも屈せず成長し続ける力を持つ。",
            "長所": "正直、向上心、リーダーシップ、忍耐力",
            "短所": "頑固、融通が利かない、プライドが高い",
        },
        "乙": {
            "象意": "草花・蔓草",
            "基本性格": "柔軟で適応力が高い。穏やかで協調性があり、人間関係を大切にする。芯は強いが表面上は柔らかく、したたかに目標を達成する。美的センスに優れる。",
            "長所": "柔軟性、協調性、粘り強さ、美的センス",
            "短所": "優柔不断、依存的になりやすい、表裏がある",
        },
        "丙": {
            "象意": "太陽",
            "基本性格": "明るく情熱的。エネルギッシュで周囲を照らす存在。行動力があり大胆。広い視野を持ち、スケールの大きな発想ができる。楽観的で人を惹きつけるカリスマ性がある。",
            "長所": "明朗快活、行動力、カリスマ性、大胆さ",
            "短所": "短気、飽きっぽい、大雑把",
        },
        "丁": {
            "象意": "灯火・ろうそくの火",
            "基本性格": "繊細で知的。内面に秘めた情熱を持ち、直感力に優れる。文学・芸術的な才能があり、物事の本質を見抜く力がある。表面は穏やかだが内面は激しい。",
            "長所": "知性、直感力、芸術性、洞察力",
            "短所": "神経質、感情の起伏が激しい、猜疑心",
        },
        "戊": {
            "象意": "山・大地",
            "基本性格": "安定感があり、信頼される存在。包容力が大きく、どっしりとした雰囲気。保守的だが着実に物事を進める力がある。面倒見が良く、人の上に立つ器を持つ。",
            "長所": "安定感、包容力、信頼性、堅実",
            "短所": "保守的、変化を嫌う、鈍重",
        },
        "己": {
            "象意": "田園・畑の土",
            "基本性格": "温かく母性的。実務能力が高く、細やかな気配りができる。控えめだが確実に結果を出す。人を育てる力があり、調整役として活躍する。地道な努力家。",
            "長所": "勤勉、気配り、実務力、育成力",
            "短所": "心配性、自己犠牲的、頑固",
        },
        "庚": {
            "象意": "刀剣・鉱石",
            "基本性格": "意志が強く決断力がある。正義感が強く、義理人情に厚い。行動力があり困難に立ち向かう勇気を持つ。改革者の気質があり、切れ味鋭い判断ができる。",
            "長所": "決断力、正義感、行動力、改革力",
            "短所": "攻撃的、短気、融通が利かない",
        },
        "辛": {
            "象意": "宝石・貴金属",
            "基本性格": "繊細で美意識が高い。プライドが高く、完璧主義的。内面は傷つきやすいが、磨かれることで輝きを増す。独自の価値観を持ち、本物を見極める眼力がある。",
            "長所": "美意識、完璧主義、眼力、上品さ",
            "短所": "神経質、プライドが高い、傷つきやすい",
        },
        "壬": {
            "象意": "大海・大河",
            "基本性格": "スケールが大きく、自由を愛する。知性と行動力を兼ね備え、常に新しいことに挑戦する。包容力があり人を選ばない。発想力が豊かで、多才な人物。",
            "長所": "知性、自由さ、包容力、発想力",
            "短所": "放縦、集中力に欠ける、気まぐれ",
        },
        "癸": {
            "象意": "雨露・清水",
            "基本性格": "繊細で思慮深い。直感力と洞察力に優れ、精神世界への関心が深い。穏やかだが芯は強く、静かな持続力を持つ。学問・研究に向き、知恵者の素質がある。",
            "長所": "知恵、直感力、持続力、精神性",
            "短所": "引っ込み思案、心配性、陰気になりやすい",
        },
    }
    return personalities.get(nichi_tenkan, {})


def get_gogyo_analysis(balance):
    """五行バランスから分析コメントを生成"""
    sorted_gogyo = sorted(balance.items(), key=lambda x: x[1], reverse=True)
    strongest = sorted_gogyo[0]
    weakest = sorted_gogyo[-1]

    gogyo_traits = {
        "木": "成長力・向上心・仁の心",
        "火": "情熱・表現力・礼の心",
        "土": "安定感・信頼性・信の心",
        "金": "決断力・正義感・義の心",
        "水": "知性・柔軟性・智の心",
    }

    analysis = f"最も強い五行は「{strongest[0]}」({gogyo_traits[strongest[0]]})で、"
    analysis += f"最も弱い五行は「{weakest[0]}」({gogyo_traits[weakest[0]]})です。\n"

    if weakest[1] < 0.5:
        analysis += f"「{weakest[0]}」の気が不足しているため、{gogyo_traits[weakest[0]]}を意識的に補うことが開運のポイントです。"

    return analysis


def analyze(year, month, day, gender="不明", hour=None):
    """四柱推命の総合鑑定を行う"""
    # 四柱計算
    nen_tenkan, nen_chishi = calc_year_kanshi(year)
    getsu_tenkan, getsu_chishi = calc_month_kanshi(year, month, day)
    nichi_tenkan, nichi_chishi = calc_day_kanshi(year, month, day)
    ji_tenkan, ji_chishi = calc_hour_kanshi(year, month, day, hour)

    pillars = {
        "年柱": (nen_tenkan, nen_chishi),
        "月柱": (getsu_tenkan, getsu_chishi),
        "日柱": (nichi_tenkan, nichi_chishi),
    }
    if ji_tenkan:
        pillars["時柱"] = (ji_tenkan, ji_chishi)

    # 通変星
    tsuhensei = calc_tsuhensei(nichi_tenkan, pillars)

    # 十二運
    juuniunsei = {}
    for name, (tenkan, chishi) in pillars.items():
        if tenkan:
            juuniunsei[name] = get_juuniunsei(nichi_tenkan, chishi)

    # 五行バランス
    gogyo_balance = get_gogyo_balance(pillars)

    # 大運
    daiun = calc_daiun(year, month, day, gender) if gender in ["男", "女"] else []

    # 蔵干
    zokan_result = {}
    for name, (tenkan, chishi) in pillars.items():
        if chishi:
            zokan_result[name] = ZOKAN.get(chishi, {})

    # 日干の性格
    personality = get_personality_from_nichi_tenkan(nichi_tenkan)

    # 五行分析
    gogyo_analysis = get_gogyo_analysis(gogyo_balance)

    return {
        "四柱": {
            name: {
                "天干": t,
                "地支": c,
                "干支": t + c if t else None,
            }
            for name, (t, c) in pillars.items()
        },
        "日主": nichi_tenkan,
        "日主の五行": TENKAN_GOGYO[nichi_tenkan],
        "日主の陰陽": TENKAN_INYO[nichi_tenkan],
        "通変星": tsuhensei,
        "十二運": juuniunsei,
        "蔵干": zokan_result,
        "五行バランス": {k: round(v, 2) for k, v in gogyo_balance.items()},
        "五行分析": gogyo_analysis,
        "日主の性格": personality,
        "大運": daiun,
    }
