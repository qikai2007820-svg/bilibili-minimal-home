# bilibili シンプルホーム

[简体中文](README.md) · [English](README.en.md) · **日本語**

Bilibili のトップページを検索中心のシンプルな画面にする、Chrome・Edge 向けの非公式拡張機能です。サイト標準の検索機能とアカウントメニューはそのまま利用できます。

> このプロジェクトは Bilibili と提携しておらず、公式の拡張機能ではありません。

## 画面プレビュー

| ライトモード | ダークモード |
| --- | --- |
| ![ライトモードのシンプルなトップページ](store-assets/screenshot-1280x800.png) | ![ダークモードのシンプルなトップページ](store-assets/screenshot-dark-1280x800.png) |

## 主な機能

- `https://www.bilibili.com/` のトップページだけを変更し、その他のページは元の表示を維持します。
- おすすめ一覧、バナー、チャンネルナビゲーションを非表示にし、サイト標準の検索欄、検索履歴、候補表示、アカウントメニューを残して配置し直します。
- 検索メニューの急上昇ワードを非表示にします。検索履歴がない場合は空のメニューも表示しません。
- ブラウザーのライト・ダーク設定に追従します。標準の部品が読み込まれない場合は、8 秒後に元のページを表示します。

検索入力、候補表示、検索先への移動は引き続き Bilibili が処理します。この拡張機能独自のアカウント、アクセス解析、ネットワーク通信はありません。

## ダウンロードとインストール

[GitHub Releases から v1.2.2 の ZIP をダウンロード](https://github.com/qikai2007820-svg/bilibili-minimal-home/releases/download/v1.2.2/bilibili-minimal-home-1.2.2.zip)し、展開してから：

1. Chrome で `chrome://extensions/`、または Edge で `edge://extensions/` を開きます。
2. **デベロッパーモード**を有効にし、**パッケージ化されていない拡張機能を読み込む**を選びます。
3. **`manifest.json` が直下にある**フォルダーを選びます。
4. Bilibili のトップページを開くか再読み込みします。

このリポジトリをダウンロードして、[`bilibili-minimal-home`](bilibili-minimal-home/) フォルダーを読み込むこともできます。デバッグ方法は同フォルダーの [README](bilibili-minimal-home/README.md) を参照してください。

## プライバシーと互換性

拡張機能はページ構造と現在の URL をブラウザー内で確認します。検索欄の入力内容やアカウント情報を読み取らず、保存・送信もしません。詳しくは[プライバシーポリシー](https://qikai2007820-svg.github.io/bilibili-minimal-home/store-assets/privacy-policy.html)をご覧ください。

表示は Bilibili の現在のページ構造に依存します。サイトの更新後に動作しなくなった場合は、Issue でお知らせください。
