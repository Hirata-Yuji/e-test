document.addEventListener("DOMContentLoaded", () => {
    const dropArea = document.getElementById("drop-area");
    const pdfInput = document.getElementById("pdf-input");
    const fileName = document.getElementById("file-name");
    const submitBtn = document.getElementById("submit-btn");
    const form = document.getElementById("upload-form");
    const loading = document.getElementById("loading");
    const error = document.getElementById("error");
    const errorMessage = document.getElementById("error-message");
    const results = document.getElementById("results");

    let selectedFile = null;

    // ドラッグ＆ドロップ
    dropArea.addEventListener("click", () => pdfInput.click());

    dropArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropArea.classList.add("dragover");
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("dragover");
    });

    dropArea.addEventListener("drop", (e) => {
        e.preventDefault();
        dropArea.classList.remove("dragover");
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type === "application/pdf") {
            selectedFile = files[0];
            fileName.textContent = selectedFile.name;
            submitBtn.disabled = false;
        }
    });

    pdfInput.addEventListener("change", () => {
        if (pdfInput.files.length > 0) {
            selectedFile = pdfInput.files[0];
            fileName.textContent = selectedFile.name;
            submitBtn.disabled = false;
        }
    });

    // タブ切り替え
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
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("pdf", selectedFile);

        const birthdate = document.getElementById("birthdate").value;
        const gender = document.getElementById("gender").value;
        if (birthdate) formData.append("birthdate", birthdate);
        if (gender) formData.append("gender", gender);

        // UI更新
        loading.style.display = "block";
        error.style.display = "none";
        results.style.display = "none";
        submitBtn.disabled = true;

        // ステップアニメーション
        animateSteps();

        try {
            const response = await fetch("/analyze", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "鑑定中にエラーが発生しました");
            }

            displayResults(data);
        } catch (err) {
            error.style.display = "block";
            errorMessage.textContent = err.message;
        } finally {
            loading.style.display = "none";
            submitBtn.disabled = false;
        }
    });

    function animateSteps() {
        const steps = document.querySelectorAll(".loading-steps .step");
        steps.forEach((s) => {
            s.classList.remove("active", "done");
        });

        let current = 0;
        const interval = setInterval(() => {
            if (current > 0) {
                steps[current - 1].classList.remove("active");
                steps[current - 1].classList.add("done");
            }
            if (current < steps.length) {
                steps[current].classList.add("active");
                current++;
            } else {
                clearInterval(interval);
            }
        }, 3000);

        // 完了時にクリア
        window._stepInterval = interval;
    }

    function displayResults(data) {
        if (window._stepInterval) clearInterval(window._stepInterval);

        results.style.display = "block";

        // メタ情報
        document.getElementById("result-meta").innerHTML =
            `<strong>${data.birthdate}</strong> 生まれ（${data.gender}）`;

        // 総合鑑定
        document.getElementById("combined-result").innerHTML = formatMarkdown(data.combined_analysis);

        // 四柱推命
        renderPillars(data.shichusuimei);
        renderPersonality(data.shichusuimei);
        renderGogyoBalance(data.shichusuimei);
        renderTsuhensei(data.shichusuimei);
        renderDaiun(data.shichusuimei);

        // 九星気学
        renderKyusei(data.kyusei);

        // 人相学
        renderFaceAnalysis(data.face_analysis);

        // スクロール
        results.scrollIntoView({ behavior: "smooth" });
    }

    function renderPillars(s) {
        const pillars = s["四柱"];
        let html = '<table class="meishiki-table"><thead><tr>';
        html += "<th></th>";
        const order = ["時柱", "日柱", "月柱", "年柱"];
        for (const name of order) {
            if (pillars[name]) html += `<th>${name}</th>`;
        }
        html += "</tr></thead><tbody>";

        // 天干行
        html += "<tr><td>天干</td>";
        for (const name of order) {
            if (pillars[name]) {
                html += `<td class="tenkan">${pillars[name]["天干"] || "-"}</td>`;
            }
        }
        html += "</tr>";

        // 地支行
        html += "<tr><td>地支</td>";
        for (const name of order) {
            if (pillars[name]) {
                html += `<td class="chishi">${pillars[name]["地支"] || "-"}</td>`;
            }
        }
        html += "</tr>";

        // 通変星行
        html += "<tr><td>通変星</td>";
        for (const name of order) {
            if (pillars[name] && s["通変星"][name]) {
                html += `<td>${s["通変星"][name]["天干通変星"]}</td>`;
            }
        }
        html += "</tr>";

        // 十二運行
        html += "<tr><td>十二運</td>";
        for (const name of order) {
            if (pillars[name] && s["十二運"][name]) {
                html += `<td>${s["十二運"][name]}</td>`;
            }
        }
        html += "</tr>";

        // 蔵干行
        html += "<tr><td>蔵干</td>";
        for (const name of order) {
            if (pillars[name] && s["蔵干"][name]) {
                const z = s["蔵干"][name];
                const parts = [];
                if (z["本気"]) parts.push(z["本気"]);
                if (z["中気"]) parts.push(z["中気"]);
                if (z["余気"]) parts.push(z["余気"]);
                html += `<td>${parts.join(" / ")}</td>`;
            }
        }
        html += "</tr>";

        html += "</tbody></table>";
        document.getElementById("pillars-table").innerHTML = html;
    }

    function renderPersonality(s) {
        const p = s["日主の性格"];
        if (!p) return;
        let html = `
            <div class="personality-info"><span class="label">日主:</span> ${s["日主"]}（${s["日主の五行"]}・${s["日主の陰陽"]}）</div>
            <div class="personality-info"><span class="label">象意:</span> ${p["象意"] || ""}</div>
            <div class="personality-info"><span class="label">性格:</span> ${p["基本性格"] || ""}</div>
            <div class="personality-info"><span class="label">長所:</span> ${p["長所"] || ""}</div>
            <div class="personality-info"><span class="label">短所:</span> ${p["短所"] || ""}</div>
        `;
        document.getElementById("nichi-personality").innerHTML = html;
    }

    function renderGogyoBalance(s) {
        const balance = s["五行バランス"];
        if (!balance) return;
        const max = Math.max(...Object.values(balance), 1);
        const gogyoMap = { "木": "wood", "火": "fire", "土": "earth", "金": "metal", "水": "water" };

        let html = '<div class="gogyo-bars">';
        for (const [gogyo, value] of Object.entries(balance)) {
            const pct = (value / max) * 100;
            html += `
                <div class="gogyo-bar-item gogyo-${gogyoMap[gogyo]}">
                    <span class="gogyo-bar-label">${gogyo}</span>
                    <div class="gogyo-bar-track">
                        <div class="gogyo-bar-fill" style="width:${pct}%"></div>
                    </div>
                    <span class="gogyo-bar-value">${value}</span>
                </div>
            `;
        }
        html += "</div>";
        document.getElementById("gogyo-balance").innerHTML = html;
        document.getElementById("gogyo-analysis").innerHTML = `<p>${s["五行分析"] || ""}</p>`;
    }

    function renderTsuhensei(s) {
        const tsuhen = s["通変星"];
        const juuni = s["十二運"];
        if (!tsuhen) return;

        let html = '<table class="meishiki-table"><thead><tr><th>柱</th><th>天干通変星</th><th>地支通変星</th><th>十二運</th></tr></thead><tbody>';
        for (const name of ["年柱", "月柱", "日柱", "時柱"]) {
            if (tsuhen[name]) {
                html += `<tr>
                    <td>${name}</td>
                    <td>${tsuhen[name]["天干通変星"]}</td>
                    <td>${tsuhen[name]["地支通変星"]}</td>
                    <td>${juuni[name] || "-"}</td>
                </tr>`;
            }
        }
        html += "</tbody></table>";
        document.getElementById("tsuhensei-table").innerHTML = html;
    }

    function renderDaiun(s) {
        const daiun = s["大運"];
        if (!daiun || daiun.length === 0) {
            document.getElementById("daiun-table").innerHTML = "<p>性別が不明のため大運は計算できませんでした。</p>";
            return;
        }

        let html = '<table class="daiun-table"><thead><tr><th>開始年齢</th><th>干支</th><th>十二運</th></tr></thead><tbody>';
        for (const d of daiun) {
            html += `<tr><td>${d["開始年齢"]}歳</td><td>${d["干支"]}</td><td>${d["十二運"]}</td></tr>`;
        }
        html += "</tbody></table>";
        document.getElementById("daiun-table").innerHTML = html;
    }

    function renderKyusei(k) {
        // 三つの星
        let html = '<div class="kyusei-stars-grid">';
        html += starCard("本命星", k["本命星"]);
        html += starCard("月命星", k["月命星"]);
        html += starCard("日命星", k["日命星"]);
        html += "</div>";
        document.getElementById("kyusei-stars").innerHTML = html;

        // 本命星の詳細
        const detail = k["本命星の詳細"];
        if (detail) {
            let dhtml = "";
            for (const [key, value] of Object.entries(detail)) {
                dhtml += `<div class="face-item"><h4>${key}</h4><p>${value}</p></div>`;
            }
            if (k["相性の良い九星"] && k["相性の良い九星"].length > 0) {
                dhtml += `<div class="face-item"><h4>相性の良い九星</h4><p>${k["相性の良い九星"].join("、")}</p></div>`;
            }
            document.getElementById("honmei-detail").innerHTML = dhtml;
        }

        // 月命星・日命星
        let gnHtml = "";
        if (k["月命星の詳細"]) {
            gnHtml += `<div class="face-item"><h4>月命星（${k["月命星"]}）- 内面の性格</h4><p>${k["月命星の詳細"]["説明"] || k["月命星の詳細"]["基本性格"] || ""}</p></div>`;
        }
        if (k["日命星の詳細"]) {
            gnHtml += `<div class="face-item"><h4>日命星（${k["日命星"]}）- 隠れた本質</h4><p>${k["日命星の詳細"]["説明"] || k["日命星の詳細"]["基本性格"] || ""}</p></div>`;
        }
        document.getElementById("getsu-nichi-detail").innerHTML = gnHtml;
    }

    function starCard(label, name) {
        return `<div class="kyusei-star-card"><div class="star-label">${label}</div><div class="star-name">${name}</div></div>`;
    }

    function renderFaceAnalysis(f) {
        if (!f) return;
        if (f.error) {
            document.getElementById("face-result").innerHTML = `<p class="error-message">${f.error}</p>`;
            return;
        }

        let html = "";
        const keys = ["顔の輪郭分析", "目と眉の分析", "鼻と口の分析", "全体的な印象", "仕事適性", "対人関係", "運勢アドバイス", "総合鑑定"];
        for (const key of keys) {
            if (f[key]) {
                html += `<div class="face-item"><h4>${key}</h4><p>${f[key]}</p></div>`;
            }
        }

        // 上記のキーに含まれない項目も表示
        for (const [key, value] of Object.entries(f)) {
            if (!keys.includes(key) && key !== "error") {
                html += `<div class="face-item"><h4>${key}</h4><p>${value}</p></div>`;
            }
        }

        document.getElementById("face-result").innerHTML = html || "<p>人相学鑑定結果を取得できませんでした。</p>";
    }

    function formatMarkdown(text) {
        if (!text) return "";
        // 簡易マークダウン変換
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
