var canvaswidth =  800;
var canvasheight = 16000;
var len = 4;
var cols = canvaswidth / len; 
var rows = canvasheight / len;
var Colour = 1
var noColour = 255

var colors = [];
var currentGeneration = 0;
var TotalGenerations = 0;
var time = 0;
var pausetime = 0;
var statusGen = false;
var GenID;

var rule = new Map();
// Drawing section

function setup() {
  createCanvas(800, 16000);   // create a initial canvas
//   console.log(getFrameRate())
//   frameRate(30)

  // intialise the canvas elements
  for (var i = 0; i < rows; i++){
    colors[i] = [];
    for (var j = 0; j < cols; j++){
      colors[i].push(255);
      if ( i == 0 && j == cols / 2)
        colors[i][j] = 1
    }
  }

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
  noLoop();
}

function draw() {
    // for (var j = 0; j < cols; j++){
    //     var x = j * len;
    //     var y = currentGeneration * len;
    //     fill(colors[currentGeneration][j])      
    //     noStroke();
    //     rect(x, y, 40, 40); 
    // }
    // noLoop();
}

function __overrideDraw(){
    for (var i = 0; i < rows; i++)
        {
            for (var j = 0; j < cols; j++){
                var x = j * len;
                var y = i * len;
                fill(colors[i][j])      
                noStroke();
                rect(x, y, 40, 40);
            } 
        }
}

function __currentGenerationDraw(){
    for (var j = 0; j < cols; j++){
        var x = j * len;
        var y = currentGeneration * len;
        fill(colors[currentGeneration][j])      
        noStroke();
        rect(x, y, 40, 40);
    } 
}

function Clear(){
    for (var i = 0; i <= currentGeneration; i++)
      for (var j = 0; j < cols; j++){
        colors[i][j] = 255;
      if ( i == 0 && j == cols / 2)
          colors[i][j] = 1
    }
      __overrideDraw();
      currentGeneration = 0;
      TotalGenerations = 1;
      time = 0;
      pausetime = 0;
      var totalgen = document.getElementById("currentGen");
    totalgen.innerHTML = 1;
    var timeelap = document.getElementById("timeelap");
    timeelap.innerHTML =0;
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





function __scrollGenerations(){
    for (var i = 1; i < rows; i++)
        for (var j = 0; j < cols; j++)
            colors[i - 1][j] = colors[i][j];
    currentGeneration--;
}

function __compute_nextGeneration(){
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
}

function __nextGeneration(){
    
    // if next gen is in the void
    // we need to scroll each layer in upward direction
    if (currentGeneration + 1 >= rows){
        __scrollGenerations();
        __compute_nextGeneration();
        __overrideDraw();
    }
    else{
        __compute_nextGeneration();
        __currentGenerationDraw();
    }
    TotalGenerations++;

    var totalgen = document.getElementById("currentGen");
    totalgen.innerHTML = TotalGenerations;
    var timeelap = document.getElementById("timeelap");
    timeelap.innerHTML =( Date.now() - time)/1000;
    
}


// controls

// form input for rules
function Control(){
  const button = document.getElementById("PlayPause");
  if (statusGen == true){
    clearInterval(GenID);
    button.innerHTML = "Play";
}
else{
      if (time == 0)
          time = Date.now();
    button.innerHTML = "Pause";
    GenID = setInterval(__nextGeneration);
  }
  statusGen = !statusGen;
}

// Confirm the Rule for upcoming generations: form input of checkboxes
function changeRule(){
    var elements = document.getElementById("rule").elements;
    for(var i = 0 ; i < elements.length - 1 ; i++){
        var item = elements.item(i);
        rule.set(item.name, item.checked)
    }
    return false;
}
function changeRuleDirect(){
    var elements = document.getElementById("ruleDirect").elements;
    for(var i = 0 ; i < elements.length - 1; i++){
        var item = elements.item(i);
        console.log(item)
        console.log(item.checked)
        if (item.checked == true && item.name == 30){
            rule.set("111", false);
            rule.set("110", false);
            rule.set("101", false);
            rule.set("100", true);
            rule.set("011", true);
            rule.set("010", true);
            rule.set("001", true);
            rule.set("000", false);
        }
        else if (item.checked == true && item.name == 54){
            rule.set("111", false);
            rule.set("110", false);
            rule.set("101", true);
            rule.set("100", true);
            rule.set("011", false);
            rule.set("010", true);
            rule.set("001", true);
            rule.set("000", false);
        }
        else if (item.checked == true && item.name == 90){
            rule.set("111", false);
            rule.set("110", true);
            rule.set("101", false);
            rule.set("100", true);
            rule.set("011", true);
            rule.set("010", false);
            rule.set("001", true);
            rule.set("000", false);
        }
        else if (item.checked == true && item.name == 94){
            rule.set("111", false);
            rule.set("110", true);
            rule.set("101", false);
            rule.set("100", true);
            rule.set("011", true);
            rule.set("010", true);
            rule.set("001", true);
            rule.set("000", false);
        }
        else if (item.checked == true && item.name == 110){
            rule.set("111", false);
            rule.set("110", true);
            rule.set("101", true);
            rule.set("100", false);
            rule.set("011", true);
            rule.set("010", true);
            rule.set("001", true);
            rule.set("000", false);
        }
        else if (item.checked == true && item.name == 150){
            rule.set("111", true);
            rule.set("110", false);
            rule.set("101", false);
            rule.set("100", true);
            rule.set("011", false);
            rule.set("010", true);
            rule.set("001", true);
            rule.set("000", false);
        }
    }
    console.log(rule)
    return false;
}


