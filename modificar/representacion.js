let sam;
let actualizar = false;
let recorrido;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    sam = new SAM();
    sam.getParams();
    recorrido = [];
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
    pop();

    push();
    rotate(2.35619)
    ambientMaterial(color(163, 73, 164, 255));
    circle(-40, 52, 30);
    pop();

    push();
    noStroke();
    rotate(2.35619)
    ambientMaterial(color(130,130,130));
    circle(-40, 50, 30);
    pop();


    push();
    rotate(0.785398)
    noStroke();
    ambientMaterial(color(204, 42, 0));
    rect(160, -250, 20, 100);
    pop();

    push();
    rotate(0.785398)
    ambientMaterial(color(163, 73, 164, 255));
    circle(170, -262, 30);
    pop();

    push();
    rotate(0.785398)
    noStroke();
    ambientMaterial(color(130,130,130,255));
    circle(170, -260, 30);
    pop();


    push();
    stroke(163, 73, 164);
    line(-23,-79,320,-79);
    pop();

    calculateNewPosition();
    dibujaRecorrido();
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

    if(actualizar){
        recorrido.push([x, y]);
        if(recorrido.length>1000000){
            recorrido.pop();
        }
    }

    push();
    noStroke();
    ambientMaterial(color(255, 0, 0));
    //Pasar los parámetros del cálculo para actualizar las coordenadas de la bola "pequeña"
    circle(320+x, -79+y,20);
    pop();
  
    push();
    noStroke();
    ambientMaterial(color(0, 0, 255));
    //Pasar los parámetros del cálculo para actualizar las coordenadas de la bola "grande"
    circle(-23,-79+largo,35);
    pop();
  
    push();
    stroke(color(163, 73, 164));
    // Cuerda a la bola pequeña
    line(320+x, -79+y, 320, -79);
    // Cuerda a la bola grande
    line(-23, -79+largo, -23, -79);
    pop();
  
}


function dibujaRecorrido(){
    push();
    beginShape();
    noFill();
    stroke(color(200, 0, 0));
    for(let i = 0; i < recorrido.length ; ++i){
        pt = recorrido[i];
        vertex(320+pt[0], -79+pt[1]);
    }
    endShape();
    pop();
}


function creaBotones(){
    push();
    ambientLight(100, 100, 100);
    pointLight(250, 250, 250, 1000, 1000, 100);
    stroke(color(160, 160, 150));
    start_button = createButton("Start");
    start_button.mouseClicked(startStop);
    start_button.position(650,100);

    reset_button = createButton("Reset");
    reset_button.position(700, 100);
    reset_button.mousePressed(resetButton);
    pop();
}


function startStop() {
    if(actualizar) {
      start_button.html("Start");
      actualizar = false;
    } else {
      start_button.html("Stop");
      actualizar = true;
    }
}

function resetButton() {
    if(actualizar) {
      startStop();
    }
    sam = new SAM();
    sam.getParams();
    recorrido = [];
    creaBotones();
}