const { terminal } = require('terminal-kit');
const fs = require('fs');

const appName = "Terminal Snake Game - V 1.0.0 "
const gameOverMessage = "Game Over | Press Any Key To Restart"
const gameWinnerMessage = "Game End | Press Any Key To Restart"
const snakeMoveTime = 220
const appleScore = 30

const snakeHead = "◉"
const snakeBody = "⊙"
const apple = ""
const verticalWall = "|"
const horizontallWall = "-"

const snakeColor = "#8DC640"
const wallColor = "#ffffff"
const appleColor = "#fc4846"

const groundRow = 12
const groundColumn = 33

const groundStartRow = 3
const groundStartColumn = 0

let matris = []
let snake = []

let score = 0
let total = 0
let snakeMove = "R"

let snakeMover = null
let gameOvering = false

terminal.fullscreen(true);
terminal.hideCursor(true);

terminal.grabInput({ mouse: 'button' });

terminal.on('key', function (name, matches, data) {

    if (name != "CTRL_C" && gameOvering) {
        start()
        return
    }

    switch (name) {

        case "CTRL_C":
            terminal.colorRgbHex("#fff").moveTo(0, 1 + 1 + 1 + groundRow + groundStartRow, `Exit`);
            terminate();
            break

        case "DOWN":
            snakeMove = "D"
            break

        case "UP":
            snakeMove = "U"
            break

        case "LEFT":
            snakeMove = "L"
            break

        case "RIGHT":
            snakeMove = "R"
            break
    }
});


function createMatris() {

    for (let i = 0; i < groundRow; i++) {

        const row = []

        for (let j = 0; j < groundColumn; j++) {
            row[j] = " "
        }

        matris[i] = row
    }

    for (let i = 0; i < groundColumn - 1; i++) {
        matris[0][i] = horizontallWall
    }

    for (let i = 1; i < groundColumn; i++) {
        matris[matris.length - 1][i] = horizontallWall
    }

    for (let i = 0; i < groundRow - 1; i++) {
        matris[i][matris[i].length - 1] = verticalWall
    }

    for (let i = 1; i < groundRow; i++) {
        matris[i][0] = verticalWall
    }

    let snakeStartPoint = [[Math.round(groundRow * 22 / 100) + 1, Math.round(groundRow * 78 / 100) - 2], [Math.round(groundColumn * 22 / 100) + 1, Math.round(groundColumn * 78 / 100) - 2]]
    snakeStartPoint = [random(snakeStartPoint[0][0], snakeStartPoint[0][1]), random(snakeStartPoint[1][0], snakeStartPoint[1][1])]

    if (snakeStartPoint[1] >= Math.round(groundRow / 2)) {

        if (snakeStartPoint[0] >= Math.round(groundColumn / 2)) {
            snakeMove = "L"
        } else {
            snakeMove = "U"
        }

    } else {

        if (snakeStartPoint[0] >= Math.round(groundColumn / 2)) {
            snakeMove = "D"
        } else {
            snakeMove = "R"
        }

    }

    matris[snakeStartPoint[0]][snakeStartPoint[1]] = snakeHead


    switch (snakeMove) {
        case "L":
            matris[snakeStartPoint[0]][snakeStartPoint[1] + 1] = snakeBody
            break

        case "R":
            matris[snakeStartPoint[0]][snakeStartPoint[1] - 1] = snakeBody
            break

        case "D":
            matris[snakeStartPoint[0] - 1][snakeStartPoint[1]] = snakeBody
            break

        case "U":
            matris[snakeStartPoint[0] + 1][snakeStartPoint[1]] = snakeBody
            break
    }
}

function findSnake() {
    let newSanke = []

    for (i in matris) {

        for (j in matris[i]) {

            if (matris[i][j] == snakeHead) {
                newSanke.unshift([i, j])
            } else if (matris[i][j] == snakeBody) {
                newSanke.push([i, j])
            }
        }
    }

    snake = newSanke
}

function newAplle() {
    let item = getRandomEmptyGound()

    if (item == 0) {
        gameWinner()
    } else
        matris[item[0]][item[1]] = apple
}

function getRandomEmptyGound() {

    let items = getAllEmptyGround()

    if (items.length <= 0)
        return 0

    return items[Math.round(random(0, items.length - 1))]
}

function getAllEmptyGround() {

    let items = []

    for (i in matris) {

        for (j in matris[i]) {

            if (matris[i][j] == " ") {
                items.push([i, j])
            }
        }
    }

    return items
}

