let sam;
let sam2;
let sam2enabled = false;
let actualizar = false;
let recorrido;
let recorrido2;
let sensitivityMode = false;
let delta;
let hideSAM = false;


let startBtn, pauseBtn, restartBtn, zoom_in, zoom_out, arrows_img, scroll_img;
function preload() {
    startBtn = createImg('icons/play.svg', 'Start');
    pauseBtn = createImg('icons/pause.svg', 'Pause');
    restartBtn = createImg('icons/restart.svg', 'Restart');
    zoom_in = createImg('icons/zoom-in.svg', 'Zoom In');
    zoom_out = createImg('icons/zoom-out.svg', 'Zoom Out');

    scroll_img = createImg('icons/scroll.png', 'Scroll');
    scroll_img.style('-webkit-filter', 'grayscale(1) invert(1)');
    arrows_img = createImg('icons/arrows.png', 'Arrows');
    arrows_img.style('-webkit-filter', 'grayscale(1) invert(1)');
    
    startBtn.style('cursor','pointer');
    pauseBtn.style('cursor','pointer');
    restartBtn.style('cursor','pointer');
    zoom_in.style('cursor','pointer');
    zoom_out.style('cursor','pointer');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    sam = new SAM();
    sam.getParams();
    recorrido = [];
    creaBotones();
}

function setup2() {
    sam2enabled = true;
    sam2 = new SAM();
    sam2.getParams(true);
    recorrido2 = [];
}

function windowResized() {
    pauseBtn.position(windowWidth/2 - 80, 15);
    startBtn.position(windowWidth/2 - 80, 15);
    restartBtn.position(windowWidth/2 - 40, 15);
    zoom_in.position(windowWidth/2, 15);
    zoom_out.position(windowWidth/2 + 40, 15);

    scroll_img.position(windowWidth - 90, windowHeight - 90);
    arrows_img.position(windowWidth - 160, windowHeight - 90);  

    resizeCanvas(windowWidth, windowHeight);
}

let escala = 1.5;
let translationx = 0, translationy = 0;
function draw() {
    scale(escala);
    background(0);
    ambientLight(100, 100, 100);
    pointLight(250, 250, 250, 1000, 1000, 100);
    //console.log(translationx,translationy)
    translate(-150+translationx, 0+translationy);

    if(hideSAM) {
        translate(-170, 0);
        calculateNewPosition();
        dibujaRecorrido();
        return;
    }

    
    pulleyBase();
    calculateNewPosition();
    dibujaRecorrido();
}

function pulleyBase() {
    //base poleas
    push();
    ambientMaterial(color(204, 42, 0));
    
    
    rect(0, 0, 300, 50);

    // resorte polea 1
    push();
    noStroke();
    ambientMaterial(color(204, 42, 0));
    rotate(2.35619)
    rect(-50, -50, 20, 100);
    pop();

    //polea 1
    push();
    rotate(2.35619)
    ambientMaterial(color(163, 73, 164, 255));
    
    circle(-40, 52, 30);
    pop();

    push();
    //noStroke();
    rotate(2.35619)
    ambientMaterial(color(130,130,130));
    circle(-40, 50, 30);
    pop();

    // resorte polea 2
    push();
    rotate(0.785398)
    noStroke();
    ambientMaterial(color(204, 42, 0));
    rect(160, -250, 20, 100);
    pop();

    // polea 2
    push();
    rotate(0.785398)
    ambientMaterial(color(163, 73, 164, 255));
    circle(170, -262, 30);
    pop();

    push();
    rotate(0.785398)
    ambientMaterial(color(130,130,130,255));
    circle(170, -260, 30);
    pop();

    //cuerda
    push();
    stroke(163, 73, 164);
    line(-23,-79,320,-79);
    pop();
}

