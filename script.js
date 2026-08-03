let mario = document.querySelector(".mario")
let obstacle = document.querySelector(".obstacle")
let gameOverBox = document.querySelector(".game-over")
let button = document.querySelector(".game-over button") || document.querySelector("button")
let scoreText = document.querySelector(".score")
let highScoreText = document.querySelector(".high-score")
let finalScoreText = document.querySelector(".final-score")
let bestScoreText = document.querySelector(".best-score")
let coinEl = document.querySelector(".coin")
let soundToggleBtn = document.querySelector("#soundToggle")

let gameRunning = true
let marioX = 50
let marioY = 0
let obstacleX = 900
let coinX = 850
let coinY = 120
let score = 0
let isjumping = false
let soundEnabled = true
let obstacleSpeed = 7
let highScore = parseInt(localStorage.getItem("marioHighScore") || "0")
let audioCtx = null

if (highScoreText) {
    highScoreText.textContent = "High: " + highScore
}

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    }
}

function playJumpSound() {
    if (!soundEnabled) return
    initAudio()
    if (!audioCtx) return
    let osc = audioCtx.createOscillator()
    let gain = audioCtx.createGain()
    osc.type = "square"
    osc.frequency.setValueAtTime(150, audioCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.15)
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime)
    gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.15)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start()
    osc.stop(audioCtx.currentTime + 0.15)
}

function playCoinSound() {
    if (!soundEnabled) return
    initAudio()
    if (!audioCtx) return
    let osc = audioCtx.createOscillator()
    let gain = audioCtx.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(987, audioCtx.currentTime)
    osc.frequency.setValueAtTime(1318, audioCtx.currentTime + 0.08)
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime)
    gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.25)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start()
    osc.stop(audioCtx.currentTime + 0.25)
}

function playGameOverSound() {
    if (!soundEnabled) return
    initAudio()
    if (!audioCtx) return
    let osc = audioCtx.createOscillator()
    let gain = audioCtx.createGain()
    osc.type = "sawtooth"
    osc.frequency.setValueAtTime(400, audioCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.5)
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime)
    gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.5)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start()
    osc.stop(audioCtx.currentTime + 0.5)
}

if (soundToggleBtn) {
    soundToggleBtn.addEventListener("click", () => {
        soundEnabled = !soundEnabled
        soundToggleBtn.textContent = soundEnabled ? "🔊" : "🔇"
    })
}

function jump() {
    if (isjumping === true || gameRunning === false) {
        return
    }
    isjumping = true
    playJumpSound()

    let jumpUp = setInterval(() => {
        marioY = marioY + 8
        mario.style.bottom = marioY + "px"

        if (marioY >= 140) {
            clearInterval(jumpUp)

            let jumpDown = setInterval(() => {
                marioY = marioY - 8
                mario.style.bottom = marioY + "px"

                if (marioY <= 0) {
                    marioY = 0
                    mario.style.bottom = "0px"
                    clearInterval(jumpDown)
                    isjumping = false
                }
            }, 20)
        }
    }, 20)
}

function moveRight() {
    if (gameRunning === false) return
    marioX = marioX + 15
    if (marioX > 730) {
        marioX = 730
    }
    mario.style.left = marioX + "px"
    mario.style.transform = "scaleX(1)"
}

function moveLeft() {
    if (gameRunning === false) return
    marioX = marioX - 15
    if (marioX < 0) {
        marioX = 0
    }
    mario.style.left = marioX + "px"
    mario.style.transform = "scaleX(-1)"
}

document.addEventListener("keydown", (e) => {
    if (gameRunning === false) {
        return
    }
    if (e.key === "d" || e.key === "ArrowRight") {
        moveRight()
    }
    if (e.key === "a" || e.key === "ArrowLeft") {
        moveLeft()
    }
    if (e.key === " " || e.key === "w" || e.key === "ArrowUp") {
        jump()
    }
})

let btnLeft = document.querySelector("#btnLeft")
let btnRight = document.querySelector("#btnRight")
let btnJump = document.querySelector("#btnJump")

if (btnLeft) btnLeft.addEventListener("touchstart", (e) => { e.preventDefault(); moveLeft() })
if (btnLeft) btnLeft.addEventListener("click", () => moveLeft())
if (btnRight) btnRight.addEventListener("touchstart", (e) => { e.preventDefault(); moveRight() })
if (btnRight) btnRight.addEventListener("click", () => moveRight())
if (btnJump) btnJump.addEventListener("touchstart", (e) => { e.preventDefault(); jump() })
if (btnJump) btnJump.addEventListener("click", () => jump())

function triggerGameOver() {
    gameRunning = false
    playGameOverSound()

    if (score > highScore) {
        highScore = score
        localStorage.setItem("marioHighScore", highScore.toString())
    }

    if (highScoreText) highScoreText.textContent = "High: " + highScore
    if (finalScoreText) finalScoreText.textContent = "Score: " + score
    if (bestScoreText) bestScoreText.textContent = "Best: " + highScore

    gameOverBox.style.display = "flex"
}

function updateGame() {
    if (gameRunning === false) return

    obstacleX = obstacleX - obstacleSpeed
    if (obstacleX < -60) {
        obstacleX = 800 + Math.random() * 150
        score = score + 1
        scoreText.textContent = "Score: " + score

        if (score % 5 === 0) {
            obstacleSpeed = Math.min(obstacleSpeed + 0.5, 14)
        }
    }
    obstacle.style.left = obstacleX + "px"

    coinX = coinX - (obstacleSpeed * 0.9)
    if (coinX < -40) {
        coinX = 850 + Math.random() * 300
    }
    if (coinEl) coinEl.style.left = coinX + "px"

    if (marioX + 35 > obstacleX && marioX < obstacleX + 35 && marioY < 55) {
        triggerGameOver()
    }

    if (coinEl && Math.abs((marioX + 25) - (coinX + 12)) < 35 && Math.abs((marioY + 25) - (coinY + 12)) < 35) {
        score = score + 10
        scoreText.textContent = "Score: " + score
        playCoinSound()
        coinX = 900 + Math.random() * 400
    }

    requestAnimationFrame(updateGame)
}

function restartGame() {
    marioX = 50
    marioY = 0
    obstacleX = 900
    coinX = 850
    score = 0
    obstacleSpeed = 7
    gameRunning = true
    isjumping = false

    mario.style.left = marioX + "px"
    mario.style.bottom = "0px"
    mario.style.transform = "scaleX(1)"
    scoreText.textContent = "Score: 0"
    gameOverBox.style.display = "none"

    requestAnimationFrame(updateGame)
}

button.addEventListener("click", () => {
    restartGame()
})

requestAnimationFrame(updateGame)