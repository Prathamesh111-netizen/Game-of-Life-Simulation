var canvaswidth =  800;
var canvasheight = 600;
var len = 4;
var cols = canvaswidth / len; 
var rows = canvasheight / len;
var Colour = 1
var noColour = 255

var colors = [];
var currentGeneration = 0;
var time = 0;

// Drawing section

function setup() {
  createCanvas(800, 600);
  for (var i = 0; i < rows; i++){
    colors[i] = [];
    for (var j = 0; j < cols; j++){
      colors[i].push(255);
      if ( i == 0 && j == cols / 2){
        colors[i][j] = 1
        }
    }
  }
}

function draw() {
  background(220);
  for (var i = 0; i < rows; i++)
  for (var j = 0; j < cols; j++){
  {
      var x = j * len;
      var y = i * len;
      fill(colors[i][j])      
      noStroke();
      rect(x, y, 40, 40); 
      
    }
  }
}

function mousePressed(){
    for (var i = 0; i < rows; i++){
      for (var j = 0; j < cols; j++){
        var x = j * len;
        var y = i * len;
        if (isInside(x, y, len, len)){
          ToggleState(i, j);
        }
      }
    }
}
  
function isInside(x, y, w, h){
    if(mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) 
      return true; 
    else 
      return false;
}
  
function ToggleState(i, j){
      if (colors[i][j] == 255)
        colors[i][j] = 1;
      else
        colors[i][j] = 255;
}

function isActive(i, j){
    if (colors[i][j] == 1)
      return true;
    else
      return false;
  }
// till generations are less than rows : up to down
// afterwards, generations will come on down part and each prev generation will be gone



// Confirm the Rule for upcoming generations
var rule = new Map();
function changeRule(){
    var elements = document.getElementById("rule").elements;
    for(var i = 0 ; i < elements.length - 1 ; i++){
        var item = elements.item(i);
        rule.set(item.name, item.checked)
    }
    return false;
}

function __nextGeneration(){
    var i = currentGeneration;
    var str = "0";

    for ( var j = 0; j < cols; j++){
        if ( j == 0){
            str += isActive(currentGeneration, j) ? "1" : "0";
            str += isActive(currentGeneration, j + 1) ? "1" : "0";
        }
        else if ( j == cols - 1){
            str = str.substring(1);
            str += "0";
        }
        else{
            str = str.substring(1);
            str += isActive(currentGeneration, j + 1) ? "1" : "0";
        }

        var nextGenValue = rule.get(str);
        colors[currentGeneration + 1][j] = nextGenValue == true ? Colour : noColour;
    }
    currentGeneration++;
    var totalgen = document.getElementById("currentGen");
    totalgen.innerHTML = currentGeneration;
    var timeelap = document.getElementById("timeelap");
    timeelap.innerHTML =( Date.now() - time)/1000;
}






// controls
var statusGen = false;
var GenID;

function Control(){
  const button = document.getElementById("PlayPause");
  if (statusGen == true){
    clearInterval(GenID);
    button.innerHTML = "Play";
  }
  else{
    if (time == 0)
      time = Date.now()
    button.innerHTML = "Pause";
    GenID = setInterval(__nextGeneration, 1);
  }
  statusGen = !statusGen;
}

function Clear(){
  for (var i = 0; i < rows; i++)
    for (var j = 0; j < cols; j++)
      colors[i][j] = 255;

    currentGeneration = 0;
    time = 0;
}
