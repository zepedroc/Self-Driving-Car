const canvas = document.getElementById('myCanvas');

canvas.window = 200;

const ctx = canvas.getContext('2d');
const car = new Car(100, 100, 30, 50);
car.draw(ctx)

animate();

function animate() {
    car.update();

    // by setting a new height for the canvas, it resets and cleans the previous drawings
    canvas.height = window.innerHeight;
    car.draw(ctx);
    requestAnimationFrame(animate);
}