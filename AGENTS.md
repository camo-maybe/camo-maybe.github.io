# camo-maybe.github.io - AGENTS.md

## 1. 概要

個人ポートフォリオサイト（`camo-maybe.github.io`）。経歴・スキル・実績を公開する静的サイト。
Excel のキャリア管理シートを Python で JSON 化し、Next.js（静的エクスポート）で描画して GitHub Pages に配信する。

## 2. 構造

| ディレクトリ | 役割 |
|---|---|
| `src/app/` | App Router ページ・レイアウト・グローバル CSS |
| `src/components/` | UI コンポーネント（Hero / ProjectCard / Footer / SkillBadge / StatsCharts / Timeline 等） |
| `src/data/` | コンテンツ JSON（`projects.json` / `skills.json` / `experience.json` / `stats.json`） |
| `src/types.ts` | TypeScript 型定義 |
| `scripts/` | `extract_skills.py`（Excel キャリアシート → `src/data/` の JSON 群を自動生成） |
| `public/` | 静的アセット（SVG アイコン等） |
| `.github/workflows/` | `deploy.yml`（GitHub Pages への CI/CD） |

## 3. 規約参照

- [共通憲法 (AGENTS.md)](../AGENTS.md): ワークスペース全体の行動規範・基本原則
- [コーディング規約](../coding-standards/): 言語共通および詳細規約

（AWS リソースは利用しないため `AWS_GUIDELINES.md` の参照は不要）

## 4. 開発ルール

- **コンテンツの単一の正**: ポートフォリオ内容は `src/data/*.json`。コンポーネントに直書きしない。
- **データ生成**: `skills.json` / `experience.json` / `stats.json` は `scripts/extract_skills.py` の出力。手編集せず元 Excel を更新して再生成する（`projects.json` は手動管理）。
- **静的エクスポート前提**: `next.config` は `output: "export"` / `images.unoptimized: true`。SSR/Route Handler 等のサーバー機能は使わない。
- **デプロイ**: `main` への push で GitHub Actions が `out/` をビルドして Pages へ公開。手動 push しない。

## 5. コマンド

| 用途 | コマンド | 備考 |
|---|---|---|
| 開発サーバー | `npm run dev` | http://localhost:3000 |
| ビルド（静的エクスポート） | `npm run build` | `out/` を生成 |
| Lint | `npm run lint` | ESLint |
| データ再生成 | `python scripts/extract_skills.py` | Excel → `src/data/` JSON |
| デプロイ | （`main` push → `deploy.yml`） | GitHub Pages 自動公開 |
