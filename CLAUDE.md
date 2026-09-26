# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code 向けのガイドです。

## プロジェクト概要

- **プロジェクト名**: realestate-app
- **概要**: Supabase 認証付きの不動産管理 Web アプリ。ログインすると自分が登録した物件を一覧・登録・編集・削除できる。

## コミュニケーション

- 返答・説明・コミットメッセージの本文は**必ず日本語**で書くこと。
- コード内のコメントも日本語で書くこと。

## 技術スタック

- React + Vite（JavaScript）
- React Router（画面遷移）
- Supabase（`@supabase/supabase-js`、メールアドレス＋パスワード認証）

## 環境変数

- Supabase の接続情報は `.env` に書く（`.gitignore` 済みなのでコミットしない）。
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
- 必要な変数の一覧は `.env.example` にある。

## ディレクトリ構成

- `src/lib/supabaseClient.js` … Supabase クライアント
- `src/contexts/AuthContext.jsx` … ログイン状態の共有（`useAuth` フック）
- `src/components/ProtectedRoute.jsx` … 未ログイン時にログイン画面へリダイレクトする処理
- `src/lib/propertiesApi.js` … 物件テーブルの CRUD 処理
- `src/components/PropertyForm.jsx` … 物件の入力フォーム（新規登録・編集で共用）
- `src/pages/` … 各画面（ログイン、会員登録、物件一覧）
- `supabase/schema.sql` … テーブル・RLS ポリシーの定義（Supabase の SQL Editor で実行する）

## データベース

- `properties` テーブル：物件名（name）、家賃（rent）、エリア名（area）、間取り（layout）、登録者（user_id）
- RLS 有効。自分が登録した物件のみ表示・登録・編集・削除できる。
- スキーマを変更したら `supabase/schema.sql` も更新すること。

## 開発コマンド

- 依存関係のインストール: `npm install`
- 開発サーバー起動: `npm run dev`
- ビルド: `npm run build`
- テスト実行: 未整備

## Git運用ルール

- **コードを変更するたびに、コミットして GitHub にプッシュすること。**
  - 1つの変更（機能追加・修正など）が完了したら、その都度 `git add` → `git commit` → `git push` を行う。
  - 変更をローカルに溜め込まない。
- コミットメッセージは日本語で、変更内容が分かるように簡潔に書く。
  - 例: `物件一覧画面を追加`、`検索フォームのバリデーションを修正`
- プッシュ前に、テストやビルドが用意されている場合は実行し、失敗していないことを確認する。
- 秘密情報（APIキー、パスワード、`.env` ファイルなど）は絶対にコミットしない。`.gitignore` で除外すること。
- `git push --force` などの履歴を書き換える操作は、ユーザーの明示的な指示がない限り行わない。
