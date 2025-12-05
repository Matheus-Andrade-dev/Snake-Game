const canvas = document.querySelector('canvas') //atribuindo a referencia do elemento 'canvas' para a variavel canvas
const ctx = canvas.getContext('2d')

const score = document.querySelector('.score--value')
const finalScore = document.querySelector('.final-score > span')
const menu = document.querySelector('.menu-screen')
const buttonPlay = document.querySelector('.btn-play')
const highScoreFinal = document.querySelector('.high-score > span')

const audio = new Audio('./assets/audioComida.mp3')

const size = 30 //definindo um valor para o tamanho dos elementos, para deixa-los proporcionais

const initialPosition = { x: 270, y:270 }
let snake = [ initialPosition ]

const incrementScore = () => {
    score.innerText =  +score.innerText + 10
}


const randomNumber = (min, max) => { //criação número aleatorio
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomColor = () => {
    const red = randomNumber(0,255)
    const green = randomNumber(0,255)
    const blue = randomNumber(0,255)

    return `rgb(${red}, ${green}, ${blue})` 
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction, loopId

const drawFood = () => {

    const { x, y, color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0

}

const drawSnake = () => {
    ctx.fillStyle = '#ddd'
    
    snake.forEach((positionSnake, index) => {

        if(index == snake.length - 1) { // para definir a cabeça da cobra e, com isso mudar a cor dela
            ctx.fillStyle = 'white'
        }

        ctx.fillRect(positionSnake.x, positionSnake.y, size, size)
    })
}

const moveSnake = () => {

    if(!direction) return

    const head = snake[snake.length - 1]

    snake.shift() // para remover o primeiro indice do array

    if(direction == 'right') {
        snake.push({ x: head.x + size, y: head.y })
    }

    if(direction == 'left') {
        snake.push({ x: head.x - size, y: head.y })
    }   

    if(direction == 'up') {
        snake.push({ x: head.x, y: head.y - size })
    }

    if(direction == 'down') {
        snake.push({ x: head.x, y: head.y + size })
    }
}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = '#191919'

    for(let i = size; i <= canvas.width; i += size) {

    ctx.beginPath()
    ctx.lineTo(i,0)
    ctx.lineTo(i,600)
    ctx.stroke()

    ctx.beginPath()
    ctx.lineTo(0,i)
    ctx.lineTo(600,i)
    ctx.stroke() //47:56 video

    }
}

const checkEat = () => {
    const head =  snake[snake.length - 1]

    if(head.x == food.x && head.y == food.y){
        incrementScore()
        snake.push(head)
        audio.play()

        let x = randomPosition()
        let y = randomPosition()

        while(snake.find((position) => position.x == x && position.y == y)){ //para confirmar que não existe uma comida na mesma posição do corpo da cobra e, se existir, pegar outras posições
           
            x = randomPosition()
            y = randomPosition()          
        }

        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if(wallCollision || selfCollision) {
        gameOver()
    }
    
}

const gameOver = () => {

    if(!localStorage.getItem('Highscore')){
        localStorage.setItem('Highscore', 0)
    }

    let highScore = parseInt(localStorage.getItem('Highscore'))
    let scoreFinal = parseInt(finalScore.innerText)

    if(scoreFinal > highScore) {

        localStorage.setItem('Highscore',scoreFinal.toString())
    }

    direction = undefined

    menu.style.display = 'flex'
    finalScore.innerText  = score.innerText
    highScoreFinal.innerText = localStorage.getItem('Highscore')

    canvas.style.filter = 'blur(2px)'
}

const gameLoop = () => {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600) //linpa o canvas
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()

    loopId = setTimeout(() => {
        gameLoop()
    },300)
}

gameLoop()

document.addEventListener('keydown', ({key}) => {
    
    if(key == 'ArrowRight' && direction != 'left'){
        direction = 'right'
    }

    if(key == 'ArrowLeft' && direction != 'right'){
        direction = 'left'
    }

    if(key == 'ArrowUp' && direction != 'down'){
        direction = 'up'
    }

    if(key == 'ArrowDown' && direction != 'up'){
        direction = 'down'
    }

})

buttonPlay.addEventListener('click', () => {
    
    //resetando sem dar refresh na página
    score.innerText = '00'
    menu.style.display = 'none'
    canvas.style.filter = 'none'
    snake = [ initialPosition ]

   // window.location.reload() //resetando dando refresh na página
})