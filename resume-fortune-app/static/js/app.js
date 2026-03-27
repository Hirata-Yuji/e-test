document.addEventListener("DOMContentLoaded", () => {
    const dropArea = document.getElementById("drop-area");
    const pdfInput = document.getElementById("pdf-input");
    const fileName = document.getElementById("file-name");
    const submitBtn = document.getElementById("submit-btn");
    const form = document.getElementById("upload-form");
    const loading = document.getElementById("loading");
    const loadingText = document.getElementById("loading-text");
    const error = document.getElementById("error");
    const errorMessage = document.getElementById("error-message");
    const results = document.getElementById("results");

    let selectedFile = null;

    // ドラッグ＆ドロップ
    dropArea.addEventListener("click", () => pdfInput.click());
    dropArea.addEventListener("dragover", (e) => { e.preventDefault(); dropArea.classList.add("dragover"); });
    dropArea.addEventListener("dragleave", () => dropArea.classList.remove("dragover"));
    dropArea.addEventListener("drop", (e) => {
        e.preventDefault();
        dropArea.classList.remove("dragover");
        if (e.dataTransfer.files.length > 0 && e.dataTransfer.files[0].type === "application/pdf") {
            selectedFile = e.dataTransfer.files[0];
            fileName.textContent = selectedFile.name;
        }
    });
    pdfInput.addEventListener("change", () => {
        if (pdfInput.files.length > 0) {
            selectedFile = pdfInput.files[0];
            fileName.textContent = selectedFile.name;
        }
    });

    // タブ
    document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
        });
    });

    // フォーム送信
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const birthdate = document.getElementById("birthdate").value;
        if (!birthdate) {
            alert("生年月日を入力してください。");
            return;
        }

        loading.style.display = "block";
        loadingText.textContent = "四柱推命・九星気学を計算中...";
        error.style.display = "none";
        results.style.display = "none";
        submitBtn.disabled = true;

        try {
            // ステップ1: サーバーで四柱推命・九星気学を計算（即座に返る）
            const formData = new FormData();
            formData.append("birthdate", birthdate);
            formData.append("gender", document.getElementById("gender").value);

            const response = await fetch("/analyze", { method: "POST", body: formData });
            const contentType = response.headers.get("content-type") || "";
            if (!contentType.includes("application/json")) {
                throw new Error("サーバーエラーが発生しました。");
            }
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            // 四柱推命・九星気学の結果を表示
            loading.style.display = "none";
            results.style.display = "block";

            document.getElementById("result-meta").innerHTML =
                `<strong>${data.birthdate}</strong> 生まれ（${data.gender}）`;

            renderPillars(data.shichusuimei);
            renderPersonality(data.shichusuimei);
            renderGogyoBalance(data.shichusuimei);
            renderTsuhensei(data.shichusuimei);
            renderDaiun(data.shichusuimei);
            renderKyusei(data.kyusei);

            // ステップ2: Claude APIで人相学+総合鑑定（ブラウザから直接）
            document.getElementById("combined-result").innerHTML = '<p style="color:var(--accent);">AI総合鑑定を実行中... しばらくお待ちください</p>';
            document.getElementById("face-result").innerHTML = '<p style="color:var(--accent);">AI人相学鑑定を実行中... しばらくお待ちください</p>';

            if (API_KEY) {
                callClaudeAPI(data, selectedFile);
            } else {
                document.getElementById("combined-result").innerHTML = '<p>APIキーが設定されていないため、AI鑑定は利用できません。四柱推命・九星気学の結果をご覧ください。</p>';
                document.getElementById("face-result").innerHTML = '<p>APIキーが設定されていないため、人相学鑑定は利用できません。</p>';
            }

            results.scrollIntoView({ behavior: "smooth" });

        } catch (err) {
            loading.style.display = "none";
            error.style.display = "block";
            errorMessage.textContent = err.message;
        } finally {
            submitBtn.disabled = false;
        }
    });

    async function callClaudeAPI(fortuneData, pdfFile) {
        const s = fortuneData.shichusuimei;
        const k = fortuneData.kyusei;

        const fortuneContext = `## 四柱推命の鑑定結果
- 日主: ${s["日主"]}（${s["日主の五行"]}・${s["日主の陰陽"]}）
- 性格: ${JSON.stringify(s["日主の性格"])}
- 五行バランス: ${JSON.stringify(s["五行バランス"])}
- 通変星: ${JSON.stringify(s["通変星"])}
- 十二運: ${JSON.stringify(s["十二運"])}

## 九星気学の鑑定結果
- 本命星: ${k["本命星"]}
- 月命星: ${k["月命星"]}
- 日命星: ${k["日命星"]}`;

        const messages_content = [];

        // PDFがあればdocumentとして添付
        if (pdfFile) {
            const pdfBase64 = await fileToBase64(pdfFile);
            messages_content.push({
                type: "document",
                source: { type: "base64", media_type: "application/pdf", data: pdfBase64 },
            });
        }

        messages_content.push({
            type: "text",
            text: `あなたは東洋占術（四柱推命・九星気学・人相学）の総合鑑定師です。
${pdfFile ? "提供された履歴書PDFと" : ""}以下の占術データを元に鑑定してください。

${fortuneContext}

---

【セクション1: 人相学鑑定】
${pdfFile ? "履歴書の顔写真から人相学に基づいた鑑定を行ってください。" : "PDFが提供されていないため、四柱推命・九星気学の結果から推測される人相の傾向を述べてください。"}
以下のJSON形式で出力してください：

\`\`\`json
{
    "顔の輪郭分析": "...",
    "目と眉の分析": "...",
    "鼻と口の分析": "...",
    "全体的な印象": "...",
    "仕事適性": "...",
    "対人関係": "...",
    "運勢アドバイス": "...",
    "総合鑑定": "..."
}
\`\`\`

【セクション2: 総合人物鑑定】
四柱推命・九星気学${pdfFile ? "・人相学" : ""}を統合した総合鑑定文を作成してください：
1. この人物の本質
2. 性格の多面性
3. 仕事・適職
4. 対人関係
5. 強みと課題
6. 開運アドバイス
7. 採用担当者へのコメント

※エンターテイメント鑑定である旨を付記してください。

必ず「===SECTION1===」と「===SECTION2===」で区切ってください。`,
        });

        try {
            const apiResponse = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                    "anthropic-version": "2023-06-01",
                    "anthropic-dangerous-direct-browser-access": "true",
                },
                body: JSON.stringify({
                    model: "claude-sonnet-4-6",
                    max_tokens: 4000,
                    messages: [{ role: "user", content: messages_content }],
                }),
            });

            const apiData = await apiResponse.json();

            if (apiData.error) {
                throw new Error(apiData.error.message || JSON.stringify(apiData.error));
            }

            const resultText = apiData.content[0].text;

            // セクション分割
            let faceResult = {};
            let combinedText = resultText;

            if (resultText.includes("===SECTION1===") && resultText.includes("===SECTION2===")) {
                const parts = resultText.split("===SECTION2===");
                const section1 = parts[0].replace("===SECTION1===", "").trim();
                combinedText = parts[1] ? parts[1].trim() : resultText;

                const jsonMatch = section1.match(/\{[\s\S]*?\}/);
                if (jsonMatch) {
                    try { faceResult = JSON.parse(jsonMatch[0]); } catch (e) { faceResult = { "総合鑑定": section1 }; }
                } else {
                    faceResult = { "総合鑑定": section1 };
                }
            }

            renderFaceAnalysis(faceResult);
            document.getElementById("combined-result").innerHTML = formatMarkdown(combinedText);

        } catch (err) {
            console.error("Claude API error:", err);
            document.getElementById("combined-result").innerHTML = `<p style="color:var(--error);">AI鑑定エラー: ${err.message}</p><p>四柱推命・九星気学の結果は上のタブからご覧いただけます。</p>`;
            document.getElementById("face-result").innerHTML = `<p style="color:var(--error);">人相学鑑定エラー: ${err.message}</p>`;
        }
    }

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(",")[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // ===== レンダリング関数 =====

    function renderPillars(s) {
        const pillars = s["四柱"];
        let html = '<table class="meishiki-table"><thead><tr><th></th>';
        const order = ["時柱", "日柱", "月柱", "年柱"];
        for (const name of order) { if (pillars[name]) html += `<th>${name}</th>`; }
        html += "</tr></thead><tbody>";
        html += "<tr><td>天干</td>";
        for (const name of order) { if (pillars[name]) html += `<td class="tenkan">${pillars[name]["天干"] || "-"}</td>`; }
        html += "</tr><tr><td>地支</td>";
        for (const name of order) { if (pillars[name]) html += `<td class="chishi">${pillars[name]["地支"] || "-"}</td>`; }
        html += "</tr><tr><td>通変星</td>";
        for (const name of order) { if (pillars[name] && s["通変星"][name]) html += `<td>${s["通変星"][name]["天干通変星"]}</td>`; }
        html += "</tr><tr><td>十二運</td>";
        for (const name of order) { if (pillars[name] && s["十二運"][name]) html += `<td>${s["十二運"][name]}</td>`; }
        html += "</tr><tr><td>蔵干</td>";
        for (const name of order) {
            if (pillars[name] && s["蔵干"][name]) {
                const z = s["蔵干"][name];
                const parts = [z["本気"], z["中気"], z["余気"]].filter(Boolean);
                html += `<td>${parts.join(" / ")}</td>`;
            }
        }
        html += "</tr></tbody></table>";
        document.getElementById("pillars-table").innerHTML = html;
    }

    function renderPersonality(s) {
        const p = s["日主の性格"];
        if (!p) return;
        document.getElementById("nichi-personality").innerHTML = `
            <div class="personality-info"><span class="label">日主:</span> ${s["日主"]}（${s["日主の五行"]}・${s["日主の陰陽"]}）</div>
            <div class="personality-info"><span class="label">象意:</span> ${p["象意"] || ""}</div>
            <div class="personality-info"><span class="label">性格:</span> ${p["基本性格"] || ""}</div>
            <div class="personality-info"><span class="label">長所:</span> ${p["長所"] || ""}</div>
            <div class="personality-info"><span class="label">短所:</span> ${p["短所"] || ""}</div>`;
    }

    function renderGogyoBalance(s) {
        const balance = s["五行バランス"];
        if (!balance) return;
        const max = Math.max(...Object.values(balance), 1);
        const gogyoMap = { "木": "wood", "火": "fire", "土": "earth", "金": "metal", "水": "water" };
        let html = '<div class="gogyo-bars">';
        for (const [gogyo, value] of Object.entries(balance)) {
            const pct = (value / max) * 100;
            html += `<div class="gogyo-bar-item gogyo-${gogyoMap[gogyo]}">
                <span class="gogyo-bar-label">${gogyo}</span>
                <div class="gogyo-bar-track"><div class="gogyo-bar-fill" style="width:${pct}%"></div></div>
                <span class="gogyo-bar-value">${value}</span></div>`;
        }
        html += "</div>";
        document.getElementById("gogyo-balance").innerHTML = html;
        document.getElementById("gogyo-analysis").innerHTML = `<p>${s["五行分析"] || ""}</p>`;
    }

    function renderTsuhensei(s) {
        const tsuhen = s["通変星"], juuni = s["十二運"];
        if (!tsuhen) return;
        let html = '<table class="meishiki-table"><thead><tr><th>柱</th><th>天干通変星</th><th>地支通変星</th><th>十二運</th></tr></thead><tbody>';
        for (const name of ["年柱", "月柱", "日柱", "時柱"]) {
            if (tsuhen[name]) html += `<tr><td>${name}</td><td>${tsuhen[name]["天干通変星"]}</td><td>${tsuhen[name]["地支通変星"]}</td><td>${juuni[name] || "-"}</td></tr>`;
        }
        html += "</tbody></table>";
        document.getElementById("tsuhensei-table").innerHTML = html;
    }

    function renderDaiun(s) {
        const daiun = s["大運"];
        if (!daiun || !daiun.length) { document.getElementById("daiun-table").innerHTML = "<p>性別が不明のため大運は計算できませんでした。</p>"; return; }
        let html = '<table class="daiun-table"><thead><tr><th>開始年齢</th><th>干支</th><th>十二運</th></tr></thead><tbody>';
        for (const d of daiun) html += `<tr><td>${d["開始年齢"]}歳</td><td>${d["干支"]}</td><td>${d["十二運"]}</td></tr>`;
        html += "</tbody></table>";
        document.getElementById("daiun-table").innerHTML = html;
    }

    function renderKyusei(k) {
        const starCard = (label, name) => `<div class="kyusei-star-card"><div class="star-label">${label}</div><div class="star-name">${name}</div></div>`;
        document.getElementById("kyusei-stars").innerHTML = `<div class="kyusei-stars-grid">${starCard("本命星", k["本命星"])}${starCard("月命星", k["月命星"])}${starCard("日命星", k["日命星"])}</div>`;

        const detail = k["本命星の詳細"];
        if (detail) {
            let dhtml = "";
            for (const [key, value] of Object.entries(detail)) dhtml += `<div class="face-item"><h4>${key}</h4><p>${value}</p></div>`;
            if (k["相性の良い九星"]?.length) dhtml += `<div class="face-item"><h4>相性の良い九星</h4><p>${k["相性の良い九星"].join("、")}</p></div>`;
            document.getElementById("honmei-detail").innerHTML = dhtml;
        }

        let gnHtml = "";
        if (k["月命星の詳細"]) gnHtml += `<div class="face-item"><h4>月命星（${k["月命星"]}）- 内面の性格</h4><p>${k["月命星の詳細"]["説明"] || ""}</p></div>`;
        if (k["日命星の詳細"]) gnHtml += `<div class="face-item"><h4>日命星（${k["日命星"]}）- 隠れた本質</h4><p>${k["日命星の詳細"]["説明"] || ""}</p></div>`;
        document.getElementById("getsu-nichi-detail").innerHTML = gnHtml;
    }

    function renderFaceAnalysis(f) {
        if (!f || f.error) { document.getElementById("face-result").innerHTML = `<p style="color:var(--error);">${f?.error || "人相学鑑定結果を取得できませんでした。"}</p>`; return; }
        const keys = ["顔の輪郭分析", "目と眉の分析", "鼻と口の分析", "全体的な印象", "仕事適性", "対人関係", "運勢アドバイス", "総合鑑定"];
        let html = "";
        for (const key of keys) { if (f[key]) html += `<div class="face-item"><h4>${key}</h4><p>${f[key]}</p></div>`; }
        for (const [key, value] of Object.entries(f)) { if (!keys.includes(key) && key !== "error") html += `<div class="face-item"><h4>${key}</h4><p>${value}</p></div>`; }
        document.getElementById("face-result").innerHTML = html || "<p>人相学鑑定結果を取得できませんでした。</p>";
    }

    function formatMarkdown(text) {
        if (!text) return "";
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            .replace(/^### (.*$)/gm, '<h4 style="color:var(--accent-light);margin-top:1rem;">$1</h4>')
            .replace(/^## (.*$)/gm, '<h3 style="color:var(--accent);margin-top:1.2rem;">$1</h3>')
            .replace(/^# (.*$)/gm, '<h2 style="color:var(--accent);margin-top:1.5rem;">$1</h2>')
            .replace(/^- (.*$)/gm, "<li>$1</li>")
            .replace(/\n\n/g, "</p><p>")
            .replace(/\n/g, "<br>");
    }
});
