# PROJECT ARCHIVE — 作品紹介・配布サイト

Astro 7.4.0 / TypeScriptで作った静的サイトです。YouTubeチャンネル「GAME DEV LAB」の作品紹介とZIP配布への案内に使えます。

公開先：https://aoi-gamelab.github.io/
リポジトリ：https://github.com/aoi-gamelab/aoi-gamelab.github.io
サンプル配布：https://github.com/aoi-gamelab/aoi-gamelab.github.io/releases/tag/v1.0.0

## 最初に見る場所

- `site.config.json`：サイト名、YouTube、GitHub、公開URLの設定。
- `src/content/projects/`：作品ごとのJSON。作品追加は基本的にここだけ編集します。
- `public/images/`：公開するサムネイル・スクリーンショット。
- `release-assets/`：GitHub Releasesへアップロードする、準備済みの配布ZIP。
- `.github/workflows/deploy.yml`：GitHub Pages自動デプロイ。
- `test-results/`：ローカルの確認結果。公開・ソースZIPの対象外です。

このフォルダーの中身を、一つのGitHubリポジトリのルートとして使います。動画制作フォルダー全体をアップロードする必要はありません。

## ローカルで起動する

Node.js 22.22以上（推奨：Node.js 24 LTS）とnpmを用意してください。

```sh
npm ci
npm run dev
```

通常は `http://127.0.0.1:4321/` が表示されます。停止はターミナルでCtrl+C。
このPCでは、`起動.cmd`のダブルクリックでも既存環境から起動できます。別PCでは先にNode.jsと`npm ci`が必要です。
このPCでは既存のNode.jsを使っています。npmコマンドがない場合は、作業フォルダーの一つ上にあるローカルnpmでも実行できます。

```sh
node ../tools/npm/package/bin/npm-cli.js run dev
```

ローカルnpmは別PCへ必須の配布物ではありません。通常のNode.jsインストールに付属するnpmを使えば、以降のコマンドをそのまま実行できます。

## ビルドと確認

```sh
npm test
npm run build
npm run preview
```

`npm run build`は型チェック → 静的HTML生成 → 生成済みリンクと画像の検査を実行します。出力先は`dist/`です。
`npm test`は検索、並び替え、関連作品、動画URL、Release URL、Pagesサブパス等を確認します。
`npm run release:check`は、公開先や配布URLの未設定を列挙します。設定が残っている間は終了コード1になりますが、ローカルプレビューやサイトのビルドは可能です。

## 新しい動画を投稿したあとの更新手順

1. 配布するサンプルをZIPにします。個人名を含むパス、秘密情報、`.vs`、`.user`、PDB、不要なビルド出力を除きます。
2. GitHub ReleasesにそのZIPをアップロードします（後述）。
3. `npm run new:project -- my-new-project`を実行します。英小文字・数字・ハイフンの名前を使います。
4. 作成された`src/content/projects/my-new-project.json`をテキストエディターで開きます。
5. タイトル、説明、カテゴリ、技術タグ、日付を入力します。
6. サムネイルとスクリーンショットを`public/images/`へ入れ、JSONにパスを設定します。
7. YouTubeの動画URLと、Releaseに添付したZIPそのもののURLを入力します。
8. `npm test`と`npm run build`を実行し、`npm run dev`で表示を確認します。
9. サイトの変更をGitHubのmainブランチへ反映します。Pagesの設定済みリポジトリならActionsが自動デプロイします。
10. 公開された作品詳細URLをYouTubeの概要欄へ貼ります。

作品データを追加すれば、一覧・詳細ページ・検索・タグ・新着・おすすめ・関連作品に自動反映されます。レイアウトコードを編集する必要はありません。

## 作品JSONの書き方

`new:project`コマンドは既存ファイルを上書きせず、空欄入りのひな型を生成します。既存の実作品JSONをコピーしても構いませんが、`slug`は必ず変えてください。

