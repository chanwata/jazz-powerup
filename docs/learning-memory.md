# GitHub Learning Memory — 個人適応・学習メモ連携

## 仕組み

公開教材 `chanwata/jazz-powerup` は静的 GitHub Pages。メモの原本は従来どおりユーザーのブラウザの localStorage (`after-parker-v1`) にある。

各レッスンには、メモの語句、理解度の自己申告、クイズの誤答、練習済みチェックから次の説明と課題を選ぶローカルの適応パネルがある。これは定型ルールによる切り替えであり、文脈を意味論的に理解するAIや、利用者の技能を測るモデルではない。

利用者が希望するときだけ、別の **private** リポジトリ `chanwata/jazz-powerup-memory` の `learning/state.json` に進捗を同期できる。公開教材のGitHubリポジトリには個人メモをpushしない。

## ユーザーの初回作業

1. https://github.com/new からOwner `chanwata`、リポジトリ名 `jazz-powerup-memory`、Visibility **Private**、READMEを追加して作成（default branch は `main`）。
2. https://github.com/settings/personal-access-tokens/new で Fine-grained PATを作る。Repository access `Only select repositories` で `jazz-powerup-memory` **のみ**を選ぶ。Repository permissions は `Contents: Read and write`（Metadata: Read はGitHubが設定）。有効期限を短くする。
3. Jazz Powerupの「学習ログ」でPATを入力し、「安全性を確認して接続」を押す。アプリはGitHub REST APIで、保存先の `private:true` とOwner名を検証する。
4. 「↑ この端末からGitHubへ保存」を押す。初回のみファイルを作成し、次回からGitHubのblob SHAを比較する。GitHub側に未取得の変更があれば、上書きを拒否する。
5. 別端末ではPATで接続し「GitHubの履歴を取り込む」。明示的な確認のうえでローカル進捗を置き換える。置換の直前にバックアップJSONを書き出すことを試みる。バックアップを事前に「索引」から手動保存することも推奨。

PATは実行中のタブのJS変数だけに保持し、localStorage・JSONエクスポート・GitHubリポジトリには保存しない。Tokenは共有しないこと。個人的な学習メモはprivateリポジトリ内で**平文**であるため、GitHub、許可されたGitHubアプリ、共同編集者からは読み取り可能。完全なエンドツーエンド暗号化ではない。PATは設定画面でいつでも失効可能。

GitHub Contents APIに準拠： `GET /repos/chanwata/jazz-powerup-memory`（private確認）、`GET/PUT /repos/chanwata/jazz-powerup-memory/contents/learning/state.json`、GET `learning/tutor-feedback.json`。対象パスはソース内で固定し、任意のホストにPATを送らない。

## ChatGPTが学習メモを読み教材を更新する

1. ユーザーが上記の保存操作で学習記録を同期する。
2. ChatGPTのGitHub連携アプリが `chanwata/jazz-powerup-memory` というprivate repoの読み書き権限を持つよう、GitHub Appインストール設定でRepository accessを調整する（必要な場合）。**Webサイトに入力したPATはChatGPTには共有されない。**
3. ユーザーが「学習ログ」のコピーボタンで指示を取得し、ChatGPTへ送信する。
4. ChatGPTはGitHubから `learning/state.json` を読み、メモ・達成・誤答から個別解説を執筆。`learning/tutor-feedback.json` に書き戻す。**専用のprivate repoのみを操作**し、教材のpublic repoに私的情報を書かない。
5. Webアプリの「講師コメントを取得」を押すと、その個別解説が教材各章の冒頭に表示される。レッスン本文の史実・音源出典など、固定資料は書き換えない。

出力形式（`learning/tutor-feedback.json`）：

```json
{
  "version": 1,
  "lessons": {
    "01": {
      "title": "半音解決を耳で理解する",
      "explanation": "Dm7のFは3度、G7では7度。そのFがCmaj7のEに半音で解決します。",
      "listening": "上声F3→E3を固定して、ベースD2→G2→C2を歌いながら再生。",
      "bassTask": "テンポ72、Dm7→G7→Cmaj7を3回。まずルート、次に3度から入る。",
      "question": "G7のFをCmaj7でEに下げると何が変わった？",
      "updatedAt": "2026-10-11T12:00:00Z"
    }
  }
}
```

講師コメントはHTMLを許可せず、プレーンテキストとして安全に表示する。新しいAI生成は、現在自動ではない。GitHub ActionsでAIを自動実行するには、別途API利用料金・秘密鍵・モデル接続・データ取り扱いに同意した構成が必要で、初版では有効化していない。

## 安全性と制約

- private repositoryが存在しなければ同期できない。公開repoに誤保存するフォールバックはない。
- ブラウザからの同期には、本人が限定スコープのPATを入力する必要がある。GitHubのChatGPTプラグインへの接続とは別。
- GitHub側のblob SHAが、最後にこの端末が確認したSHAと違えば書き込みを拒否。機械的な自動マージや上書きはしない。
- 自動同期の常駐処理は行わない。保存と読込ボタンは明示的な利用者操作。
- 別端末から取り込む際の安全なマージは未実装。取り込む前にバックアップを確認する。
- GitHub APIへのfetchとブラウザ環境でのPATによる実通信の動作は、非公開リポジトリ作成後にユーザー実機で検証する必要がある。

## Token接続の404切り分け（2026-10-12）

GitHubのプライベートリポジトリ取得API (`GET /repos/chanwata/jazz-powerup-memory`) は認可されないTokenに404を返すことがある。リポジトリ不存在とは限らない。サイトはこの404のときだけ、同じTokenでGitHub公式 `GET /user` を呼び、公開されているログイン名だけでアカウントの取り違えを診断する。Tokenの値、メールアドレス、プロフィールなどは表示・保存・GitHubへコミットしない。

- 認証ユーザーが `chanwata` 以外：ブラウザで正しいGitHubアカウントに切り替え、そのアカウントからTokenを作る。
- 認証ユーザーが `chanwata`：Fine-grained TokenのResource owner、Selected repositories、Contents Read and writeを再確認。
- 認証ユーザーが取得できない：Token自体の有効性、期限、コピー時の混入文字などをチェック。

`jazz-powerup-memory` は既にPrivateで作成され、`main` ブランチも存在している。404を回避するために公開設定を変更してはならない。
