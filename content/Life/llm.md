---
title: LLM
tags:
  - education
---

## 什么是 LLM

LLM（Large Language Model，大语言模型）是基于 Transformer 架构、通过海量文本数据训练的深度学习模型，能够理解和生成自然语言。

### 核心概念

| 概念           | 说明                                                       |
| -------------- | ---------------------------------------------------------- |
| Token          | 模型处理文本的最小单位，中文约 1 字 ≈ 1-2 token            |
| Context Window | 单次对话能处理的 token 上限（如 Claude 200K、GPT-4o 128K） |
| Temperature    | 控制输出随机性，0 = 确定性强，1 = 创造性强                 |
| System Prompt  | 设定模型角色和行为的指令                                   |
| RAG            | 检索增强生成，让模型基于外部知识库回答                     |
| Fine-tuning    | 用特定数据微调模型以适应垂直场景                           |
| Agent          | 具备工具调用和多步推理能力的 AI 系统                       |
| MCP            | Model Context Protocol，标准化的模型-工具交互协议          |

### 模型能力演进

```txt
GPT-3 (2020) → 涌现能力
ChatGPT (2022.11) → 对话式交互
GPT-4 (2023.3) → 多模态
Claude 3 (2024.3) → 长上下文 (200K)
Claude 4 / GPT-4o (2025) → Agent / 工具调用 / 推理增强
```

## 主流模型对比

| 模型               | 厂商      | 特点                       | 适用场景         |
| ------------------ | --------- | -------------------------- | ---------------- |
| Claude Opus/Sonnet | Anthropic | 长上下文、代码能力强、安全 | 编程、分析、写作 |
| GPT-4o             | OpenAI    | 多模态、生态丰富           | 通用、创意、视觉 |
| Gemini             | Google    | 多模态、搜索集成           | 搜索增强、多模态 |
| DeepSeek           | DeepSeek  | 开源、推理能力强、性价比高 | 编程、数学推理   |
| Llama              | Meta      | 开源、可本地部署           | 隐私场景、定制化 |
| Qwen               | 阿里      | 中文优秀、开源             | 中文场景         |

### 视频/图像生成模型

| 模型       | 厂商       | 能力         |
| ---------- | ---------- | ------------ |
| SORA       | OpenAI     | 文字生成视频 |
| Midjourney | Midjourney | 文字生成图像 |
| Veo        | Google     | 视频生成     |
| 可灵       | 快手       | 视频生成     |

![[llm 2024.excalidraw|600]]

## 如何高效使用 LLM

### Prompt 工程要点

1. **明确角色**：告诉模型它是谁（"你是一个资深前端工程师"）
2. **结构化指令**：用 Markdown 列表、分隔符组织复杂需求
3. **提供示例**：Few-shot，给出输入→输出样例
4. **限定输出格式**：要求 JSON / 表格 / 代码块等特定格式
5. **分步思考**：对复杂问题要求 "step by step" 推理
6. **迭代优化**：根据输出不断调整 prompt

### 实用技巧

- **长文档处理**：利用长上下文窗口，直接把文档/代码贴入对话
- **多轮对话**：复杂任务拆成多轮，逐步深入
- **对比验证**：重要结论用不同模型交叉验证
- **版本记录**：好的 prompt 要保存，方便复用和迭代

## 工具与工作流

### Claude Code #claude

> CLI 工具，让 Claude 直接操作本地文件、执行命令

- 更新版本：`claude update`
- 进入对话：`claude`
- 非交互模式：`claude -p "你的问题"`
- 继续上次对话：`claude --continue`

#### Skills

- [Obsidian Skills](https://github.com/kepano/obsidian-skills) for Obsidian
- [frontend-slides](https://github.com/zarazhangrui/frontend-slides) for PPT
- [新领域的研究](https://github.com/KKKKhazix/khazix-skills)

### MCP（Model Context Protocol）

> 标准化协议，让 LLM 连接外部工具和数据源

常见 MCP Server：

- **Todoist** — 任务管理
- **Jira** — 项目管理
- **GitHub** — 代码仓库操作
- **Filesystem** — 文件读写
- **Web Search** — 联网搜索

### 其他实用工具

| 工具                                     | 用途                   |
| ---------------------------------------- | ---------------------- |
| [ChatGPT](https://chat.openai.com/)      | OpenAI 官方对话界面    |
| [Claude](https://claude.ai/)             | Anthropic 官方对话界面 |
| [Cursor](https://cursor.sh/)             | AI 增强代码编辑器      |
| [Perplexity](https://perplexity.ai/)     | AI 搜索引擎            |
| [NotebookLM](https://notebooklm.google/) | 基于文档的 AI 问答     |
| [Stitch](https://stitch.withgoogle.com/) | UI AI 设计             |

## OpenClaw #openclaw

> 用于高效运行大模型(LLM)或AI模型的底层系统，让 LLM 更快、更稳、更省

### 核心能力

1. **统一算力调用**（异构计算）
2. **Kernel / 算子调度优化**
3. **内存与带宽优化**
4. **模型执行图优化**

### 与相机 Pipeline 的类比

| 相机 Pipeline         | LLM Pipeline      |
| --------------------- | ----------------- |
| ISP / Algo node       | Transformer block |
| buffer queue          | tensor            |
| stream config         | execution graph   |
| tuning / latency 优化 | kernel 优化       |

```bash
powershell -c "irm https://openclaw.ai/install.ps1 | iex"  # 安装
npm install -g openclaw

# 1. 卸载 CLI
npm uninstall -g openclaw

# 2. 删除本地数据
Remove-Item -Recurse -Force "$env:USERPROFILE\.openclaw" -ErrorAction SilentlyContinue

# 3. 验证
where.exe openclaw
```

## 学习路线

```mermaid
graph LR
  A[基础概念] --> B[Prompt 工程]
  B --> C[工具使用]
  C --> D[Agent 开发]
  D --> E[模型微调/部署]
```

1. **入门**：理解 Token、Context、Temperature 等基本概念
2. **应用**：掌握 Prompt 技巧，熟练使用 ChatGPT / Claude
3. **进阶**：使用 Claude Code / Cursor 等工具提升工作效率
4. **深入**：了解 RAG、MCP、Agent 架构
5. **专业**：模型微调、本地部署、推理优化

## Todoist #todoist

[GitHub - Doist/todoist-cli: Command-line interface for Todoist · GitHub](https://github.com/Doist/todoist-cli)

```bash
# login
td auth login

td add "Buy milk tomorrow #Shopping"   # quick add with natural language
td today                               # tasks due today + overdue
td inbox                               # inbox tasks
td task list                           # all tasks
td task list --project "Work"          # tasks in project
td project list                        # all projects
td task view https://app.todoist.com/app/task/buy-milk-8Jx4mVr72kPn3QwB  # paste a URL
```