function printMatris() {
    terminal.colorRgbHex("#fff").moveTo(0, 1, appName + "    ");
    terminal.colorRgbHex("#fff").moveTo(0, 2, `Score : ${score}  |  Total : ${total}     `);

    for (let a in matris) {
        let i = parseInt(a) + groundStartRow + 1

        for (let b in matris[a]) {
            let j = parseInt(b) + groundStartColumn + 1
            let chr = matris[a][b]

            switch (chr) {
                case snakeHead:
                case snakeBody:
                    terminal.colorRgbHex(snakeColor).moveTo(j, i, chr);
                    break

                case apple:
                    terminal.colorRgbHex(appleColor).moveTo(j, i, chr);
                    break

                case verticalWall:
                case horizontallWall:
                    terminal.colorRgbHex(wallColor).moveTo(j, i, chr);
                    break
                default:
                    terminal.colorRgbHex("#fff").moveTo(j, i, chr);
                    break
            }
        }
    }
}

function random(low, high) {
    return Math.round(Math.random() * (high - low) + low);
}

function moveToFront() {
    let head = snake[0]
    let body = snake[1]

    if (head[0] == body[0]) {

        if (head[1] >= body[1]) {
            snakeMove = "R"
        } else {
            snakeMove = "L"
        }

    } else {

        if (head[0] > body[0]) {
            snakeMove = "D"
        } else {
            snakeMove = "U"
        }
    }
}

function gameOver() {
    if (snakeMover != null) clearTimeout(snakeMover)
    terminal.colorRgbHex("#fff").moveTo(0, 2 + groundRow + groundStartRow, gameOverMessage);
    gameOvering = true
}

function gameWinner() {
    if (snakeMover != null) clearTimeout(snakeMover)
    terminal.colorRgbHex("#fff").moveTo(0, 2 + groundRow + groundStartRow, gameWinnerMessage);
    gameOvering = true
}

function terminate() {
    terminal.grabInput(false);
    if (snakeMover != null) clearTimeout(snakeMover)

    setTimeout(function () { process.exit() }, 200);
}

function restoreTotal() {
    if (fs.existsSync("./total.txt")) {
        total = fs.readFileSync("./total.txt");

        if (total == null || isNaN(total) || total == "") {
            total = 0
            saveTotal()

        } else {
            total = parseInt(total)
        }

    } else
        saveTotal()

}

function saveTotal() {
    fs.writeFileSync("./total.txt", total);
}

function getNewPosition() {

    let oldPosition = snake[0].slice()
    let newPosition = []

    switch (snakeMove) {
        case "L":
            oldPosition[1] = oldPosition[1] - 1
            newPosition = oldPosition
            break

        case "R":
            oldPosition[1] = oldPosition[1] + 1
            newPosition = oldPosition
            break

        case "D":
            oldPosition[0] = oldPosition[0] + 1
            newPosition = oldPosition
            break

        case "U":

            oldPosition[0] = oldPosition[0] - 1
            newPosition = oldPosition
            break
    }

    return newPosition
}

function move() {

    let newPosition = getNewPosition()

    if (snake[1][0] == newPosition[0] && snake[1][1] == newPosition[1]) {
        moveToFront()
        newPosition = getNewPosition()
    }

    newPosition[0] = parseInt(newPosition[0])
    newPosition[1] = parseInt(newPosition[1])

    if (matris[newPosition[0]][newPosition[1]] == verticalWall || matris[newPosition[0]][newPosition[1]] == horizontallWall || matris[newPosition[0]][newPosition[1]] == snakeBody || matris[newPosition[0]][newPosition[1]] == snakeHead) {

        gameOver()

    } else if (matris[newPosition[0]][newPosition[1]] == apple) {

        snake.unshift(newPosition)

        matris[snake[0][0]][snake[0][1]] = snakeHead
        matris[snake[1][0]][snake[1][1]] = snakeBody

        newAplle()
        eatApple()

    } else {

        snake.unshift(newPosition)

        matris[snake[0][0]][snake[0][1]] = snakeHead
        matris[snake[1][0]][snake[1][1]] = snakeBody

        matris[snake[snake.length - 1][0]][snake[snake.length - 1][1]] = " "

        snake.pop()
    }

    printMatris()

}

function realod() {
    score = 0
    gameOvering = false
    terminal.colorRgbHex("#fff").moveTo(0, 2 + groundRow + groundStartRow, " ".repeat(gameOverMessage.length));
}

function start() {
    createMatris()
    restoreTotal()
    findSnake()
    newAplle()
    realod()

    snakeMover = setTimeout(function timer() {
        if (!gameOvering)
            move()
        else
            clearTimeout(this)

        switch (snakeMove) {
            case "D":
            case "U":

                let oneRowTime = groundRow * (snakeMoveTime - 2)
                let oneColumTime = groundColumn * (snakeMoveTime - 2)
                let timeRatio = oneColumTime / oneRowTime
                let rowTime = Math.round(snakeMoveTime * timeRatio)

                snakeMover = setTimeout(timer, rowTime);

                break

            case "L":
            case "R":

                snakeMover = setTimeout(timer, snakeMoveTime);
                break
        }

    }, 280)
}

function eatApple() {
    score += appleScore

    if (score > total) {
        total = score
        saveTotal()
    }
}

setInterval(() => { }, 1e6)
start()