| 項目 | 設定内容 |
| --- | --- |
| slug | URLになる一意の名前。英小文字・数字・ハイフン。公開後の変更はリンク切れに注意。 |
| title / subtitle | 作品名 / 短い補足。 |
| description | 一覧とSEOに使う1〜2文の紹介。 |
| category | GAME / TOOL / EXPERIMENT / UI / OTHERのどれか。 |
| technologies | `["C++", "DxLib"]`など。新しい技術名は自由に追加できます。 |
| status | 公開中 / 配布準備中 / 開発中 / デモ。ダウンロードURLとは別に管理します。 |
| publishedAt / updatedAt | `2026-10-17`のようなYYYY-MM-DD。更新日は公開日以降。 |
| featured | `true`ならHOMEのおすすめへ（最大6件）。 |
| demo | 表示確認用の架空作品だけ`true`。その場合は動画・配布URLを空欄にします。 |
| thumbnail / heroImage | `/images/my-cover.webp`のように設定。`public`は書きません。 |
| screenshots | `[{"src":"/images/screen.webp","alt":"実行画面の説明"}]`。複数枚可能。 |
| overview | 作品概要の段落を文字列配列で指定。 |
| features / technicalNotes | 主な機能 / 技術メモを文字列配列で指定。 |
| youtubeUrl | 動画のURLまたは11文字の動画ID。未設定なら`""`。チャンネルURLはここへ入れません。 |
| downloadUrl | GitHub ReleasesのZIPアセットURL。準備中なら`""`。 |
| fileName | ZIPファイル名。 |
| fileSize | バイト数を数値で指定。KBやMBの単位は書きません。 |
| version | `1.0.0`など。先頭のvは表示時に付きます。 |
| platform / requirements | 対応OS / 必要な開発環境を文字列配列で指定。 |
| installationSteps | 導入手順を文字列配列で指定。自動的に番号が付きます。 |
| changelog | `[{"date":"2026-10-17","version":"1.0.0","changes":["変更内容"]}]`。 |

空文字・空配列でよい任意項目と、必須項目はContent Collectionsのスキーマで検査されます。URLが不正なら、壊れたリンクを公開する前にビルドが止まります。
未設定・存在しないローカル画像は共通プレースホルダーへ切り替えます。

## サムネイルとスクリーンショット

`public/images/`へ置きます。サムネイルは16:9、1200×675や1280×720が目安です。WebP/JPG/PNG/SVGを利用できます。
一覧の画像は遅延読み込み。幅と高さを確保し、読み込み前後のずれを抑えています。
スクリーンショットはクリックで拡大、左右キーで切り替え、Escで閉じます。閉じた後は元のボタンへフォーカスが戻ります。
サイトに人物の実名やローカルPCの保存先を入れないでください。配布サイト用の画像は、個人情報を除いた素材から用意しています。

## YouTube動画の登録

作品JSONの`youtubeUrl`に、通常の動画URL、youtu.be短縮URL、Shorts URL、埋め込みURL、または11文字の動画IDを指定できます。
空欄なら動画セクションも動画ボタンも表示しません。
視聴者が再生を押すまではYouTubeのiframeを読み込みません。クリック後にyoutube-nocookie.comのプレイヤーを表示します。
チャンネル全体のURLは`site.config.json`の`youtubeUrl`で変更します。

## GitHub ReleasesへZIPをアップロードする

1. サンプル配布先にするGitHubリポジトリを開きます。サイトと同じリポジトリでも、別の公開リポジトリでも構いません。
2. Releases → Create a new releaseを開きます。
3. タグ（例：`dxlib-move-v1.0.0`）、タイトル、変更内容を入力します。
4. 添付ファイル欄に配布用ZIPを追加します。
5. 内容と添付ファイルを確認して、Publish releaseを押します。これは外部公開の操作です。
6. 公開されたReleaseのAssetsにあるZIPリンクをコピーします。
7. 作品JSONの`downloadUrl`へ貼り、`fileName`・`fileSize`・`version`も合わせます。

URLは`https://github.com/<所有者>/<リポジトリ>/releases/download/<タグ>/<ZIP名>.zip`の形式です。Releaseの紹介ページやリポジトリトップのURLではありません。ここで示した山括弧の例をそのまま設定しないでください。

バイト数を調べる例（PowerShell）：

```powershell
(Get-Item -LiteralPath 'release-assets/dxlib-move-circle-v1.0.0.zip').Length
```

既存の2作品分は`release-assets/`に準備済みです。動画制作テンプレートは視聴者向けサンプルに含めていません。
同じURLのファイルを黙って差し替えるより、新しいバージョンのReleaseを作って更新履歴を残す運用を推奨します。

## GitHub Pagesで無料公開する

無料運営は、GitHub Freeの公開リポジトリと、同梱ワークフローの標準ubuntu-latestランナーを前提にしています。有料API・DB・独自ドメインの購入は不要です。

