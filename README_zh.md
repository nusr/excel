# 在线协作 Excel

[![CI](https://github.com/nusr/excel/actions/workflows/ci.yml/badge.svg)](https://github.com/nusr/excel/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/nusr/excel/branch/main/graph/badge.svg?token=ZOC8RHD3Z1)](https://codecov.io/gh/nusr/excel)
![GitHub](https://img.shields.io/github/license/nusr/excel.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/nusr/excel.svg)

[English](./README.md) | 中文

[在线演示](https://nusr.github.io/excel)

![演示](./scripts/demo.gif)

## 安装

```bash
npm i --save excel-collab
```

## 快速开始

1. 创建 React 应用

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm i
```

2. 安装依赖

```bash
npm i --save excel-collab
```

3. 修改 main.tsx 文件

```ts src/main.tsx
// src/main.tsx
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { Excel } from 'excel-collab';
import 'excel-collab/style.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Excel style={{ height: '100vh' }} />
  </StrictMode>,
);
```

4. 启动应用

```bash
npm run start
```

## 示例

- [简单示例](https://stackblitz.com/edit/nusr-excel-simple)
- [自定义示例](https://stackblitz.com/edit/nusr-excel-custom)

## 协作示例

```bash
git clone https://github.com/nusr/excel.git
cd excel

npm i -g yarn
yarn
npm run start
```

## 概述

Excel-collab 是一个基于 Web 的电子表格应用程序，支持实时协作、公式计算、格式设置和数据处理。

### 主要特性

- **实时协作**：多个用户可以同时编辑同一个电子表格，并具有冲突解决机制
- **全面公式支持**：通过 FormulaJS 集成支持 400+ Excel 函数
- **丰富格式设置**：字体、颜色、边框、对齐、数字格式等
- **高性能**：使用 OffScreenCanvas 渲染和 Web Worker 公式计算
- **文件兼容性**：支持导入/导出 XLSX 和 CSV 格式

## 架构设计

应用程序采用模块化架构，关注点分离清晰：

```
excel/
├── packages/excel-collab/
│   ├── src/
│   │   ├── canvas/          # Canvas 渲染引擎
│   │   │   ├── MainCanvas.ts      # 主画布控制器
│   │   │   ├── offScreenWorker.ts # 离屏画布工作线程
│   │   │   └── worker.ts          # Web Worker 处理复杂计算
│   │   ├── components/      # 可复用 UI 组件
│   │   ├── containers/      # 应用程序容器和业务逻辑
│   │   │   ├── Excel/             # 主编辑器容器
│   │   │   ├── FormulaBar/        # 公式输入和编辑
│   │   │   ├── CanvasContainer/   # 画布包装器
│   │   │   └── store/             # 状态管理
│   │   ├── controller/      # 业务逻辑控制器
│   │   │   ├── Controller.ts      # 主控制器
│   │   │   └── decorator.ts       # 事务装饰器
│   │   ├── formula/         # 公式解析器和求值器
│   │   │   ├── parser.ts          # 表达式解析器
│   │   │   ├── scanner.ts         # 词法扫描器
│   │   │   ├── interpreter.ts     # 表达式解释器
│   │   │   └── eval.ts            # 公式求值
│   │   ├── model/           # 数据模型
│   │   ├── types/           # TypeScript 类型定义
│   │   ├── util/            # 工具函数
│   │   └── i18n/            # 国际化
```

### 核心组件

#### Canvas 渲染引擎

Canvas 渲染系统使用 **OffScreenCanvas** 实现高性能渲染：

- **MainCanvas**：连接 React 组件与 Canvas 渲染
- **OffScreenWorker**：在独立线程中处理渲染操作
- **Worker**：管理主线程与工作线程之间的通信

这种架构确保即使在处理大型电子表格时也能保持流畅的 UI 交互。

#### 公式解析器

公式系统实现了经典的编译器架构：

```
公式字符串 → 扫描器 → 解析器 → 解释器 → 结果
              ↓        ↓         ↓
           词法单元   抽象语法树   值
```

**扫描器** (`scanner.ts`)：将公式字符串分解为词法单元

- 识别数字、字符串、单元格引用、函数、运算符
- 处理 Excel 错误值（#REF!, #NAME? 等）
- 支持定义名称和 R1C1 引用

**解析器** (`parser.ts`)：构建抽象语法树 (AST)

- 实现递归下降解析
- 支持运算符优先级（指数 → 一元 → 乘除 → 加减）
- 处理带参数的函数调用
- 支持单元格范围和数组表达式

**解释器** (`interpreter.ts`)：求值 AST

- 使用访问者模式遍历表达式树
- 解析单元格引用和范围
- 调用 Excel 函数并正确处理参数
- 管理循环依赖检测

**公式主要特性**：

- 400+ 个 FormulaJS 函数
- 数组公式和动态范围
- 定义名称和作用域引用
- 跨工作表引用
- 错误处理和传播

#### 状态管理

- **控制器模式**：通过 `Controller` 类集中管理业务逻辑
- **事务支持**：批量操作并支持撤销/重做
- **事件系统**：用于组件通信的事件发射器
- **不可变更新**：确保状态变化的可预测性

#### 协作功能

基于 **Yjs** 的 CRDT 实现实时协作：

- 无冲突的并发编辑
- 用户在线状态感知协议
- 离线支持和同步

## 支持的功能

### 编辑操作

- [x] 在线协作
- [x] 创建文件
- [x] 更改文件名
- [x] 撤销/重做
- [x] 复制/剪切/粘贴
- [x] 查找和替换

### 公式

- [x] 400+ Excel 函数
- [x] 数组公式
- [x] 跨工作表引用
- [x] 定义名称
- [x] 循环引用检测
- [x] Web Worker 公式解析

### 格式设置

- [x] 字体
- [x] 字号
- [x] 字体颜色
- [x] 填充颜色
- [x] 加粗/斜体/删除线/下划线
- [x] 边框
- [x] 文本对齐
- [x] 文本换行
- [x] 数字格式
- [x] 日期/时间格式
- [x] 自定义格式

### 数据操作

- [x] 自动筛选
- [x] 排序
- [x] 合并单元格
- [x] 插入行/列
- [x] 删除行/列
- [x] 隐藏行/列
- [x] 行高
- [x] 列宽
- [x] 冻结窗格

### 可视化

- [x] 图表
- [x] 浮动图片
- [x] 迷你图

### 工作表管理

- [x] 插入工作表
- [x] 删除工作表
- [x] 重命名工作表
- [x] 隐藏/取消隐藏工作表
- [x] 工作表颜色

### 导入/导出

- [x] 导入 XLSX
- [x] 导出 XLSX
- [x] 导入 CSV
- [x] 导出 CSV
- [x] 导出 PDF

### 其他功能

- [x] 暗黑模式
- [x] 国际化 (i18n)
- [x] 键盘快捷键
- [x] 上下文菜单
- [x] 数据验证
- [x] 条件格式

## 性能优化

### Web Workers

公式解析和求值在 Web Workers 中运行，以避免阻塞主线程：

- 带有嵌套函数的复杂公式
- 跨多个单元格的批量公式更新
- 循环依赖检测

### OffScreenCanvas

渲染操作被转移到 OffScreenCanvas：

- 大型电子表格渲染
- 滚动/缩放时的频繁重绘
- 后台渲染操作

### 高效更新

- 智能差异计算单元格变化
- 防抖渲染
- 选择性重绘受影响的区域

## API 参考

### 基本用法

```tsx
import { Excel } from 'excel-collab';
import 'excel-collab/style.css';

// 简单用法
<Excel style={{ height: '100vh' }} />

// 自定义配置
<Excel
  style={{ height: '100vh' }}
  menubarLeftChildren={<自定义菜单 />}
  toolbarChildren={<自定义工具栏 />}
  sheetBarChildren={<自定义工作表栏 />}
/>
```

### 控制器 API

访问控制器进行编程操作：

```tsx
import { useExcel } from 'excel-collab';

// 获取控制器实例
const { controller } = useExcel();

// 单元格操作
controller.setCellValue(range, value);
controller.getCellValue(range);

// 范围操作
controller.selectRange(range);
controller.copyRange(range);
controller.pasteRange(range);

// 工作表操作
controller.addSheet(name);
controller.deleteSheet(sheetId);
controller.renameSheet(sheetId, name);

// 公式操作
controller.setCellFormula(range, formula);
controller.computeFormulas();
```

### 事件处理

```tsx
controller.on('change', (changeSet) => {
  // 处理变化
});

controller.on('save', (json) => {
  // 处理保存
});
```

## 致谢

- [FormulaJS](https://github.com/formulajs/formulajs) 提供公式实现
- [Yjs](https://github.com/yjs/yjs) 提供协作支持
