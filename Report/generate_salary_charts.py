#!/usr/bin/env python3
"""
2026年春闘 新卒初任給 分布図生成スクリプト
"""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import numpy as np
import os

# --- フォント設定 ---
# 日本語フォントを探す
jp_fonts = [f.name for f in fm.fontManager.ttflist
            if any(k in f.name.lower() for k in ['gothic', 'noto sans cjk', 'ipag', 'ipaex', 'takao', 'meiryo', 'yu gothic'])]

if jp_fonts:
    plt.rcParams['font.family'] = jp_fonts[0]
else:
    # フォントファイルを直接探す
    font_paths = []
    for d in ['/usr/share/fonts', '/usr/local/share/fonts', os.path.expanduser('~/.fonts')]:
        if os.path.isdir(d):
            for root, dirs, files in os.walk(d):
                for f in files:
                    if f.endswith(('.ttf', '.otf')):
                        font_paths.append(os.path.join(root, f))
    cjk = [p for p in font_paths if any(k in p.lower() for k in ['gothic', 'cjk', 'ipa', 'noto', 'takao'])]
    if cjk:
        prop = fm.FontProperties(fname=cjk[0])
        plt.rcParams['font.family'] = prop.get_name()

plt.rcParams['axes.unicode_minus'] = False

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

# ====================================================================
# 図1: グループ別 初任給比較（棒グラフ）
# ====================================================================
def chart1_group_comparison():
    fig, ax = plt.subplots(figsize=(12, 7))

    groups = [
        'Prime\n(Top-tier Listed)',
        'Standard\n(Mid-tier Listed)',
        'Growth\n(Emerging Listed)',
        'SMEs\n(Non-listed)',
        'Startups\n/ Ventures'
    ]
    # 平均値（万円）
    avg_low  = [25.5, 22.0, 23.0, 22.2, 25.0]
    avg_high = [26.5, 23.5, 28.0, 22.2, 28.0]
    avg_mid  = [(l+h)/2 for l, h in zip(avg_low, avg_high)]
    avg_err_low  = [m - l for m, l in zip(avg_mid, avg_low)]
    avg_err_high = [h - m for h, m in zip(avg_high, avg_mid)]

    # 中央値（万円）
    med_low  = [25.0, 21.5, 23.0, 21.5, 25.0]
    med_high = [25.0, 23.0, 25.0, 22.0, 25.0]
    med_mid  = [(l+h)/2 for l, h in zip(med_low, med_high)]

    x = np.arange(len(groups))
    width = 0.35

    bars1 = ax.bar(x - width/2, avg_mid, width, label='Average (est.)',
                   color='#4472C4', alpha=0.85,
                   yerr=[avg_err_low, avg_err_high], capsize=5, error_kw={'color': '#2F5496'})
    bars2 = ax.bar(x + width/2, med_mid, width, label='Median (est.)',
                   color='#ED7D31', alpha=0.85)

    ax.set_ylabel('Starting Salary (10K JPY / month)', fontsize=12)
    ax.set_title('2026 Shunto: New Graduate Starting Salary by Group\n'
                 '2026\u5e74\u6625\u95d8 \u30b0\u30eb\u30fc\u30d7\u5225 \u65b0\u5352\u521d\u4efb\u7d66\u6bd4\u8f03',
                 fontsize=14, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(groups, fontsize=10)
    ax.set_ylim(18, 30)
    ax.legend(fontsize=11)
    ax.grid(axis='y', alpha=0.3)

    # 値ラベル
    for bar in bars1:
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.15,
                f'{bar.get_height():.1f}', ha='center', va='bottom', fontsize=9, color='#2F5496')
    for bar in bars2:
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.15,
                f'{bar.get_height():.1f}', ha='center', va='bottom', fontsize=9, color='#C45911')

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'chart1_group_comparison.png')
    fig.savefig(path, dpi=150, bbox_inches='tight')
    plt.close(fig)
    print(f'Saved: {path}')


