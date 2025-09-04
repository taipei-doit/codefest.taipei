/**
 * 歷年活動
 */
export interface HistoryActivity {
  name: string;
  date: string;
  link: string;
  available: boolean;
  isSelected?: boolean; // 🔹 新增 `isSelected` 屬性（可選）
}

/**
 * 歷年活動類別
 */
export interface HistoryNavigation {
  name: string;
  type: string;
  current: boolean;
}
