[English](./README.md) | [中文](./README.zh-CN.md)

# Timbre — TTS 推理

基于 [CrispASR](https://github.com/CrispStrobe/CrispASR)（C++ ggml 推理引擎）的语音合成与声音克隆工具，配有 Next.js Web 界面。

<p align="center">
  <img src="docs/screen1.png" alt="Timbre Screenshot 1" width="450">
  <img src="docs/screen2.png" alt="Timbre Screenshot 2" width="450">
</p>

## 目录结构

```
.
├── bin/            # crispasr 可执行文件（已加入 .gitignore，由 setup 下载）
├── model/          # GGUF 权重文件（已加入 .gitignore，由 setup 下载）
├── scripts/        # CrispASR CLI 配置与提示词文本（已加入 .gitignore）
├── Makefile        # 本地手动生成用的 CLI 命令
└── web/            # Next.js 应用（界面 + /api/generate 路由）
```

## 环境准备

需要 `crispasr` 可执行文件以及 GGUF 模型文件，运行以下命令获取：

```bash
cd web
bun run setup
```

该脚本会根据当前平台下载最新的 `crispasr` release 二进制文件，并从 Hugging Face 拉取所需模型到 `../bin` 和 `../model` 目录。可重复运行，已存在的文件会自动跳过。

所需模型：

| 文件                                 | 后端                  | 用途               |
| ------------------------------------ | --------------------- | ------------------ |
| `chatterbox-turbo-t3-q8_0.gguf`      | `chatterbox-turbo`    | 英文语音合成       |
| `chatterbox-turbo-s3gen-q8_0.gguf`   | `chatterbox-turbo`    | 英文语音合成 codec |
| `qwen3-tts-12hz-1.7b-base-q8_0.gguf` | `qwen3-tts-1.7b-base` | 多语言语音合成     |
| `ggml-base.bin`                      | `whisper`             | 参考音频转录       |

## Web 应用

```bash
cd web
bun install
bun run dev
```

- `src/app/[locale]` — App Router 页面，通过 `next-intl` 实现多语言（`en`/`zh`）
- `src/app/api/generate/route.ts` — 以子进程方式调用 `crispasr`
- `src/components/landing` — hero 区域与工作台界面
- `src/lib/tts-config.ts` — 模型 ID、后端配置、各模型输入长度限制

API 路由在启动 `crispasr` 进程前会先检查 `bin/crispasr` 及配置的模型文件是否存在，若缺失会直接返回明确的错误提示（提醒运行 `bun run setup`），而不会尝试即时下载。

## 命令行（手动 / 调试用）

根目录 `Makefile` 提供了直接调用 `crispasr` 的命令，例如：

```bash
make run   # 使用 chatterbox-turbo，基于 input/dj.wav 克隆声音进行英文合成
make tr    # 使用 whisper 转录 input/johnlee.wav
```

各后端所需的完整参数请查看 `Makefile`。

## 测试结果

### 单语英文

- Chatterbox Turbo

### 多语言

- Darwin TTS
- Qwen3 TTS

### 探索中

- VoxCPM2 — 支持纯文本音色设计
- Qwen3 TTS — 支持音色设计
