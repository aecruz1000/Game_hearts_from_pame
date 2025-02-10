const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = 800;
canvas.height = 600;

// URLs de las imágenes
const heartImageURL = './20.png';
const throwerImageURL = './19_2.png';
const playerImageURL = './16_2.png';

const player = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 100,
    width: 100,
    height: 100,
    speed: 5,
    image: new Image()
};
player.image.src = playerImageURL;

const thrower = {
    x: canvas.width / 2 - 50,
    y: 50,
    width: 100,
    height: 100,
    image: new Image()
};
thrower.image.src = throwerImageURL;

const hearts = [];
const heartSize = 50;
let heartSpeed = 3;
let heartsCaught = 0;

function spawnHeart() {
    hearts.push({
        x: Math.random() * (canvas.width - heartSize),
        y: -heartSize,
        image: new Image()
    });
    hearts[hearts.length - 1].image.src = heartImageURL;
}

function update() {
    hearts.forEach(heart => heart.y += heartSpeed);

    // Revisar si el jugador ha atrapado algún corazón
    hearts.forEach((heart, index) => {
        if (heart.y + heartSize > player.y && heart.y + heartSize < player.y + player.height && 
            heart.x + heartSize > player.x && heart.x < player.x + player.width) {
            heartsCaught++;
            hearts.splice(index, 1); // Eliminar el corazón atrapado
        }
    });

    // Eliminar los corazones que se salen de la pantalla
    hearts.forEach((heart, index) => {
        if (heart.y > canvas.height) hearts.splice(index, 1);
    });
    
    // Aumentar la velocidad de los corazones a medida que se atrapan
    if (heartsCaught % 5 === 0 && heartSpeed < 10) { // Aumentar cada 5 corazones atrapados
        heartSpeed += 0.5;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(thrower.image, thrower.x, thrower.y, thrower.width, thrower.height);
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
    
    hearts.forEach(heart => ctx.drawImage(heart.image, heart.x, heart.y, heartSize, heartSize));
    
    // Mostrar los corazones atrapados en pantalla
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText(`Atrapados: ${heartsCaught}`, 10, 30);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

document.addEventListener('mousemove', (e) => {
    player.x = e.clientX - player.width / 2; // Seguir el ratón
    if (player.x < 0) player.x = 0; // Limitar el movimiento a la izquierda
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width; // Limitar el movimiento a la derecha
});

setInterval(spawnHeart, 1000); // Crear corazones cada 1 segundo
loop();

