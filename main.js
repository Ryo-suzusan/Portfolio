const body = document.body;

(function () {
  // Set EventListener of Open/Close modal window.
  // モーダルウィンドウを開く/閉じるボタン一覧を取得
  const openBtns = document.querySelectorAll('.js-open-modal')
  const closeBtns = document.querySelectorAll('.js-close-modal')
  // Open modal window
  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal')
      const modal = document.getElementById(modalId)
      if (modal) {
        modal.classList.add('is-show');
        body.classList.add('modal-open');
      }
    });
  });
  // Close modal window
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-area');
      if (modal) {
        modal.classList.remove('is-show');
        body.classList.remove('modal-open');
      }
    });
  });

  // Set EventListener of Toggle language.
  const enBtns = document.querySelectorAll('.js-en-set')
  const jaBtns = document.querySelectorAll('.js-ja-set')
  // English translation
  enBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      langSet("en")
    });
  });
  // Japanese translation
  jaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      langSet("ja")
    });
  });
  // Show default language(English)
  langSet("en");

  // Set AudioButton Method
  const bgm = document.getElementById("bgm")
  bgm.volume = 0.2; // 音量を30%に設定
  const muteOnBtn = document.querySelector('.audio.off');
  const muteOffBtn = document.querySelector('.audio.on');
  muteOffBtn.addEventListener('click', () => {
    bgm.pause();
    muteOffBtn.style.display = "none";
    muteOnBtn.style.display = "inline";
  })
  muteOnBtn.addEventListener('click', () => {
    bgm.play();
    muteOnBtn.style.display = "none";
    muteOffBtn.style.display = "inline";
  })
}());

// Set language
function langSet(argLang){
  // 切り替え対象のclass一覧を取得
  var elm = document.getElementsByClassName("js-lang-ch");
 
  for (var i = 0; i < elm.length; i++) {
    // 選択された言語と一致は表示、その他は非表示
    if(elm[i].getAttribute("lang") == argLang){
      elm[i].style.display = '';
    }
    else{
      elm[i].style.display = 'none';
    }
  }
}

