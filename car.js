class Car {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.accelaration = 0.2;
        this.maxSpeed = 3;
        this.friction = 0.05; // so it loses momentum over time
        this.angle = 0;

        this.controls = new Controls();
    }

    #move() {
        // accelerate
        if (this.controls.forward) this.speed += this.accelaration;
        if (this.controls.reverse) this.speed -= this.accelaration;

        // control max speed
        if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
        if (this.speed < -this.maxSpeed) this.speed = -this.maxSpeed;

        // slow it down over time
        if (this.speed > 0) this.speed -= this.friction;
        if (this.speed < 0) this.speed += this.friction;

        // without this the car never stops, the friction keeps bumping him to one of the sides
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        // no turning when stopped
        if (this.speed !== 0) {
            // invert controls if the car is moving backwards
            const flip = this.speed > 0 ? 1 : -1;

            // turn the car
            if (this.controls.left) this.angle += 0.03 * flip;
            if (this.controls.right) this.angle -= 0.03 * flip;
        }

        // Math to move the car
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    update() {
        this.#move()
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);

        ctx.beginPath();
        ctx.rect(
            -this.width / 2,
            -this.width / 2,
            this.width,
            this.height,
        );
        ctx.fill();

        ctx.restore();
    }
}