# ====================================================================
# 図2: 業種別 初任給比較（横棒グラフ）
# ====================================================================
def chart2_industry():
    fig, ax = plt.subplots(figsize=(12, 8))

    industries = [
        'Consulting / Think Tank',
        'Pharma / Medical / Bio',
        'Trading / Wholesale',
        'IT / Web / Telecom',
        'Finance / Insurance',
        'Construction / Real Estate',
        'Manufacturing',
        'Retail / Service',
        'Hotel / Food Service',
    ]
    # 令和6年賃構調査 + マイナビ/HRog 26卒データを総合（万円）
    values = [27.3, 22.5, 22.4, 23.1, 25.0, 21.9, 21.5, 20.5, 19.3]

    colors = ['#4472C4' if v >= 23 else '#A5A5A5' if v >= 21 else '#ED7D31' for v in values]

    y_pos = np.arange(len(industries))
    bars = ax.barh(y_pos, values, color=colors, alpha=0.85, height=0.6)

    ax.set_yticks(y_pos)
    ax.set_yticklabels(industries, fontsize=10)
    ax.set_xlabel('Starting Salary (10K JPY / month)', fontsize=12)
    ax.set_title('2026 Starting Salary by Industry (University Graduates)\n'
                 '2026\u5e74 \u696d\u7a2e\u5225 \u5927\u5352\u521d\u4efb\u7d66',
                 fontsize=14, fontweight='bold')
    ax.set_xlim(17, 29)
    ax.invert_yaxis()
    ax.grid(axis='x', alpha=0.3)

    # 平均線
    overall_avg = 22.6
    ax.axvline(x=overall_avg, color='red', linestyle='--', linewidth=1.5, label=f'Overall Avg: {overall_avg}')
    ax.legend(fontsize=10, loc='lower right')

    for bar, val in zip(bars, values):
        ax.text(val + 0.15, bar.get_y() + bar.get_height()/2,
                f'{val:.1f}', va='center', fontsize=10, fontweight='bold')

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'chart2_industry.png')
    fig.savefig(path, dpi=150, bbox_inches='tight')
    plt.close(fig)
    print(f'Saved: {path}')


# ====================================================================
# 図3: 企業規模別 初任給分布（帝国DB + 厚労省データ）
# ====================================================================
def chart3_size_distribution():
    fig, axes = plt.subplots(1, 2, figsize=(14, 6))

    # --- 左: 金額帯分布 ---
    ax = axes[0]
    categories = ['<20', '20-25', '25-30', '30+']
    # 帝国DB 2026年度データ（全体 / 大企業 / 中小企業）
    all_pct  = [17.4, 61.7, 17.8, 3.1]
    large_pct = [10, 60, 22, 8]   # 大企業: 25万以上=30%
    sme_pct   = [22, 61, 14, 3]   # 中小: 25万以上=17%

    x = np.arange(len(categories))
    w = 0.25

    ax.bar(x - w, all_pct, w, label='All Companies', color='#4472C4', alpha=0.85)
    ax.bar(x, large_pct, w, label='Large Corp (1000+)', color='#70AD47', alpha=0.85)
    ax.bar(x + w, sme_pct, w, label='SMEs (<300)', color='#ED7D31', alpha=0.85)

    ax.set_xticks(x)
    ax.set_xticklabels([f'{c}\n(10K JPY)' for c in categories], fontsize=10)
    ax.set_ylabel('% of Companies', fontsize=11)
    ax.set_title('Starting Salary Distribution\nby Company Size (2026)',
                 fontsize=12, fontweight='bold')
    ax.legend(fontsize=9)
    ax.grid(axis='y', alpha=0.3)

    # --- 右: 規模別平均 ---
    ax2 = axes[1]
    sizes = ['Large\n(1000+)', 'Medium\n(300-999)', 'Small\n(100-299)', 'Micro\n(<100)']
    # 産労総研 2024年度 + 厚労省令和6年データ + 2026年推定
    avg_2024 = [24.1, 22.9, 21.8, 21.0]
    avg_2026_est = [26.0, 24.2, 23.0, 22.0]

    x2 = np.arange(len(sizes))
    w2 = 0.35

    bars_24 = ax2.bar(x2 - w2/2, avg_2024, w2, label='FY2024 (Actual)', color='#A5A5A5', alpha=0.7)
    bars_26 = ax2.bar(x2 + w2/2, avg_2026_est, w2, label='FY2026 (Est.)', color='#4472C4', alpha=0.85)

    ax2.set_xticks(x2)
    ax2.set_xticklabels(sizes, fontsize=10)
    ax2.set_ylabel('10K JPY / month', fontsize=11)
    ax2.set_title('Avg Starting Salary by Size\n(FY2024 vs FY2026 Est.)',
                  fontsize=12, fontweight='bold')
    ax2.set_ylim(18, 28)
    ax2.legend(fontsize=9)
    ax2.grid(axis='y', alpha=0.3)

    for bar in bars_26:
        ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.15,
                 f'{bar.get_height():.1f}', ha='center', va='bottom', fontsize=9, fontweight='bold')

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'chart3_size_distribution.png')
    fig.savefig(path, dpi=150, bbox_inches='tight')
    plt.close(fig)
    print(f'Saved: {path}')


