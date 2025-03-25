import { createI18n } from 'vue-i18n';
import zh from '@/assets/locales/zh.json';

const i18n = createI18n({
  legacy: false, // 使用 Composition API
  locale: 'zh', // 預設語言
  messages: { zh },
});

export default i18n;
