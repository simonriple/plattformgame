function Leaf(){
  this.left = random(0,width-50);
  this.size = random(50,200);
  this.y = 0;
  this.h = 20;
  this.speed = 3;


  this.show = function() {
    fill(255,255,255);
    rect(this.left, this.y, this.size , this.h);
  }
  this.update = function() {
    this.y += this.speed;
  }
  this.offscreen = function() {
    return (this.y > height);
  }

  this.hit = function(player) {

    if (player.jumping){
      console.log("Jumping")
      return false;
    }
    if (player.y>this.y && player.y<this.y+this.h && player.x > this.left && player.x < this.size+this.left) {
      console.log("hit")
      return true;
    }
  }

}
