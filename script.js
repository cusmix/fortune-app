// 運勢と、その運勢に合ったメッセージをまとめます。
const fortunes = [
  { name: "大吉", message: "すてきなチャンスが訪れそう。思い切って一歩！" },
  { name: "中吉", message: "いつもの頑張りが実を結びそうな一日です。" },
  { name: "小吉", message: "身近なところに、小さな幸せが見つかりそう。" },
  { name: "吉", message: "自分のペースで、穏やかな一日を楽しんで。" },
  { name: "末吉", message: "焦らず進めば、少しずつ良い流れになりそう。" },
  { name: "凶", message: "今日はひと休みも大切。無理せず過ごしてね。" },
];
const luckyColors = ["赤", "青", "黄色", "緑", "ピンク", "白"];
const luckyItems = ["ハンカチ", "本", "マグカップ", "ペン", "腕時計", "お気に入りの靴"];

// HTMLから、ボタンと結果を表示する要素を取得します。
const fortuneButton = document.getElementById("fortune-button");
const fortuneResult = document.getElementById("fortune-result");
const fortuneDetails = document.getElementById("fortune-details");
const fortuneMessage = document.getElementById("fortune-message");
const luckyColor = document.getElementById("lucky-color");
const luckyItem = document.getElementById("lucky-item");
const confetti = document.getElementById("confetti");
let confettiTimer;
const nicknameFields = document.getElementById("nickname-fields");
const nicknameInput = document.getElementById("nickname");
const nicknameError = document.getElementById("nickname-error");
const fortuneDescription = document.getElementById("fortune-description");
const resetButton = document.getElementById("reset-button");
// 最初の文言を保存し、やり直すときに同じ表示へ戻します。
const initialDescription = fortuneDescription.textContent;
const initialResult = fortuneResult.textContent;

// 配列の中から、ランダムに1つ選ぶ共通の関数です。
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function showConfetti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#d7ad54", "#729b82", "#d88b94", "#83a9ca"];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = pickRandom(colors);
    piece.style.animationDelay = `${Math.random() * 0.6}s`;
    confetti.appendChild(piece);
  }
  // アニメーション終了後に、使い終わった紙吹雪を片付けます。
  confettiTimer = window.setTimeout(() => confetti.replaceChildren(), 3300);
}

fortuneButton.addEventListener("click", () => {
  // 空白だけの入力も未入力として扱い、抽選前に処理を止めます。
  const nickname = nicknameInput.value.trim();
  if (!nickname) {
    nicknameError.textContent = "ニックネームを入力してください";
    nicknameInput.setAttribute("aria-invalid", "true");
    nicknameInput.focus();
    return;
  }

  // 絵文字や結合文字も、見た目の1文字として数えます。
  const nicknameLength = Array.from(
    new Intl.Segmenter("ja", { granularity: "grapheme" }).segment(nickname)
  ).length;
  if (nicknameLength > 10) {
    nicknameError.textContent = "ニックネームは10文字以内で入力してください";
    nicknameInput.setAttribute("aria-invalid", "true");
    nicknameInput.focus();
    return;
  }

  nicknameError.textContent = "";
  nicknameInput.removeAttribute("aria-invalid");
  // 入力をHTMLとして解釈せず、文字として安全に表示します。
  fortuneDescription.textContent = `${nickname}の今日は、どんな一日？`;
  nicknameFields.hidden = true;

  // 連続で押された場合は、前回の紙吹雪とタイマーをリセットします。
  window.clearTimeout(confettiTimer);
  confetti.replaceChildren();
  const fortune = pickRandom(fortunes);
  fortuneResult.textContent = fortune.name;
  // CSSが運勢に合う背景色を選べるよう、結果欄に運勢を記録します。
  fortuneResult.dataset.fortune = fortune.name;
  fortuneResult.classList.add("is-revealed");
  fortuneMessage.textContent = fortune.message;
  luckyColor.textContent = pickRandom(luckyColors);
  luckyItem.textContent = pickRandom(luckyItems);
  fortuneDetails.hidden = false;
  // 大吉の場合だけ、お祝いの紙吹雪を表示します。
  if (fortune.name === "大吉") showConfetti();
  // 操作ボタンは常に1つだけ表示します。
  fortuneButton.hidden = true;
  resetButton.hidden = false;
  resetButton.focus();
});

resetButton.addEventListener("click", () => {
  // 紙吹雪の途中でも、表示と後片付け用のタイマーを止めます。
  window.clearTimeout(confettiTimer);
  confettiTimer = undefined;
  confetti.replaceChildren();

  fortuneResult.textContent = initialResult;
  fortuneResult.classList.remove("is-revealed");
  // やり直すときは、前回の運勢の背景色も解除します。
  delete fortuneResult.dataset.fortune;
  fortuneDetails.hidden = true;
  fortuneMessage.textContent = "";
  luckyColor.textContent = "";
  luckyItem.textContent = "";

  nicknameInput.value = "";
  nicknameFields.hidden = false;
  fortuneDescription.textContent = initialDescription;
  nicknameError.textContent = "";
  nicknameInput.removeAttribute("aria-invalid");

  resetButton.hidden = true;
  fortuneButton.hidden = false;
  nicknameInput.focus();
});
