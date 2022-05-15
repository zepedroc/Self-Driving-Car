class Car {
    constructor(x, y, width, height, type, maxSpeed = 3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.accelaration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05; // so it loses momentum over time
        this.angle = 0;
        this.damaged = false;

        this.polygon = [];
        this.type = type;

        // dummy cars don't need sensors
        if (type !== 'dummy') this.sensor = new Sensor(this);

        this.controls = new Controls(type);
    }

    #createPolygon() {
        const points = [];
        // calculate the distance between the center of the car and a corner
        const radius = Math.hypot(this.width, this.height) / 2; // half of the hypotenuse
        // calculate angle  
        const alpha = Math.atan2(this.width, this.height);

        // top right corner
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * radius,
            y: this.y - Math.cos(this.angle - alpha) * radius,
        });

        // top left corner
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * radius,
            y: this.y - Math.cos(this.angle + alpha) * radius,
        });

        // bottom left corner
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius,
        });

        // bottom right corner
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * radius,
        });

        return points;
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

    #assessDamage(roadBorders, traffic) {
        // check if it collides with the road borders
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }

        // check if it collides with other cars
        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        return false;
    }

    update(roadBorders, traffic) {
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }

        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
        }
    }

    draw(ctx) {
        if (this.damaged) {
            ctx.fillStyle = 'red';
        } else {
            ctx.fillStyle = this.type === 'keys' ? 'blue' : 'gray';
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);

        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();

        if (this.sensor) {
            this.sensor.draw(ctx);
        }
    }
}