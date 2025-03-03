#!/bin/bash

# 🚀 先刪除 public/prod，確保乾淨
rm -rf public/prod

# 執行建置
run-p type-check build-only

# ✅ 只在 dist 內有內容時才建立 public/prod
if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
  mkdir -p public/prod
  cp -r dist/* public/prod/
fi