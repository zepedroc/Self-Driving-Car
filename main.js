const canvas = document.getElementById('myCanvas');

canvas.window = 200;

const ctx = canvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50);
car.draw(ctx)

animate();

function animate() {
    car.update();

    // by setting a new height for the canvas, it resets and cleans the previous drawings
    canvas.height = window.innerHeight;

    ctx.save();

    // move the map instead of the car
    ctx.translate(0, -car.y + canvas.height * 0.7);

    road.draw(ctx)
    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
}