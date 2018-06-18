function Player(){
  this.x = 64;
  this.y = 50;
  this.dir = 0;
  this.gravity = 1;
  this.velocity = 0;

  this.jumping = false;

  this.show = function() {
    fill(255);
    ellipse(this.x, this.y, 32,32);
  }

  this.update = function() {
    this.velocity += this.gravity;
    this.y += this.velocity;
    if (this.jumping && this.velocity>0){
      this.jumping = false;
    }

    if (this.offscreen()) {
      this.up();
    }
    if (this.x<0) {
      this.x=600;
    }else if(this.x>600){
      this.x=0;
    }
    this.x += this.dir*10;
  }

  this.up = function() {

      this.jumping = true;
      this.velocity = -25;

  }

  this.offscreen = function() {
    return (this.y > height);
  }

  this.newdir = function(i){
    this.dir = i
  }

  this.stop = function(){
    this.dir = 0;
  }
}
