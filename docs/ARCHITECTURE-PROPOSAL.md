# P1 架構決策紀錄 — 2026-11-01

日期化決策紀錄，不是待執行規格；以下背景與取捨以 2026-11-01 為準。
原始問題與驗收條件見 [#20](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/20)。
目前來源、模組及發布設計以 [ARCHITECTURE](ARCHITECTURE.md) 為準；
驗證程序見 [CONTRIBUTING](CONTRIBUTING.md)，整合證據保留在 PR 與 Git 歷史。

## 背景與選擇

基準 `4259eda` 的 `index.html` 同時包含政策資料、CSS、計算公式、核心互動及動畫，
完整政策依賴 JavaScript，沒有自動化檢查。發布方式為 GitHub Pages legacy `main:/`。

| 方案 | 取捨 | 決定 |
| --- | --- | --- |
| 繼續手工維護 HTML 與 JS 的重複內容 | 工具最少，但資料、金額及來源容易漂移 | 不採用 |
| Node.js 靜態產生，提交公開產物 | 開發需工具與驗證；部署維持靜態檔，內容可共用單一來源 | 採用 |
| 完整前端框架或主機遷移 | 增加短期網站的依賴與維護成本，非解決既有問題的必要條件 | 不採用 |

## 決策理由

- 初始 HTML 永久保留完整總覽，互動卡片可以重複選定內容但不得重複 DOM ID。
  這會增加頁長，換取核心腳本失敗時仍可閱讀的資訊。
- 核心先初始化，再以受保護的介面呼叫選用功能。單純抽取外部檔案不足以隔離失敗，
  全域隱藏內容後等待 JS 顯示亦不符合回退需求。
- 純計算與畫面分離，提案金額、標籤及政策文字共用設定；不以現行政府給付替換候選人提案。
- 生成器的輸出清單不等於發布邊界。另用逐檔公開清單、Jekyll 排除規則及實際輸出比對，
  保留 legacy Pages 設定。`.gitignore`、robots 或 sitemap 遺漏都不能取代發布排除。
- 使用原生 Node 測試及鎖定版本的開發期 HTML／瀏覽器驗證；正式環境不增加應用程式伺服器。

## 後續維護

2026-11-02 補記：[PR #32](https://github.com/Hanyingyilan/hanyingyilan.github.io/pull/32)
已整合分類頁、JSON-LD、選用功能防護及選後歷史脈絡。原提案的非同步隔離契約
仍應按實際失敗路徑驗證，不因少數測試通過而宣稱涵蓋所有瀏覽器例外。
現行邊界見 [Architecture](ARCHITECTURE.md#runtime-boundaries)。

原提案與五項實作順序保留在 Git 歷史 `d0395a8`；完成的執行／驗證紀錄留在 PR。
目前待辦見 [Roadmap](ROADMAP.md)，不重複歷史任務清單。
