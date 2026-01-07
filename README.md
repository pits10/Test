# Next.js プロジェクト

Next.js (App Router) + TypeScript + Tailwind CSS で作成されたプロジェクトです。

## 技術スタック

- **Next.js 15** - App Router
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 3**
- **ESLint** - コード品質管理

## プロジェクト構成

```
├── src/
│   └── app/           # App Router ディレクトリ
│       ├── layout.tsx # ルートレイアウト
│       ├── page.tsx   # トップページ
│       └── globals.css # グローバルスタイル
├── package.json
├── tsconfig.json      # TypeScript 設定
├── tailwind.config.ts # Tailwind CSS 設定
└── next.config.ts     # Next.js 設定
```

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認してください。

## 利用可能なスクリプト

- `npm run dev` - 開発サーバーを起動
- `npm run build` - 本番用にビルド
- `npm run start` - 本番サーバーを起動
- `npm run lint` - ESLint でコードチェック

## 開発を始める

`src/app/page.tsx` を編集すると、ページの内容を変更できます。
ファイルを保存すると自動的にページが更新されます。
