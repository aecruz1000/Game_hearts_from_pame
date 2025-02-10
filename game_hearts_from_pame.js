const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = 800;
canvas.height = 600;

// URLs de las imágenes
const heartImageURL = 'https://raw.githubusercontent.com/aecruz1000/image/blob/main/20.png';
const throwerImageURL = 'https://raw.githubusercontent.com/aecruz1000/image/blob/main/19(2).png';
const playerImageURL = 'https://raw.githubusercontent.com/aecruz1000/image/blob/main/16(2).png';

const player = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 100,
    width: 100,
    height: 100,
    speed: 5,
    image: new Image()
};
player.image.src = playerImageURL;

const hearts = [];
const heartSpeed = 3;
const heartSize = 50;

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
    hearts.forEach((heart, index) => {
        if (heart.y > canvas.height) hearts.splice(index, 1);
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
    hearts.forEach(heart => ctx.drawImage(heart.image, heart.x, heart.y, heartSize, heartSize));
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && player.x > 0) player.x -= player.speed;
    if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) player.x += player.speed;
});

setInterval(spawnHeart, 1000);
loop();
