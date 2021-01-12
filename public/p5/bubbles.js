function createBubbleArray() { // bubble animation
  for (let i = 0; i < numOfBubbles; i++) {
    bubbleArray.push(new Bubble(20, 50));
    bubbleArray.push(new Bubble(windowWidth / 10, windowWidth / 10 + 10));
    bubbleArray.push(new Bubble(windowWidth / 5, windowWidth / 5 + 10));
    bubbleArray.push(new Bubble(windowWidth * 3 / 5, windowWidth * 3 / 5 + 10));
    bubbleArray.push(new Bubble(windowWidth * 5 / 6, windowWidth * 5 / 6 + 10));
    bubbleArray.push(new Bubble(windowWidth - 33, windowWidth - 50));
  }

  bubbleArrayLength = bubbleArray.length;
}


function drawBubbles() {
  for (let i = 0; i < bubbleArrayLength; i++) {
    bubbleArray[i].drawBubble();

    bubbleArray[i].moveBubble();

    bubbleArray[i].checkBounds();
  }
}


class Bubble {
  constructor(_xStart, _xEnd) {
    this.xStart = _xStart;
    this.xEnd = _xEnd
    this.x = random(this.xStart, this.xEnd);
    // this.x = random(0, windowWidth);
    this.y = random(0, height);
    // this.y = random(0, windowHeight);
    // this.y = random(windowHeight + 50, windowHeight * 2);
    this.speedX = 0;
    this.speedY = -4;
    this.accelX = 0;
    this.accelY = random(-0.0080, -0.0010);
    this.diam = random(4, 8);
    this.c = color(random(190, 255), random(190, 255), random(190, 255), 150);
  }

  drawBubble() {
    noStroke();
    fill(this.c);
    ellipse(this.x, this.y, this.diam, this.diam);
  }

  moveBubble() {
    this.y = this.y + this.speedY;
    this.speedY = this.speedY + this.accelY;

    this.x = this.x + this.speedX;
    this.speedX = this.speedX + this.accelX;

    // Select a random amount to change the accelX.
    // This will produce a gentle wiggle effect.
    this.accelX += random(-0.00005, 0.00005);

    this.diam = this.diam + 0.02;
  }

  checkBounds() {
    if (this.y < -20) {
      this.y = random(height + 10, height + 100);
      // this.y = random(windowHeight + 10, windowHeight + 100);
      this.speedY = -4;
      this.x = random(this.xStart, this.xEnd);
      this.diam = random(3, 7);
      this.speedX = 0;
      this.accelX = 0;
      this.c = color(random(222, 255), random(222, 255), random(222, 255));
    }
  }
}
