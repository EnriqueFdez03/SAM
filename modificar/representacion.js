let sam;
let actualizar = false;

function setup() {
    createCanvas(800, 600, WEBGL);
    sam = new SAM();
    sam.getParams();
    /*document.getElementById("simulate").onclick = actualizar = true;
    document.getElementById("restart").onclick = sam.restart();
    document.getElementById("stop").onclick = actualizar = false ;*/
    creaBotones();
}


function draw() {
    background(0);

    ambientLight(100, 100, 100);
    pointLight(250, 250, 250, 1000, 1000, 100);

    push();
    ambientMaterial(color(204, 42, 0));
    noStroke();
    translate(-130, 0);
    rect(0, 0, 300, 50);

    push();
    noStroke();
    ambientMaterial(color(204, 42, 0));
    rotate(2.35619)
    rect(-50, -50, 20, 100);

    noStroke();
    ambientMaterial(color(130,130,130));
    circle(-40, 50, 30);
    pop();


    push();
    rotate(0.785398)
    noStroke();
    ambientMaterial(color(204, 42, 0));
    rect(160, -250, 20, 100);

    noStroke();
    ambientMaterial(color(130,130,130));
    circle(170, -260, 30);
    pop();

    push();
    stroke(163, 73, 164);
    line(-20,-80,320,-80);
    pop();

    calculateNewPosition();
}


function calculateNewPosition(){
    if(actualizar){
        sam.iteracion();
    }

    let r = sam.r;
    let theta = sam.theta;


    let largo = 2 - r;
    largo = largo < 0 ? 0 : (largo*100);

    x = (r*sin(theta))*100;
    y = (r*cos(theta))*100;


    push();
    stroke(color(200, 0, 0));
    beginShape(POINTS);
    noFill();
    endShape();
    pop();


    push();
    noStroke();
    ambientMaterial(color(255, 0, 0));
    //Pasar los parámetros del cálculo para actualizar las coordenadas de la bola "pequeña"
    circle(320+x, -80+y,20);
    pop();
  
    push();
    noStroke();
    ambientMaterial(color(0, 0, 255));
    //Pasar los parámetros del cálculo para actualizar las coordenadas de la bola "grande"
    circle(-20,-80+largo,35);
    pop();
  
    push();
    stroke(color(163, 73, 164));
    // Cuerda a la bola pequeña
    line(320+x, -80+y, 320, -80);
    // Cuerda a la bola grande
    line(-20, -80+largo, -20, -80);
    pop();
  
}


function drawTransition(){
    beginShape(POINTS);
    stroke(color(160, 160, 150));
    //Vertices
    endShape();
}


function creaBotones(){
    push();
    ambientLight(100, 100, 100);
    pointLight(250, 250, 250, 1000, 1000, 100);
    stroke(color(160, 160, 150));
    start_button = createButton("Start");
    start_button.mouseClicked(toggleSketch);
    start_button.position(0,500);

    reset_button = createButton("Reset");
    reset_button.html("reset");
    reset_button.position(0, 450);
    reset_button.mousePressed(resetButton);
    pop();
}


function toggleSketch() {
    if(actualizar) {
      start_button.html("start");
      actualizar = false;
    } else {
      start_button.html("stop");
      actualizar = true;
    }
}

function resetButton() {
    if(actualizar) {
      toggleSketch();
    }
    sam = new SAM();
}