// Characterの表示、Character Moving(Click / Scroll) / Click Effect
document.addEventListener("DOMContentLoaded", function() {
  // キャラクタークエリ取得
  const character = document.querySelector(".chara-img");

  // キャラクターを画面中央に配置
  let x = Math.floor(window.innerWidth / 2);
  let y = Math.floor(window.innerHeight / 2);
  character.style.left = x + "px";
  character.style.top  = y + "px";

  // キャラクターを1秒かけて指定位置に、x, yまたはy, xのいずれかの順番に動かすアニメーション

  let animationId = null; // アニメーション停止時に使用するID

  // x, yを順に動かすメソッド
  function moveTo(targetX, targetY){
    // アニメーションに使用する変数
    const duration = 500; // アニメーション時間
    let startTime = Date.now();  // アニメーション開始時刻
    const startX = x;
    const startY = y;

    // 今移動アニメーション中なら止める
    cancelAnimationFrame(animationId);

    // 指定方向に移動済みか否かを記録する変数
    let hasMovedX = false;
    let hasMovedY = false;

    // 歩き始めるので、キャラのスプライトのコマ送りを早くする
    setSpriteFrameSpeed("0.5s");

    // 先に移動する方向を決める
    const direction = Math.floor(Math.random() * 2);
    if (direction == 0) {
      // キャラの向きを動く方向に設定
      if (targetX > startX) {
        setDirection("right");
      }
      else {
        setDirection("left");
      }
      // 移動開始
      stepX();
    }
    else {
      // キャラの向きを動く方向に設定
      if (targetY > startY) {
        setDirection("down");
      }
      else {
        setDirection("up");
      }
      // 移動開始
      stepY();
    }

    // X方向
    function stepX() {
      hasMovedX = true;
      // 継続時間に対する進捗度
      const progress = Math.min(1, (Date.now() - startTime) / duration);

      // キャラクターを、アニメーション時間に対する進捗度の割合だけ移動させる
      x = progress * targetX + (1 - progress) * startX;
      character.style.left = x + "px";;

      // 進捗度が1未満なら、アニメーションを続ける
      if (progress < 1){
        animationId = requestAnimationFrame(stepX);
      }
      // 終わったなら、次はY方向に(移動済みでなければ)移動させる
      else {
        if (!hasMovedY) {
          // キャラの向きを動く方向に設定
          if (targetY > startY) {
            setDirection("down");
          }
          else {
            setDirection("up");
          }
          // 移動開始
          startTime = Date.now();
          stepY();
        }
        // マウス位置まで移動完了したら、スプライトのコマ送りスピードを元の遅さにする
        else {
          setSpriteFrameSpeed("2s");
        }
      }
    }

    // Y方向
    function stepY() {
      hasMovedY = true;
      // 継続時間に対する進捗度
      const progress = Math.min(1, (Date.now() - startTime) / duration);

      // キャラクターを、アニメーション時間に対する進捗度の割合だけ移動させる
      y = progress * targetY + (1 - progress) * startY;
      character.style.top = y + "px";;

      // 進捗度が1未満なら、アニメーションを続ける
      if (progress < 1){
        animationId = requestAnimationFrame(stepY);
      }
      // 終わったなら、次はX方向に(移動済みでなければ)移動させる
      else {
        if (!hasMovedX) {
          // キャラの向きを動く方向に設定
          if (targetX > startX) {
            setDirection("right");
          }
          else {
            setDirection("left");
          }
          // 移動開始
          startTime = Date.now();
          stepX();
        }
        // マウス位置まで移動完了したら、スプライトのコマ送りスピードを元の遅さにする
        else {
          setSpriteFrameSpeed("2s");
        }
      }
    }
  }

  // キャラクターの向いている方向を設定するメソッド
  function setDirection(dir) {
    const map = {
      up: "you_up.png",
      down: "you_down.png",
      left: "you_left.png",
      right: "you_right.png"
    };

    character.style.backgroundImage = `url("./images/${map[dir]}")`;
  }

  // キャラクターの歩きコマアニメーションの速さ設定
  function setSpriteFrameSpeed(value /* 単位sを忘れずに！ */) {
    character.style.animationDuration = value;
  }

  // マウスクリック時の発火メソッドを設定
  document.addEventListener("mousedown", function(event) {
    // マウスの画面内座標取得
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // マウス位置までキャラクターを動かす
    moveTo(mouseX, mouseY);

    // マウス位置にエフェクトを発火

    // 波紋アニメーション
    drop(event);

    // パーティクル
    emitParticle(event);
  })

  // ウィンドウスクロール時の発火メソッドを設定
  let prePosition = 0; // スクロールされた方向を取得するための基準位置
  window.addEventListener("scroll", function() {
    // 移動をやめる
    this.cancelAnimationFrame(animationId);
    // スクロール中はキャラのスプライトのコマ送りスピードを速くする
    setSpriteFrameSpeed("0.5s");

    // スクロール方向に応じてキャラの向きを変える
    if (prePosition < window.scrollY) {
      setDirection("down");
    }
    else {
      setDirection("up");
    }

    // スクロール後の位置を基準に更新
    prePosition = window.scrollY;
  })

  // ウィンドウスクロールが終わったなら、キャラのコマ送りスピードをもとの遅さに戻す
  window.addEventListener("scrollend", function() {
    setSpriteFrameSpeed("2s");
  })
})

// 波紋アニメーション用クラスクエリを作成するメソッド
function drop(event) {
  // マウスのページ内座標取得
  const mouseX = event.pageX;
  const mouseY = event.pageY;

  // 波紋クエリ変数
  const ripple = document.createElement("div");
  // 位置をマウス座標に設定
  ripple.style.top = mouseY + "px";
  ripple.style.left = mouseX + "px";
  // 波紋作成
  body.appendChild(ripple);

  ripple.className = "ripple";

  // アニメーション後に削除する
  ripple.addEventListener("animationend", function(){
    this.parentNode.removeChild(this);
  }, false);
}

function emitParticle(event) {
  // マウスのページ内座標取得
  const mouseX = event.pageX;
  const mouseY = event.pageY;
  // パーティクルアニメーションを10個発火
  for (let i = 0; i < 10; i++) {
    // パーティクルクエリ変数
    const particle = document.createElement("div");
    particle.className = "particle";
    // 位置をマウス座標に設定
    particle.style.left = mouseX + "px";
    particle.style.top = mouseY + "px";
    // 色をランダム指定
    particle.style.background = ["lightblue", "lightyellow", "lightpink"][Math.floor(Math.random() * 3)];

    // 発火
    document.body.appendChild(particle);

    // アニメーション用KeyFrameEffectを作成
    const effect = new KeyframeEffect(
      particle, 
      [
        {
          opacity: 0.8, 
          transform: "translate(0, 0)"
        }, 
        {
          opacity: 0, 
          // x, yそれぞれ-200 ~ 200までのランダムな値だけ動かす
          transform: `translate(${Math.random() * 400 - 200}px, ${Math.random() * 400 - 200}px)`
        }
      ], 
      {
        duration: 500, 
        easing: "ease",
      },
    );

    // アニメーションを流す
    const animation = new Animation(effect, document.timeline);
    animation.play();

    // アニメーション後に削除する
    animation.onfinish = () => {
      particle.remove();
    }
  }
};