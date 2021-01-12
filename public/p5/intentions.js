class Intention {
  constructor(_intentionTxt) {
    this.intentionTxt = _intentionTxt;
    this.x = random(width * .3, width * .7);
    this.y = -30;
    this.speedX = random(-.1, .1);
    this.speedY = 3;
    this.accelX = 0;
    this.accelY = random(-0.0080, -0.0010);
  }

  displayIntention() {
    fill(255, 128, 128);
    // fill(245, 245, 115);
    text(this.intentionTxt, this.x, this.y);
  }

  moveIntention() {
    this.y = this.y + this.speedY;
    this.speedY = this.speedY + this.accelY;

    this.x = this.x + this.speedX;
    this.speedX = this.speedX + this.accelX;

    // Select a random amount to change the accelX.
    // This will produce a gentle wiggle effect.
    this.accelX += random(-0.00055, 0.00055);

  }

  // checkBounds() {
  //   if (this.y > height + 30) {
  //     this.y = random(height + 10, height + 100);
  //     // this.y = random(windowHeight + 10, windowHeight + 100);
  //     this.speedY = -4;
  //     this.x = random(this.xStart, this.xEnd);
  //     this.diam = random(3, 7);
  //     this.speedX = 0;
  //     this.accelX = 0;
  //     this.c = color(random(222, 255), random(222, 255), random(222, 255));
  //   }
  // }
}
