
var player;
var leafs = [];
var r,g,b;
var score = 0;
var playername;
var bestscore = 0;
var count = 0;
var finished = false;
var started = false;
var changing = false;
var firstshelft = false;
var database;
var highscore = [];
var uploadScore = true;
var input,button;
var registrer = true;

function setup() {
  this.connect();
  createCanvas(600,800);
  noStroke();
  r = 255;
  g = 255;
  b = 255;
  this.startscreen();
  input = createInput();
  input.size(300,50);
  input.style('font-size','30px');
  input.style('border', 'none');
  input.style('background-color', '#FDD83D');
  input.style('color', 'white');
  input.position(this.width/2-150,350);

  player = new Player();
  leafs.push(new Leaf());
}

function draw() {
  if (started){
    if(player.offscreen() && !finished && firstshelft){
      this.dead();
      if(score > bestscore){
        bestscore = score;
      }
      score = 0;
      count=20;
    }else if(count>0 && !finished && firstshelft){
      this.dead();
      count--;
    }else{
      this.back();
    }
    this.checkcolor();

    player.show();
    player.update();


    if (frameCount % 80 == 0 && !finished){
      leafs.push(new Leaf());
    }

    for (var i=leafs.length-1; i>=0 ;i--){
      leafs[i].show();
      leafs[i].update();
      if(leafs[i].hit(player)){
        if(!firstshelft){
          firstshelft = true;
        }
        player.up();
      }
      if(leafs[i].offscreen()){
        leafs.splice(i,1);
      }
    }
  }else{
    this.startscreen();
  }

}

this.startscreen = function () {
  background(r,g,b);
  fill(255,215,0);
  textSize(40)
  var string = "Press enter to start";
  text(string,this.width/2-textWidth(string)/2,250);
  string = "Username for ranking";
  text(string,this.width/2-(textWidth(string)/2),330);
}

this.back = function() {
  if(changing){
    if(r>=10){
      r -= 10;
      g -= 6;
      b -= 4;
      background(r,g,b);
    }else{
      changing = false;
    }
  }else{
    if (frameCount % 40 == 0){
      r++;
    }else if(frameCount % 30 == 0){
      g++;
    }
    else if (frameCount % 10 == 0){
      b++;
    }
    background(r,g,b);
    fill(255,255,255);
    textSize(60);
    text(score,width/2-30,60);
    if(frameCount % 50 == 0 && firstshelft){
      score++;
    }
  }
}
this.dead = function() {
    background(255,0,0);
    text("WASTED",300-120,400);
}

this.checkcolor = function() {
  if (r>250 && g>250 && b>250){
    fill(255,215,0);
    string = "YOU MADE IT!";
    text(string,this.width/2-(textWidth(string)/2),200);
    textSize(40)
    string = "YOUR BEST SCORE"+bestscore;
    text(string,this.width/2-(textWidth(string)/2),260);
    string = "HIGHSCORE";
    text(string,this.width/2-(textWidth(string)/2),350);
    for(var i=0; i< highscore.length; i++ ){
      var name, score;
      if(bestscore<highscore[i].score){
        name = highscore[i].name;
        score = highscore[i].score;
      }else{
        name = playername;
        score = bestscore;
      }
      text(name,150,400+(50*i));
      text(score,370,400+(50*i));
    }
    if(uploadScore){
      updateHighscore();
      uploadScore = false;
    }
    finished = true;
  }
}

this.end = function (){
  r=255;
  g=255;
  b=255;
}

function keyReleased() {
  player.stop();
}

function keyPressed() {
  if(keyCode == LEFT_ARROW){
    player.newdir(-1);
  }else if(keyCode == RIGHT_ARROW){
    player.newdir(1);
  }else if(keyCode == ENTER && !started){
    started = true;
    changing = true;
    if(input.value()!=null){
      registrer = true;
      playername = input.value();
    }
    removeElements();
  }
}

this.connect = function (){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB6Cmc2rdOY_PlHSkmQHScaWkwKuDwRNcQ",
    authDomain: "jump-b00de.firebaseapp.com",
    databaseURL: "https://jump-b00de.firebaseio.com",
    projectId: "jump-b00de",
    storageBucket: "jump-b00de.appspot.com",
    messagingSenderId: "878515329773"
  };
  firebase.initializeApp(config);
  console.log(firebase);
  database = firebase.firestore();
  var settings = {timestampsInSnapshots: true};
  database.settings(settings);

  database.collection("highscore").orderBy("score","desc").limit(5).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc){
      highscore.push(doc.data());
    });
  });
}


this.updateHighscore = function () {
  registrer = false;
  for(var i=0; i<5; i++){
    if(bestscore>highscore[i].score){
      registrer = true;
    }
  }
  if(registrer){
    database.collection("highscore").doc().set({
      name: this.playername,
      score: this.bestscore
    });
  }
}
