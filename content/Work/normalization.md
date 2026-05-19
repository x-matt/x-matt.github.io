---
title: Normalization
tags:
  - tool
---

### 提交前统一格式

1. 安装husky

```bash
npm install -D husky lint-staged prettier
```

1. 调整`package.json`

```json
{
  "scripts": {
    "format": "prettier --write .",
    "lint:md": "markdownlint .",
    "lint:md:fix": "markdownlint . --fix",
    "prepare": "husky install"
  },
  "devDependencies": {
    "markdownlint-cli": "^0.48.0",
    "prettier": "^3.0.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0"
  },
  "lint-staged": {
    "*.md": ["prettier --write", "markdownlint --fix"]
  }
}
```

1. 初始化husky : `npm run prepare` 获 `npx husky install`
2. 添加 pre-commit hook: `npx husky add .husky/pre-commit "npx lint-staged"`, 保证文件`.husky/pre-commit`里面是 `npx lint-staged`
