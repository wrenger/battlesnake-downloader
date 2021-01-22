const ENGINE_URL = "https://engine.battlesnake.com/games/";

const SNAKE_SELECT = document.getElementById("snake");
const TURN_INPUT = document.getElementById("turn");
const DOWNLOAD_BTN = document.getElementById("download");
const ERROR_LABEL = document.getElementById("error");

SNAKE_SELECT.addEventListener("change", resetDownloadBtn);
TURN_INPUT.addEventListener("change", resetDownloadBtn);
DOWNLOAD_BTN.addEventListener("click", download);

let game = null;

browser.tabs.query({ active: true, currentWindow: true })
    .then(tabs => {
        if (tabs && tabs[0].url) {
            let url = new URL(tabs[0].url);
            if (url.hostname == "play.battlesnake.com") {
                let components = url.pathname.split("/");
                if (components.length == 4 && components[1] == "g") {
                    let game_id = components[2];
                    loadGame(game_id);
                    return;
                }
            }
        }
        throw new Error("Invalid URL");
    })
    .catch(error => setError(error.message))


function resetDownloadBtn() {
    DOWNLOAD_BTN.classList.remove("clicked");
}

function setError(msg) {
    if (msg) {
        ERROR_LABEL.textContent = msg;
        ERROR_LABEL.hidden = false;
    } else {
        ERROR_LABEL.hidden = true;
    }
}

function download() {
    if (game) {
        loadFrame(game, SNAKE_SELECT.value, parseInt(TURN_INPUT.value));
    }
}

function loadGame(game_id) {
    let url = ENGINE_URL + game_id
    fetch(url)
        .then(response => response.json())
        .then(data => {
            game = data.Game;

            data.LastFrame.Snakes.forEach(snake => {
                var option = document.createElement("option");
                option.text = snake.Name;
                option.value = snake.ID;
                SNAKE_SELECT.add(option);
            });

            SNAKE_SELECT.disabled = false;
            TURN_INPUT.disabled = false;
            DOWNLOAD_BTN.disabled = false;
        })
        .catch((error) => setError(error.message));
}


function loadFrame(game, snake_id, turn) {
    let url = ENGINE_URL + game.ID + "/frames?offset=" + turn + "&limit=1";
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.Frames && data.Count > 0) {
                let state = convertState(game, data.Frames[0], snake_id);
                navigator.clipboard.writeText(JSON.stringify(state))
                    .catch(error => console.error("Error", error));
                DOWNLOAD_BTN.classList.add("clicked");
            } else {
                throw Error("Invalid turn");
            }
        })
        .catch((error) => setError(error.message));
}

function convertPoint(point) {
    return {
        x: point.X,
        y: point.Y,
    }
}

function convertSnake(snake) {
    return {
        id: snake.ID,
        name: snake.Name,
        body: snake.Body.map(convertPoint),
        health: snake.Health,
        latency: parseInt(snake.Latency),
        head: convertPoint(snake.Body[0]),
        length: snake.Body.length,
        shout: snake.Shout,
        squad: snake.Squad,
    }
}

function convertState(game, frame, snake_id) {
    // Only grab alive snakes
    let snakes = frame.Snakes
        .filter(snake => snake.Death == null)
        .map(convertSnake);
    let you = snakes.find(snake => snake.id == snake_id);

    if (!you) {
        throw new Error("The snake is already dead");
    }

    return {
        game: {
            id: game.ID,
            ruleset: game.Ruleset,
            timeout: game.SnakeTimeout,
        },
        turn: frame.Turn,
        board: {
            width: game.Width,
            height: game.Height,
            food: frame.Food.map(convertPoint),
            hazards: frame.Hazards.map(convertPoint),
            snakes: snakes,
        },
        you
    }
}
