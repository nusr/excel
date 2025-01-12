# 🌐 在线协作 Excel

[![CI](https://github.com/nusr/excel/actions/workflows/main.yml/badge.svg)](https://github.com/nusr/excel/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/nusr/excel/branch/main/graph/badge.svg?token=ZOC8RHD3Z1)](https://codecov.io/gh/nusr/excel)
![GitHub](https://img.shields.io/github/license/nusr/excel.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/nusr/excel.svg)

[English](./README.md) | 中文

[在线演示](https://nusr.github.io/excel)

![演示](./scripts/demo.gif)

## 🚀 安装

```bash
npm i --save excel-collab
```

## 📚 示例

- [简单示例](https://stackblitz.com/edit/nusr-excel-simple)
- [自定义示例](https://stackblitz.com/edit/nusr-excel-custom)
- [协作示例](https://stackblitz.com/edit/nusr-excel-collaboration)

## 🛠️ 开发

```bash
git clone https://github.com/nusr/excel.git
cd excel

npm i -g pnpm
pnpm i
cd demo/frontend && pnpm i && cd -
cd demo/backend && pnpm i && cd -
npm run dev
```

## ✨ 支持的功能

- [x] 在线协作
- [x] 创建文件
- [x] 更改文件名
- [x] Web Worker 解析公式
- [x] OffScreenCanvas 渲染
- [x] 撤销
- [x] 重做
- [x] 复制
- [x] 剪切
- [x] 粘贴
- [x] 公式
- [x] 字体
- [x] 字号
- [x] 字体颜色
- [x] 填充颜色
- [x] 加粗
- [x] 斜体
- [x] 删除线
- [x] 下划线
- [x] 边框
- [x] 垂直对齐
- [x] 水平对齐
- [x] 文本换行
- [x] 数字格式
- [x] 自动筛选
- [x] 合并单元格
- [x] 图表
- [x] 浮动图片
- [x] 定义名称
- [x] 插入行
- [x] 插入列
- [x] 删除行
- [x] 删除列
- [x] 隐藏行
- [x] 隐藏列
- [x] 行高
- [x] 列宽
- [x] 插入工作表
- [x] 删除工作表
- [x] 重命名工作表
- [x] 隐藏工作表
- [x] 取消隐藏工作表
- [x] 导入 XLSX
- [x] 导出 XLSX
- [x] 导入 CSV
- [x] 导出 CSV
- [x] 暗黑模式
- [x] 国际化

## Supported Formulas

### Math

- [x] ABS
- [x] ACOS
- [x] ACOSH
- [x] ACOT
- [x] ACOTH
- [x] ASIN
- [x] ASINH
- [x] ATAN
- [x] ATAN2
- [x] ATANH
- [x] AVERAGE
- [x] COS
- [x] COT
- [x] EXP
- [x] INT
- [x] PI
- [x] SIN
- [x] SUM

### Text

- [x] CHAR
- [x] CODE
- [x] CONCAT
- [x] CONCATENATE
- [x] LEN
- [x] LOWER
- [x] SPLIT
- [x] T
- [x] TEXT
- [x] TRIM
- [x] UNICHAR
- [x] UNICODE
- [x] UPPER