function calculateNewPosition(){
    if(actualizar){
        sam.iteracion();
    }


    let r = sam.r;
    let theta = sam.theta;

    let x = (r*sin(theta))*100;
    let y = (r*cos(theta))*100;

    let x2, y2, r2, theta2, distance;
    if (sam2enabled) {
        if(actualizar){
            sam2.iteracion();
        }

        distance = sam.distance(sam2);
        
        r2 = sam2.r;
        theta2 = sam2.theta;

        x2 = (r2*sin(theta2))*100;
        y2 = (r2*cos(theta2))*100;

        if (distance > delta && sensitivityMode) {
            console.log("hola")
            disableSensitivity();
            startStop();
        }
    }

    if(actualizar){
        recorrido.push([x, y]);
        if (sam2enabled) {
            recorrido2.push([x2,y2]);
        }
        if(recorrido.length>10){
            recorrido.shift();
            if (sam2enabled) {
                recorrido2.shift();
            }
        }
    }

    if(hideSAM) {return}

    // para limitar la subida de la bola grande
    let largo = 2 - r;
    largo = largo < 0 ? 0 : (largo*100);
    let largo2 = 2 - r2;
    largo2 = largo2 < 0 ? 0 : (largo2*100);
    drawMasses(x,y,x2,y2,largo,largo2);
}

function drawMasses(x,y,x2,y2,largo,largo2) {
    push();
    ambientMaterial(color(255, 0, 0));
    //Pasar los parámetros del cálculo para actualizar las coordenadas de la bola "pequeña"
    circle(320+x, -79+y,20);
    pop();
  
    push();
    ambientMaterial(color(0, 0, 255));
    //Pasar los parámetros del cálculo para actualizar las coordenadas de la bola "grande"
    circle(-23,-79+largo,35);
    pop();

    push();
    stroke(color(163, 73, 164));
    // Cuerda a la bola pequeña
    line(320+x, -79+y, 320, -79);
    // Cuerda a la bola grande
    line(-23, -96.5+largo, -23, -79);
    pop();
    

    if(sam2enabled) {
        push();
        stroke(color(163, 73, 164));
        // Cuerda a la bola pequeña
        line(320+x2, -79+y2, 320, -79);
        // Cuerda a la bola grande
        line(-23, -96.5+largo2, -23, -79);
        pop();

        push();
        ambientMaterial(color(0, 140, 23));
        //Pasar los parámetros del cálculo para actualizar las coordenadas de la bola "pequeña"
        circle(320+x2, -79+y2,20);
        pop();
      
        push();
        ambientMaterial(color(184, 184, 0));
        //Pasar los parámetros del cálculo para actualizar las coordenadas de la bola "grande"
        circle(-23,-79+largo2,35);
        pop();
    }
}


function dibujaRecorrido(){
    push();
    beginShape();
    noFill();
    stroke(color(200, 0, 0));
    for(let i = 0; i < recorrido.length ; ++i){
        let pt = recorrido[i];
        vertex(320+pt[0], -79+pt[1]);
    }
    endShape();
    pop();

    if(sam2enabled) {
        push();
        beginShape();
        noFill();
        stroke(color(0, 200, 0));
        for(let i = 0; i < recorrido.length ; ++i){
            let pt2 = recorrido2[i];
            vertex(320+pt2[0], -79+pt2[1]);
        }
        endShape();
        pop();
    }
}

function creaBotones(){
    push();
    ambientLight(100, 100, 100);
    pointLight(250, 250, 250, 1000, 1000, 100);
    stroke(color(160, 160, 150));

    scroll_img.style('width','60px');
    arrows_img.style('width','60px');
    scroll_img.style('opacity','0.5');
    arrows_img.style('opacity','0.5');

    startBtn.style('-webkit-filter', 'grayscale(1) invert(1)');
    restartBtn.style('-webkit-filter', 'grayscale(1) invert(1)');
    pauseBtn.style('-webkit-filter', 'grayscale(1) invert(1)');
    zoom_in.style('-webkit-filter', 'grayscale(1) invert(1)');
    zoom_out.style('-webkit-filter', 'grayscale(1) invert(1)');
    pauseBtn.style('display', 'none')

    pauseBtn.position(windowWidth/2 - 80, 15).mousePressed(startStop);
    startBtn.position(windowWidth/2 - 80, 15).mousePressed(startStop);
    restartBtn.position(windowWidth/2 - 40, 15).mousePressed(resetButton);
    zoom_in.position(windowWidth/2, 15).mousePressed(zoomIn);
    zoom_out.position(windowWidth/2 + 40, 15).mousePressed(zoomOut);
    scroll_img.position(windowWidth - 90, windowHeight - 90);
    arrows_img.position(windowWidth - 160, windowHeight - 90);   

    pop();
}