# ====================================================================
# 図4: 各グループの最大値・最小値・平均・中央値（箱ひげ風）
# ====================================================================
def chart4_range_boxplot():
    fig, ax = plt.subplots(figsize=(12, 7))

    groups = ['Prime', 'Standard', 'Growth', 'SMEs', 'Startups']

    # [min, Q1(est), median, Q3(est), max] 万円
    data = {
        'Prime':     [22.0, 24.0, 25.5, 30.0, 42.5],
        'Standard':  [19.5, 21.0, 22.5, 24.0, 31.5],
        'Growth':    [20.0, 22.0, 24.0, 28.0, 59.2],
        'SMEs':      [18.0, 20.0, 21.5, 23.0, 28.0],
        'Startups':  [20.0, 23.0, 25.0, 30.0, 50.0],
    }

    positions = np.arange(1, len(groups) + 1)
    colors = ['#4472C4', '#70AD47', '#FFC000', '#ED7D31', '#7030A0']

    bp_data = [data[g] for g in groups]

    # 手動で箱ひげ図を描画
    for i, (g, color) in enumerate(zip(groups, colors)):
        d = data[g]
        pos = i + 1
        mn, q1, med, q3, mx = d

        # 箱
        box_width = 0.4
        rect = plt.Rectangle((pos - box_width/2, q1), box_width, q3 - q1,
                              facecolor=color, alpha=0.3, edgecolor=color, linewidth=2)
        ax.add_patch(rect)

        # 中央値
        ax.plot([pos - box_width/2, pos + box_width/2], [med, med],
                color=color, linewidth=3)

        # ひげ
        ax.plot([pos, pos], [mn, q1], color=color, linewidth=1.5)
        ax.plot([pos, pos], [q3, mx], color=color, linewidth=1.5)
        ax.plot([pos - 0.15, pos + 0.15], [mn, mn], color=color, linewidth=2)
        ax.plot([pos - 0.15, pos + 0.15], [mx, mx], color=color, linewidth=2)

        # ラベル
        ax.text(pos + 0.3, mx, f'Max: {mx}', fontsize=8, va='center', color=color)
        ax.text(pos + 0.3, mn, f'Min: {mn}', fontsize=8, va='center', color=color)
        ax.text(pos + 0.3, med, f'Med: {med}', fontsize=8, va='center', color=color, fontweight='bold')

    ax.set_xticks(positions)
    ax.set_xticklabels(groups, fontsize=11)
    ax.set_ylabel('Starting Salary (10K JPY / month)', fontsize=12)
    ax.set_title('2026 Starting Salary Range by Group (Min / Q1 / Median / Q3 / Max)\n'
                 '2026\u5e74 \u30b0\u30eb\u30fc\u30d7\u5225 \u521d\u4efb\u7d66\u30ec\u30f3\u30b8',
                 fontsize=14, fontweight='bold')
    ax.set_ylim(15, 62)
    ax.grid(axis='y', alpha=0.3)

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'chart4_range_boxplot.png')
    fig.savefig(path, dpi=150, bbox_inches='tight')
    plt.close(fig)
    print(f'Saved: {path}')