1. GitHubでサイト用のPublicリポジトリを作ります。公開してよいサイトファイルだけを入れてください。
2. `website/`の中身がリポジトリ直下に来るようにします。package.json、src、public、.github等を一緒に登録します。
3. `site.config.json`の`deployment.githubOwner`と`deployment.githubRepository`を設定します。GitHub Actions上では`GITHUB_REPOSITORY`から自動取得もできます。
4. `site.config.json`の`githubUrl`を公開リポジトリのURLに変更します。
5. リポジトリのSettings → Pages → Build and deployment → SourceでGitHub Actionsを選びます。
6. mainブランチへサイトファイルをpushするか、Actionsからワークフローを実行します。
7. Actionsが成功したら、PagesのURLを開き、HOME・作品詳細・画像・ZIPのリンクを確認します。

同梱のワークフローはAstro公式のGitHub Pages向け手順に基づき、チェック・ビルド後にデプロイします。今回はGitHubへ接続・push・公開していません。

### サブパスとURL

通常のリポジトリなら`https://<所有者>.github.io/<リポジトリ>/`になります。`<所有者>.github.io`という特別なリポジトリならルート公開になります。この違いは自動判定します。
サイト内リンク、画像、CSS、sitemap等はbaseに対応しています。内部リンクを追加するときは`pathTo()`を使い、`/projects/`のような固定パスを新しく直書きしないでください。

必要なら環境変数`SITE_URL`（オリジンのみ）と`BASE_PATH`で上書きできます。独自ドメインでは`SITE_URL`へそのオリジン、`BASE_PATH`へ`/`を設定します。
GitHub Actionsで使う場合はSettings → Secrets and variables → ActionsのVariablesへ設定できます。秘密鍵は不要です。
公開先が未設定のローカルビルドはlocalhostを使い、検索エンジン向けにnoindexとDisallowを出します。公開先が設定されたビルドではcanonical、OG URL、sitemapが実際の公開URLへ切り替わります。

### 今回、まだ未設定の項目

- 各動画の個別URL（チャンネルURLは設定済み）。

GitHubのユーザー名・リポジトリ名と2作品のReleaseアセットURLは設定済みです。

準備中のZIPリンクをクリック可能にしたり、架空の動画を埋め込んだりしていません。

## サイト名・ロゴ・リンクを変える

`site.config.json`で設定します。

- `name`：仮ロゴとして表示するサイト名。
- `channelName`：フッター等の表示名。
- `description`：標準の説明文。
- `youtubeUrl` / `githubUrl`：外部リンク。空欄は準備中表示または非表示。
- `logo`：空欄は自作の図形ロゴ。画像を使う場合は`/images/logo.png`等。
- `ogImage`：標準のOGP画像。PNG/JPGを推奨。
- `showDemoProjects`：`false`にすると4件のデモ作品をサイト全体から除外します。

デモデータは、サンプルであることをカード・詳細ページの両方に表示しています。実作品を増やしたら、非表示にするか該当JSONを整理してください。
画像・フォントの出典は`ASSETS.md`に記載しています。

## ファイル構成

```text
site.config.json              サイト設定
astro.config.mjs              静的ビルド・Pagesのbase設定
src/content.config.ts         作品データの型と検証
src/content/projects/*.json   作品ごとの情報
src/pages/                   HOME・一覧・詳細・ABOUT・404・SEO
src/components/              ブランド・カード・アイコン
src/styles/global.css        共通デザイン・レスポンシブ
lib/                         検索・URL・関連作品・公開先の共通処理
scripts/                     ビルド検査・作品追加・公開前チェック
tests/                       動作ロジックのテスト
public/                      公開画像・favicon
release-assets/              Releaseアップロード用ZIP（Git管理対象外）
.github/workflows/deploy.yml  Pages自動デプロイ
```

100作品以上でも、作品情報は1作品1JSONのまま管理できます。表示時の検索はブラウザ内で完結し、APIやDBは使いません。

## 検証と限界

型チェック、本番ビルド、生成済みページとローカルリンク、検索等の単体テストに加え、375・768・1440pxのブラウザ表示と操作を検証します。詳細な実行結果は`test-results/`に保存します。
GitHub Actions上の本番デプロイと、未設定のRelease URLのダウンロードは、実際の公開先が決まるまで未確認です。
外部サービス側の表示名・画面構成・利用条件は変更されることがあります。

## 公式資料

- Astro Content Collections：https://docs.astro.build/en/guides/content-collections/
- Astro GitHub Pages公開：https://docs.astro.build/en/guides/deploy/github/
- GitHub Pages：https://docs.github.com/en/pages/getting-started-with-github-pages
- GitHub Actions料金：https://docs.github.com/en/actions/concepts/billing-and-usage

確認日：2026年10月17日。
