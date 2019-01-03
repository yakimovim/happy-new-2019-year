var fireworks = [];
var gravity;

function setup() {
  const cnvs = createCanvas(document.body.offsetWidth, window.innerHeight);
  cnvs.style('z-index', -99, 'position', 'fixed');
  cnvs.style('position', 'fixed');
  colorMode(HSB);
  gravity = createVector(0, 0.2);
  stroke(255);
  strokeWeight(4);
  background(0, 0, 0, 0);
}

function draw() {
  colorMode(RGB);
  background(18, 46, 54, 25);
  if (random(1) < 0.03) {
    fireworks.push(new Firework());
  }
  for (var i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    if (fireworks[i].done()) fireworks.splice(i, 1);
  }
  //console.log(fireworks.length);
}

function Particle(x, y, firework, hu) {
  this.pos = createVector(x, y);
  this.firework = firework;
  this.lifespan = 255;
  this.hu = hu;

  if (this.firework) {
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(2, 12));
  } else {
    this.vel = createVector(random(-1, 1), random(-15, -10));
  }
  this.acc = createVector(0, 0);

  this.applyForce = function(force) {
    this.acc.add(force);
  };

  this.update = function() {
    if (this.firework) {
      this.vel.mult(0.95);
      this.lifespan -= 6;
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  };

  this.show = function() {
    colorMode(HSB);
    if (this.firework) {
      strokeWeight(2);
      stroke(hu, 255, 255, this.lifespan);
    } else {
      strokeWeight(4);
      stroke(hu, 255, 255);
    }
    point(this.pos.x, this.pos.y);
  };

  this.done = function() {
    return this.lifespan <= 0;
  };
}

function Firework() {
  this.hu = random(255);
  this.firework = new Particle(random(width), height, false, this.hu);
  this.exploded = false;
  this.particles = [];

  this.update = function() {
    if (!this.exploded) {
      this.firework.applyForce(gravity);
      this.firework.update();

      if (this.firework.vel.y >= 0) {
        this.exploded = true;
        this.explode();
      }
    }

    for (var i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(gravity);
      this.particles[i].update();
      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  };

  this.explode = function() {
    var count = random(40, 180);
    for (var i = 0; i < count; i++) {
      var p = new Particle(
        this.firework.pos.x,
        this.firework.pos.y,
        true,
        this.hu
      );
      this.particles.push(p);
    }
    this.firework = null;
  };

  this.show = function() {
    if (!this.exploded) {
      this.firework.show();
    }

    for (var i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].show();
    }
  };

  this.done = function() {
    return this.exploded && this.particles.length === 0;
  };
}
