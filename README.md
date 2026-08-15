# 電腦軟體設計競賽 Diagnostic Test v1

純前端、行動優先的能力診斷 MVP。資料與作答紀錄會用瀏覽器 `localStorage` 儲存在使用者目前的裝置，不含登入與後端。

## 部署到 GitHub Pages

將這些檔案推送到 GitHub repository 的預設分支，在 repository 的 **Settings → Pages** 選擇從該分支根目錄部署即可。

## 題庫

請編輯 `questions.js` 的 `TEST_PARTS`。每題可使用：

- `choice`：設定 `choices` 與答案的零起始索引字串，例如 `answer: '1'`。
- `short`：設定 `answer: ['可接受答案']`，或用 `keywords` 作概念比對。
- `long`：設定 `keywords`，目前至少命中兩個關鍵字即視為初步通過。

Part D 為解題規劃能力的提示性診斷，不是程式編譯／執行結果。
