# Realtime Sync Todo

React + TypeScript + Socket.IO で作る、リアルタイム共同編集 TODO の MVP です。

## 使用している主なフレームワーク

- Frontend: React 18, TypeScript, Vite
- Realtime: Socket.IO / socket.io-client
- UI Icons: lucide-react
- Server runtime: Node.js, tsx
- Dev tooling: concurrently

## アーキテクチャ

### Frontend

`src` は MVVM と Atomic Design を合わせた構成です。

- `viewModels`: 画面状態、Socket.IO 接続、楽観的更新、競合解決などの振る舞い
- `models`: ID、時刻、タスク操作、ユーザープロファイルなどの純粋な処理
- `services`: Socket.IO クライアント生成
- `components/atoms`: ボタン、バッジ、接続表示などの最小 UI
- `components/molecules`: タスクカード、入力フォーム、メタ情報などの小さな組み合わせ
- `components/organisms`: タスクリスト、サイドパネル、競合モーダルなどの画面単位 UI
- `components/templates`: ViewModel を UI に流し込むページレイアウト
- `pages`: ページ単位の View

### Server

`server` は薄いレイヤードアーキテクチャです。

- `domain`: バリデーション、パッチ適用、初期タスク、競合データ生成
- `repositories`: メモリ上のタスク、ユーザー、編集中状態の保存
- `services`: presence と task のユースケース
- `socket`: Socket.IO のイベント登録
- `http`: `/health` と基本レスポンス

## セットアップ

```bash
npm install
npm run dev
```

- フロントエンド: http://localhost:5173
- Socket.IO サーバー: http://localhost:3001
- ヘルスチェック: http://localhost:3001/health

## 試し方

1. `npm run dev` を起動します。
2. ブラウザで http://localhost:5173 を複数タブ開きます。
3. 片方のタブでタスクを追加、編集、完了、削除すると、もう片方にも同期されます。
4. 同じタスクを古い状態から編集すると、バージョン差分により競合モーダルが表示されます。

タスクと presence はサーバーのメモリに保存されるため、サーバー再起動で初期状態に戻ります。