// Button events
function startStop() {
    if(actualizar) {
        startBtn.style('display','inline');
        pauseBtn.style('display','none');
        actualizar = false;
    } else {
        startBtn.style('display','none');
        pauseBtn.style('display','inline');
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

    if (sam2enabled) {
        sam2 = new SAM();
        sam2.getParams(true);
        recorrido2 = [];

        let epsilon = sam2.distance(sam);
        document.getElementById("epsilon").innerHTML = epsilon.toFixed(14);

        if(sensitivityMode) {
            delta = parseFloat(document.getElementById("delta").value);
        }
    }
}

function zoomIn() {
    escala = Math.min(4, escala+0.1);
}

function zoomOut() {
    escala = Math.max(0.2, escala-0.1);
}

// si se cambian los parámetros del SAM...
function paramsChange(e) {
    if (e.keyCode === 13) {
        resetButton();
    }
}

//listeners de sam2..
function enableSam2() {
    document.getElementsByTagName("input").forEach(e => {
        if (e.id != "delta") {
            e.disabled = false;
        }
    });
    document.getElementsByClassName("subtitle")[0].classList.remove("disabled");

    setup2();
    resetButton();
}

function disableSam2() {
    document.getElementsByTagName("input").forEach(e => {
        if(e.id.includes("2")&&e.type=="text" || e.className.includes("sensibility")) {
            e.disabled = true;
        }
    });
    document.getElementsByClassName("subtitle")[0].classList.add("disabled");

    sam2enabled = false;
    sam2 = new SAM(true);
    recorrido2 = [];
    resetButton();
}

function enableSensitivity() {
    let deltaInput = document.getElementById("delta");
    deltaInput.disabled = false;
    sensitivityMode = true;
    delta = parseFloat(deltaInput.value);
}

function disableSensitivity() {
    let deltaInput = document.getElementById("delta");
    document.getElementById("Sensibilidad").checked = false;
    deltaInput.disabled = true;
    sensitivityMode = false;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('sam2enabled').checked = false;
    document.getElementById('Sensibilidad').checked = false;
    
    document.getElementsByTagName('input').forEach(element => {
        element.addEventListener('keyup',paramsChange);
    });
    //mostrar sólo órbita
    document.getElementById("onlyOrbit").addEventListener('change', function() {
        if(this.checked) {
            hideSAM = true;
        } else {
            hideSAM = false;
        }
    });
    document.getElementById("sam2enabled").addEventListener('change', function() {
        if(this.checked) {
            enableSam2();
        } else {
            disableSam2();
        }
    });
    document.getElementById("Sensibilidad").addEventListener('change', function() {
        if(this.checked) {  
            enableSensitivity();
        } else {
            disableSensitivity();
        }
    });
});

//mover figura
const min=-50,max=50;
document.addEventListener('keydown',(t) => {
    //izq
    if (t.key=="ArrowLeft") {
        translationx -= 5;
    //arriba
    } else if(t.key=="ArrowDown") {
        translationy += 5;
    //dcha
    } else if(t.key=="ArrowRight") {
        translationx += 5;
    //abajo
    } else if(t.key=="ArrowUp") {
        translationy -= 5;
    }
});

//evento de zoom pero con scroll
document.addEventListener("wheel", (e) => {
    if (e.deltaY < 0)
    {
        zoomIn();
    }
    else if (e.deltaY > 0)
    {
        zoomOut();
    }
});