# ====================================================================
# 図5: 初任給30万円以上企業の業種分布（ドーナツチャート）
# ====================================================================
def chart5_30man_pie():
    fig, ax = plt.subplots(figsize=(9, 9))

    labels = ['Finance /\nInsurance', 'Trading /\nWholesale', 'IT / Tech',
              'Pharma /\nMedical', 'Real Estate /\nConstruction',
              'Retail /\nConsumer', 'Other']
    sizes = [5, 3, 4, 3, 3, 3, 2]
    colors = ['#4472C4', '#ED7D31', '#70AD47', '#FFC000', '#5B9BD5', '#A5A5A5', '#636363']
    explode = [0.05] * len(sizes)

    wedges, texts, autotexts = ax.pie(
        sizes, explode=explode, labels=labels, colors=colors,
        autopct='%1.0f%%', pctdistance=0.8,
        startangle=90, textprops={'fontsize': 10}
    )

    # ドーナツ化
    centre_circle = plt.Circle((0, 0), 0.55, fc='white')
    ax.add_artist(centre_circle)

    ax.text(0, 0, '30+\nCompanies\n(23 firms)', ha='center', va='center',
            fontsize=14, fontweight='bold')
    ax.set_title('Industry Distribution of Companies\nwith Starting Salary >= 30 (10K JPY)\n'
                 '\u521d\u4efb\u7d6630\u4e07\u5186\u4ee5\u4e0a\u4f01\u696d\u306e\u696d\u7a2e\u5206\u5e03',
                 fontsize=13, fontweight='bold')

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'chart5_30man_pie.png')
    fig.savefig(path, dpi=150, bbox_inches='tight')
    plt.close(fig)
    print(f'Saved: {path}')


# ====================================================================
# 図6: 初任給の推移トレンド（2020-2026）
# ====================================================================
def chart6_trend():
    fig, ax = plt.subplots(figsize=(12, 6))

    years = [2020, 2021, 2022, 2023, 2024, 2025, 2026]

    # 大企業 (厚労省 + 産労総研 + 労務行政研究所)
    large = [21.3, 21.1, 21.5, 22.8, 24.1, 25.5, 26.2]
    # 中小企業
    sme   = [20.2, 20.0, 20.2, 20.8, 21.8, 22.0, 22.2]
    # スタートアップ (推定)
    startup = [22.0, 22.5, 23.0, 24.0, 25.0, 26.0, 26.5]

    ax.plot(years, large, 'o-', color='#4472C4', linewidth=2.5, markersize=8, label='Large Corp (Prime)')
    ax.plot(years, sme, 's-', color='#ED7D31', linewidth=2.5, markersize=8, label='SMEs')
    ax.plot(years, startup, '^-', color='#70AD47', linewidth=2.5, markersize=8, label='Startups (est.)')

    # 2026は推定値
    ax.axvline(x=2025.5, color='gray', linestyle=':', alpha=0.5)
    ax.text(2025.6, 19.5, 'Est.', fontsize=9, color='gray', style='italic')

    for yr, v in zip(years, large):
        ax.text(yr, v + 0.2, f'{v:.1f}', ha='center', fontsize=8, color='#2F5496')
    for yr, v in zip(years, sme):
        ax.text(yr, v - 0.5, f'{v:.1f}', ha='center', fontsize=8, color='#C45911')

    ax.set_xlabel('Year', fontsize=12)
    ax.set_ylabel('Starting Salary (10K JPY / month)', fontsize=12)
    ax.set_title('Starting Salary Trend (2020-2026)\n'
                 '\u5927\u5352\u521d\u4efb\u7d66\u306e\u63a8\u79fb (2020-2026)',
                 fontsize=14, fontweight='bold')
    ax.set_xticks(years)
    ax.set_ylim(18, 28)
    ax.legend(fontsize=11)
    ax.grid(alpha=0.3)

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, 'chart6_trend.png')
    fig.savefig(path, dpi=150, bbox_inches='tight')
    plt.close(fig)
    print(f'Saved: {path}')


# ====================================================================
# メイン
# ====================================================================
if __name__ == '__main__':
    print('Generating charts...')
    chart1_group_comparison()
    chart2_industry()
    chart3_size_distribution()
    chart4_range_boxplot()
    chart5_30man_pie()
    chart6_trend()
    print('All charts generated successfully.')
