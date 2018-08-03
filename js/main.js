// @ts-check
/**
 * Juego de Snake en desarrollo.
 */
window.onload = () => {

/** @type {HTMLCanvasElement} - Canvas del juego. */
const canvas = document.querySelector("#canvas");
/** @type {CanvasRenderingContext2D} - Contexto (2D) del canvas. */
const ctx = canvas.getContext("2d");
/** @type {Number} - Ancho del canvas. */
const cwidth = canvas.width;
/** @type {Number} - Alto del canvas. */
const cheight = canvas.height;
/** @type {Number} - Tamaño de cada segmento de la serpiente */
const size = 5;
/** @type {String} - Color del cuerpo de la serpiente. */
const bcolor = "black";
/** @type {Number} - Tamaño de cada paso de la serpiente */
const step = 10;
/** @type {Number} - Dirección horizontal en la que se desplaza la serpiente.
 * +1 = Derecha
 * -1 = Izquierda
 * 0 = Sin movimiento horizontal
 */
var hdir = 1;
/** @type {Number} - Dirección vertical en la que se desplaza la serpiente.
 * +1 = Arriba.
 * -1 = Abajo.
 * 0 = Sin movimiento vertical
 */
var vdir = 0;

/** @type {Number} - Velocidad del juego. */
var timeout = 50;

/** @type {Array} - Lista que almacena pequeños objetos con las coordenadas de
 * cada segmento de la serpiente.
 */
var snake = [{ xpos: size, ypos: size }];

/** @type {{xpos: number, ypos: number}} - Objeto que almacena las coordenadas 
 * de la semilla.
 */
var seed = { 
    xpos: (Math.floor(Math.random() * ((cwidth / size) - size)) + size) * size,
    ypos: (Math.floor(Math.random() * ((cheight / size) - size)) + size) * size 
};

/** @function clearCanvas
 *  @returns {void} Función que limpia el canvas.
 */
const clearCanvas = () => {
    ctx.fillStyle = "white";
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


ctx.fillStyle = bcolor;

/**
 * Manejamos los eventos del teclado para darle movimiento a la serpiente.
 */
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowLeft":
            hdir = -1; //Izquierda
            vdir = 0;  //Sin movimiento vertical
            break;
        case "ArrowRight":
            hdir = 1; //Derecha
            vdir = 0;  //Sin movimiento vertical
            break;
        case "ArrowUp":
            vdir = -1; //Arriba
            hdir = 0; //Sin movimiento horizontal
            break;
        case "ArrowDown":
            vdir = 1; //Abajo
            hdir = 0; //Sin movimiento horizontal
            break;
    }
});

setInterval(() => {
    
    //Limpiamos el canvas.
    clearCanvas();

    //Checamos si no hemos comido la semilla
    if (seed != null)
        drawSeed();

    //Dibujamos la serpiente
    drawSnake();

    //Checamos si estamos tocando la semilla, si es así, entonces la comemos.
    if (snake[0].xpos == seed.xpos && snake[0].ypos == seed.ypos) {
        eatSeed();
        seed = {
            xpos: (Math.floor(Math.random() * ((cwidth / size) - size)) + size) 
            * size,
            ypos: (Math.floor(Math.random() * ((cheight / size) - size)) + size)
            * size 
        };
        timeout -= 20;
    }
    
    //Movemos a la serpiente.
    moveSnake();

} , timeout);

};