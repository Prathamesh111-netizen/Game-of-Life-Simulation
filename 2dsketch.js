var canvaswidth =  1400;
var canvasheight = 600;
var len = 40;
var cols = canvaswidth / len; 
var rows = canvasheight / len;


var colors = [];
var Neighbours_count = [];

// Drawing section

function setup() {
  createCanvas(1400, 600);
  for (var i = 0; i < rows; i++){
    colors[i] = [];
    Neighbours_count[i] = [];
    for (var j = 0; j < cols; j++){
      colors[i].push(255);
      Neighbours_count[i].push(0);
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


// Logic Section : Finding Neighbours
function __findneighboursCount(){

  for (var i = 0; i < rows; i++){
    for (var j = 0; j < cols; j++){
      Neighbours_count[i][j] = 0;
      // there are maximum  8 neighbors for each cell
      // ++
      if ( i + 1 < rows && j + 1 < cols && isActive(i + 1, j + 1))
        Neighbours_count[i][j]++;
      // --
      if ( i - 1 >= 0 && j - 1 >= 0 && isActive(i - 1, j - 1))
        Neighbours_count[i][j]++;
      // +-
      if ( i + 1 < rows && j - 1 >= 0 && isActive(i + 1, j - 1))
        Neighbours_count[i][j]++;
      // -+
      if ( i - 1 >= 0 && j + 1 < cols && isActive(i - 1, j + 1))
        Neighbours_count[i][j]++;
      // +0
      if ( i + 1 < rows && j < cols && isActive(i + 1, j))
        Neighbours_count[i][j]++;
      // -0
      if ( i - 1 >= 0 && j < cols && isActive(i - 1, j))
        Neighbours_count[i][j]++;
      // 0+
      if ( i < rows && j + 1 < cols && isActive(i, j + 1))
        Neighbours_count[i][j]++;
      // 0-
      if ( i < rows && j - 1 >= 0 && isActive(i, j - 1))
        Neighbours_count[i][j]++;
    }
  }
}

function isActive(i, j){
  if (colors[i][j] == 1)
    return true;
  else
    return false;
}

// Logic Section : Next Generation
// Any live cell with fewer than two live neighbours dies, as if by underpopulation.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overpopulation.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

// Any live cell with two or three live neighbours survives.
// Any dead cell with three live neighbours becomes a live cell.
// All other live cells die in the next generation. Similarly, all other dead cells stay dead.
function __nextGeneration(){
  __findneighboursCount();
  for (var i = 0; i < rows; i++){
    for (var j = 0; j < cols; j++){

      if (isActive(i, j)){
        if (Neighbours_count[i][j] > 3 || Neighbours_count[i][j] < 2)
          ToggleState(i, j);
      }
      else{
        if (Neighbours_count[i][j] == 3 )
          ToggleState(i, j);
      }

    }
  }
}


// function stop and start functionality
var statusGen = false;
var GenID;

function Control(){
  const button = document.getElementById("PlayPause");
  if (statusGen == true){
    clearInterval(GenID);
    button.innerHTML = "Play";
  }
  else{
    button.innerHTML = "Pause";
    GenID = setInterval(__nextGeneration, 200);
  }
  statusGen = !statusGen;
}

function Clear(){
  for (var i = 0; i < rows; i++)
    for (var j = 0; j < cols; j++)
      colors[i][j] = 255;
}

// export {
//   Neighbours_count,
//   colors
// };
