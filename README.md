# CodeFest Taipei

> 這是一個基於 **Nuxt 3.16.0** 的前端專案，使用 Vue 3、Pinia、Tailwind CSS，並支援 i18n。

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](./LICENSE) file for details.

## 系統需求

請確保你的環境符合以下要求：

| **需求**   | **最低版本**  | **建議版本**  |
|------------|-------------|-------------|
| **Node.js** | `>=18.14.0` | `18 LTS` (`18.17.0` 以上) |
| **NPM**    | `>=8.0.0`   | `8.x` 或 `9.x` |
| **Nuxt**   | `3.16.0`    | `3.16.0` |

## 專案設定

請確保已經安裝 Node.js 和 npm，並執行執行以下指令：

```sh
npm install
```

### 開發模式

```bash
npm run dev
```

啟動後，請在瀏覽器開啟：`http://localhost:3000`

### 專案打包

```bash
npm run generate
```

### 專案部署

專案使用 CI/CD 自動部署，請發起 Pull Request，待審核通過並成功合併至 main 分支後，即會自動觸發部署流程。

## 開發規範與工具

### 格式與 Lint

- **ESLint**：程式碼檢查
- **Prettier**：程式碼格式化
- **Stylelint**：樣式檢查

### 檢查指令

```bash
npm run lint:js     # JavaScript / TypeScript / Vue 檢查
npm run lint:style  # SCSS / Style 檢查
```

## 專案結構

components 元件管理採用 [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)。

- atom: 不可分割元件，通常為 base 類型元件，ex: `button`, `input`。
- molecule: 由 atom 元件組成，具有單一功能性，ex: search bar (`input` + `button`)。
- organism: 由 atom 與 molecule 元件組成，多功能性的元件，ex: header。

元件命名規則採 UpperCamelCase，引用元件時需帶上分類 prefix，ex: \<AtomButton />。

結構規則採用 Nuxt3 結構 [Diectory Structure](https://nuxt.com/docs/guide/directory-structure/nuxt)。

## 專案維護說明

### 多語系檔案維護 (zh.json)

網站文案主要存放於 `assets/locales/zh.json` 檔案中，採用巢狀 JSON 格式。以下說明如何進行文案更新：

#### 更新步驟

1. **修改文案**
   - 依照現有的 JSON 結構找到對應的區塊
   - 保持相同的縮排格式

2. **注意事項**
   - 修改時請確保 JSON 格式正確，可使用 JSON 驗證工具檢查
   - 文字中如有特殊字元（如引號），需使用跳脫字元 `\`
   - 更新後請在本地測試，確認顯示正常
   - 建議保留一份修改前的備份
3. **測試驗證**
   - 文案更新後，請至少檢查以下項目：
     - 頁面是否正常渲染
     - 文字是否正確換行
     - RWD 版面是否正常
     - 特殊字元是否正確顯示

#### 1. 修改首頁與歷年回顧內容

頁面內容位於 `assets/locales/zh.json` 檔案，可編輯以下內容：

- **首頁標題**：修改 `index.title` 以變更首頁標題。
- **首頁活動資訊**：修改 `index.activities`，可新增、刪除或編輯活動的 **名稱、日期與 icon**。
- **歷年回顧資訊**：
  - `history.navigation`：管理歷年回顧的分類，例如 **臺北程式設計節、臺北生成藝術節**。
  - `history.activities`：管理各分類下的活動資訊，例如 **活動名稱、日期、連結與可用狀態**。

#### 2. 調整首頁活動 icon

若需修改首頁活動 `icon`，請按照以下步驟：

- **將新圖示存為 `.png` 格式**。
- **將圖片放置於 `public/images/icons/` 目錄**。
- **在 `zh.json` 中對應 `icon_type` 屬性，確保名稱與圖片一致**。

[![Maintained by Koafaith](https://img.shields.io/badge/maintained%20by-Koafaith-blue)](https://github.com/Koafaith)