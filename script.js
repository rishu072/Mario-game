let mario = document.querySelector(".mario")
let obstacle = document.querySelector(".obstacle")
let gameOverBox = document.querySelector(".game-over")
let button = document.querySelector("button")
let scoreText = document.querySelector(".score")
let gameRunning = true
let marioX = 50
let marioY = 0
let obstacleX = 900
let score = 0
let isjumping = false


document.addEventListener("keydown",(e)=>{
    if(gameRunning === false){
         return
    }
    if(e.key == "d" || e.key === "ArrowRight"){
        marioX = marioX + 10
        if(marioX > 750){
            marioX = 750
        }
        mario.style.left = marioX  + "px"
    }
      if(e.key == "a" || e.key === "Arrowleft"){
        marioX = marioX - 10
        if(marioX < 0){
            marioX = 0
        }
        mario.style.left = marioX  + "px"
    }
    if(e.key === " " ||
       e.key === "w" ||
       e.key === "ArrowUp"
       
    ){
       ///
    }


    function jump(){
        if(isjumping === true){
            return
        }
        isjumping = true
        
        let jumpUp =  setInterval(() => {
        marioY = marioY + 10
        mario.style.bottom = marioY + "px"

        if(marioY >= 130){
            clearInterval(jumpUp)

            let jumpDown = setInterval(() => {
                marioY = marioY - 10
                mario.style.bottom = "px"
                clearInterval(jumpDown)
                isjumping = false
            }, 20);
        }
        }, 20);

    }

})