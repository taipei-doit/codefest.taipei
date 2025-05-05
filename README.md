# CodeFest Taipei

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](./LICENSE) file for details.

## 建議的 IDE 設定

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (並停用 Vetur).

## 專案設定

請確保已經安裝 Node.js 和 npm，並執行執行以下指令：

```sh
npm install
```

### 開發模式

```bash
npm run dev
```

### 專案打包

```bash
npm run build
```

### 專案部署

專案使用 CI/CD 自動部署，只需將程式碼推送至 main 分支，即可觸發自動部署流程。

## 修改檔案方式

### 1. 修改首頁與歷年回顧內容

頁面內容位於 `assets/locales/zh.json` 檔案，可編輯以下內容：

- **首頁標題**：修改 `home.title` 以變更首頁標題。
- **首頁活動資訊**：修改 `home.activities`，可新增、刪除或編輯活動的 **名稱、日期與 icon**。
- **歷年回顧資訊**：
  - `history.navigation`：管理歷年回顧的分類，例如 **臺北程式設計節、臺北生成藝術節**。
  - `history.activities`：管理各分類下的活動資訊，例如 **活動名稱、日期、連結與可用狀態**。

### 2. 調整首頁活動 icon

若需修改首頁活動 `icon`，請按照以下步驟：

- **將新圖示存為 `.png` 格式**。
- **將圖片放置於 `public/images/icons/` 目錄**。
- **在 `zh.json` 中對應 `icon_type` 屬性，確保名稱與圖片一致**。

### 3. 本地測試

修改完畢後，執行以下指令啟動本地開發伺服器：

```sh
npm run dev
```
