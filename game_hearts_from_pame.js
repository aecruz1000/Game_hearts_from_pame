const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = 400;  // Ancho reducido a 400
canvas.height = 600;

// URLs de las imágenes
const heartImageURL = './20.png';
const throwerImageURL = './19_2.png';
const playerImageURL = './16_2.png';
const largeHeartImageURL = './20.png'; // Corazón grande
const secondImageURL = './2.jpg'; // Segunda imagen

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

// Variable para el corazón grande
let largeHeart = null;

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

    // Crear el corazón grande después de 10 corazones atrapados
    if (heartsCaught >= 10 && largeHeart === null) {
        largeHeart = {
            x: thrower.x + thrower.width / 2 - 25,
            y: thrower.y + thrower.height / 2 - 25,
            size: 50,
            growing: true,
            image: new Image(),
            insideImage: new Image()
        };
        largeHeart.image.src = heartImageURL;
        largeHeart.insideImage.src = secondImageURL; // Imagen 2.jpg dentro del corazón
    }

    // Hacer crecer el corazón grande
    if (largeHeart && largeHeart.growing) {
        largeHeart.size += 2;  // Incrementar el tamaño del corazón
        if (largeHeart.size >= 150) { // Detener el crecimiento después de que alcance un tamaño específico
            largeHeart.growing = false;
        }
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

    // Mostrar el corazón grande
    if (largeHeart) {
        // Dibujar el corazón grande
        ctx.drawImage(largeHeart.image, largeHeart.x, largeHeart.y, largeHeart.size, largeHeart.size);

        // Dibujar la imagen 2.jpg dentro del corazón grande
        const imgX = largeHeart.x + (largeHeart.size - 100) / 2;
        const imgY = largeHeart.y + (largeHeart.size - 100) / 2;
        ctx.drawImage(largeHeart.insideImage, imgX, imgY, 100, 100);
    }

    // Mostrar la imagen 2.jpg después de atrapar más de 15 corazones
    if (heartsCaught >= 15) {
        const secondImage = new Image();
        secondImage.src = secondImageURL;
        ctx.drawImage(secondImage, 0, canvas.height / 2 - 100, canvas.width, 200);
    }
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
