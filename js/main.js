// @ts-check
/**
 * Juego de Snake en desarrollo.
 */
window.onload = () => {

/*******************************************************************************
 *                              DECLARACIONES                                   
 ******************************************************************************/

/** @type {HTMLCanvasElement} - Canvas del juego. */
const canvas = document.querySelector("#canvas");

/** @type {CanvasRenderingContext2D} - Contexto (2D) del canvas. */
const ctx = canvas.getContext("2d");

/** @type {Number} - Ancho del canvas. */
const cwidth = canvas.width;

/** @type {Number} - Alto del canvas. */
const cheight = canvas.height;

/** @type {HTMLButtonElement} - Botón para iniciar el juego */
const playbutton = document.querySelector("#play");

/** @type {Number} - Tamaño de cada segmento de la serpiente */
const size = 5;

/** @type {String} - Color del cuerpo de la serpiente. */
const bcolor = "white";

/** @type {Number} - Dirección horizontal en la que se desplaza la serpiente.
 * +1 = Derecha
 * -1 = Izquierda
 * 0 = Sin movimiento horizontal
 */
var hdir;

/** @type {Number} - Dirección vertical en la que se desplaza la serpiente.
 * +1 = Arriba.
 * -1 = Abajo.
 * 0 = Sin movimiento vertical
 */
var vdir;

/** @type {Number} - Velocidad del juego. */
var timeout;

/** @type {Array} - Lista que almacena pequeños objetos con las coordenadas de
 * cada segmento de la serpiente.
 */
var snake;

/** @type {{xpos: number, ypos: number}} - Objeto que almacena las coordenadas 
 * de la semilla.
 */
var seed;

/** @type {Number} - Identificador devuelto por el setInterval que maneja las 
 * repeticiones del juego.
 */
var intervalID;

/** @type {{xpos: number, ypos: number}} - Objeto que almacena las coordenadas
 * de la posición anterior de la cabeza de la serpiente.
 */
var snake_old_pos;

/*******************************************************************************
 *                               FUNCIONES                                     
 ******************************************************************************/

/** @function init
 *  @returns {void} Función que inicializa todo lo necesario para la ejecución
 * del juego.
 */
const init = () => {
    timeout = 50;
    snake = [{ xpos: size, ypos: size }];
    snake_old_pos = { xpos: 0, ypos: 0 };
    seed = { 
        xpos: (Math.floor(Math.random() * ((cwidth / size) - size)) + size) * 
        size,
        ypos: (Math.floor(Math.random() * ((cheight / size) - size)) + size) * 
        size 
    };
    hdir = 1;
    vdir = 0;
}

/** @function clearCanvas
 *  @returns {void} Función que limpia el canvas.
 */
const clearCanvas = () => {
    ctx.fillStyle = "#3d3d3d";
    ctx.fillRect(0, 0, cwidth, cheight);
    ctx.fillStyle = bcolor;
};

/** @function drawSnake
 * @returns {void} Función que dibuja a la serpiente.
 */
const drawSnake = () => {
    //Dibujamos cada segmento de la serpiente.
    for (var i = 0; i < snake.length; i++){
        ctx.beginPath();
        ctx.arc(snake[i].xpos, snake[i].ypos, size, 0, 2*Math.PI);
        ctx.fill();
        ctx.shadowColor = "#ecf0f1";
        ctx.shadowBlur = 40;
    }
}

/** @function moveSnake
 * @returns {void} Función que realiza el movimiento de la serpiente.
 */
const moveSnake = () => {
    //Recorremos las coordenadas de un segmento al siguiente.
    for (var i = snake.length - 1; i > 0; i--){
        snake[i].xpos = snake[i-1].xpos;
        snake[i].ypos = snake[i-1].ypos;
    }

    //Checamos la dirección de la serpiente y actualizamos la cabeza.
    if (hdir != 0) snake[0].xpos += size * hdir;
    else snake[0].ypos += size * vdir;
}

/** @function drawSeed
 * @returns {void} Función que dibuja la semilla en un lugar aleatorio.
 */
const drawSeed = () => {
    ctx.beginPath();
    ctx.arc(seed.xpos, seed.ypos, size / 2, 0, 2*Math.PI);
    ctx.fill();
}

/** @function eatSeed
 * @returns {void} Función que agrega un nuevo segmento a la serpiente después
 * de comer una semilla.
 */
const eatSeed = () => {
    snake[snake.length] = {
        xpos: snake[snake.length - 1].xpos,
        ypos: snake[snake.length - 1].ypos };
}

/** @function checkCollisions
 * @returns {boolean} Función que checa si la serpiente colisiona.
 */
const checkCollisions = () => {
    for (var i = 0; i < snake.length - 1; i++)
        for (var j = i + 1; j < snake.length; j++) {
            if (snake[i].xpos == snake[j].xpos && 
                snake[i].ypos == snake[j].ypos)
                return true;
        }
    
    if (snake[0].xpos + size > cwidth || snake[0].xpos - size < 0 ||
        snake[0].ypos + size > cheight || snake[0].ypos - size < 0)
        return true;

    return false;
}

/** @function gameOver
 * @returns {void} Función que dibuja el texto de Game Over una vez que has 
 * perdido.
 */
const gameOver = () => {
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", cwidth / 2.7, cheight / 2);
    clearInterval(intervalID);
    playbutton.style.display = "inline-block";
}

/** @function game
 * @returns {void} Función que maneja el juego completo.
 */
const game = () => {
    
    //Limpiamos el canvas.
    clearCanvas();

    //Checamos si no hemos comido la semilla
    if (seed != null) drawSeed();

    //Dibujamos la serpiente
    drawSnake();

    if (checkCollisions()) gameOver();

    //Checamos si estamos tocando la semilla, si es así, entonces la comemos.
    if (snake[0].xpos == seed.xpos && snake[0].ypos == seed.ypos) {
        eatSeed();
        seed = {
            xpos: (Math.floor(Math.random() * ((cwidth / size) - size)) + size) 
            * size,
            ypos: (Math.floor(Math.random() * ((cheight / size) - size)) + size)
            * size 
        };
        timeout -= 2;
        clearInterval(intervalID);
        intervalID = setInterval(game, timeout);    
    }
    
    //Movemos a la serpiente.
    moveSnake();
    console.log(snake[0]);
};

/*******************************************************************************
 *                               EJECUCIÓN                                      
 ******************************************************************************/

/**
 * Manejamos los eventos del teclado para darle movimiento a la serpiente.
 */
document.addEventListener("keydown", (e) => {
    if ( snake_old_pos.xpos == snake[0].xpos && 
        snake_old_pos.ypos == snake[0].ypos )
        return;

    switch (e.key) {
        case "ArrowLeft":
            hdir = hdir == 1 ? 1 : -1; //Izquierda
            vdir = 0;  //Sin movimiento vertical
            break;
        case "ArrowRight":
            hdir = hdir == -1 ? -1 : 1; //Derecha
            vdir = 0;  //Sin movimiento vertical
            break;
        case "ArrowUp":
            vdir = vdir == 1 ? 1 : -1; //Arriba
            hdir = 0; //Sin movimiento horizontal
            break;
        case "ArrowDown":
            vdir = vdir == -1 ? -1 : 1; //Abajo
            hdir = 0; //Sin movimiento horizontal
            break;
    }
    snake_old_pos.xpos = snake[0].xpos;
    snake_old_pos.ypos = snake[0].ypos;
});

playbutton.addEventListener("click", (e) => {
    init();
    playbutton.style.display = "none";
    intervalID = setInterval(game, timeout);
});

clearCanvas();
ctx.fillStyle = bcolor;

/*******************************************************************************
 *                                  ESTILO                                      
 ******************************************************************************/

/** Margen izquierdo del canvas */
canvas.style.marginLeft = (window.innerWidth - cwidth) / 2 + "px";

playbutton.style.left = (window.innerWidth - cwidth) / 2 + (cwidth / 2.7) + "px";
playbutton.style.top = cheight / 2 + 30 + "px";

/** Checamos cuando hay una redimensión de pantalla para actualizar el margen
 * izquierdo del canvas. 
 */
window.onresize = () => {
    canvas.style.marginLeft = (window.innerWidth - cwidth) / 2 + "px";
    playbutton.style.left = (window.innerWidth - cwidth) / 2 + (cwidth / 2.7) 
        + "px";
}

};