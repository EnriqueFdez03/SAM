let sam;
let sam2;
let sam2enabled = false;
let actualizar = false;
let recorrido;
let recorrido2;
let delta;
let sensitivityMode = false;
let hideSAM = false;


let startBtn, pauseBtn, restartBtn, zoom_in, zoom_out, arrows_img, scroll_img, chartBtn;
function preload() {
    // load buttons
    startBtn = createImg('icons/play.svg', 'Start');
    pauseBtn = createImg('icons/pause.svg', 'Pause');
    restartBtn = createImg('icons/restart.svg', 'Restart');
    zoom_in = createImg('icons/zoom-in.svg', 'Zoom In');
    zoom_out = createImg('icons/zoom-out.svg', 'Zoom Out');
    chartBtn = createImg('icons/chart.svg', 'Chart');

    scroll_img = createImg('icons/scroll.png', 'Scroll');
    scroll_img.style('-webkit-filter', 'grayscale(1) invert(1)');
    arrows_img = createImg('icons/arrows.png', 'Arrows');
    arrows_img.style('-webkit-filter', 'grayscale(1) invert(1)');
    
    startBtn.style('cursor','pointer');
    pauseBtn.style('cursor','pointer');
    restartBtn.style('cursor','pointer');
    zoom_in.style('cursor','pointer');
    zoom_out.style('cursor','pointer');
    chartBtn.style('cursor','pointer');
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
    setBtnPositions();
    resizeCanvas(windowWidth, windowHeight);
}

function setBtnPositions() {
    pauseBtn.position(windowWidth/2 - 120, 15);
    startBtn.position(windowWidth/2 - 120, 15);
    restartBtn.position(windowWidth/2 - 80, 15);
    chartBtn.position(windowWidth/2 - 40, 15);
    zoom_in.position(windowWidth/2, 15);
    zoom_out.position(windowWidth/2 + 40, 15);
    scroll_img.position(windowWidth - 90, windowHeight - 90);
    arrows_img.position(windowWidth - 160, windowHeight - 90);
}

let escala = 1.5;
let translationx = 0, translationy = 0;
function draw() {
    scale(escala);
    background(0);
    ambientLight(200, 200, 200);
    pointLight(250, 250, 250, 1000, 1000, 100);
    translate(-150+translationx, 0+translationy);

    if(hideSAM) {
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

let lenRecorrido = 100000000;
let tiempo = 0;
let iteraciones = 0;
let acumTheta = [];
let acumR = [];
let acumTheta2 = [];
let acumR2 = [];
let distancias = [];
let acumHistorial1 = [];
let acumHistorial2 = [];
function calculateNewPosition(){
    let r,theta;
    if(actualizar){
        let acum = sam.iteracion().acum;
        tiempo += sam.pasos/1000;
        iteraciones += 1;
        document.getElementById("time").innerHTML = `Tiempo: ${tiempo.toFixed(3)}s`;
        if (sam2enabled) {
            acumHistorial1 = acumHistorial1.concat(acum);        
        }
    }

    r = sam.r;
    theta = sam.theta;

    let x = (r*sin(theta))*100;
    let y = (r*cos(theta))*100;

    let x2, y2, r2, theta2, distance;

    if(!sam2enabled) {
        document.getElementById("distance").innerHTML = "";
    }
    if (sam2enabled) {
        if(actualizar){
            let acum2 = sam2.iteracion().acum;
            acumHistorial2 = acumHistorial2.concat(acum2);
        }
        
        distance = sam.distance(sam2);

        document.getElementById("distance").innerHTML = `Distancia ${distance.toFixed(8)} metros`
        
        
        r2 = sam2.r;
        theta2 = sam2.theta;

        x2 = (r2*sin(theta2))*100;
        y2 = (r2*cos(theta2))*100;

        if (distance > delta && sensitivityMode && actualizar) {
            startStop();
            disableSensitivity(false);
        }
    }

    if(actualizar){
        recorrido.push([x, y]);
        acumTheta.push(theta);
        acumR.push(r);
        if (sam2enabled) {
            recorrido2.push([x2,y2]);
            acumTheta2.push(theta2);
            acumR2.push(r2);
            distancias.push(distance);
        }
        if(recorrido.length>lenRecorrido){
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
    stroke(color(163, 73, 164));
    // Cuerda a la bola pequeña
    line(320+x, -79+y, 320, -79);
    // Cuerda a la bola grande
    line(-23, -96.5+largo, -23, -79);
    pop();

    push();
    ambientMaterial(color( 0, 0, 255));
    fill(255,0,0,255);
    //Pasar los parámetros del cálculo para actualizar las coordenadas de la bola "pequeña"
    circle(320+x, -79+y,20);
    pop();
  
    push();
    ambientMaterial(color(0, 0, 255));
    //Pasar los parámetros del cálculo para actualizar las coordenadas de la bola "grande"
    circle(-23,-79+largo,35);
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
    stroke(color(255, 0, 0));
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
        stroke(color(0, 255, 0));
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
    chartBtn.style('-webkit-filter', 'grayscale(1) invert(1)');
    pauseBtn.style('display', 'none')

    setBtnPositions();

    pauseBtn.mousePressed(startStop);
    startBtn.mousePressed(startStop);
    restartBtn.mousePressed(resetButton);
    zoom_in.mousePressed(zoomIn);
    zoom_out.mousePressed(zoomOut);
    chartBtn.mousePressed(showChart);

    pop();
}

let showingChart = false;
let lyapunov;
function showChart() {

    //calculo lyapunov
    if (epsilon < 0.01) {
        lyapunov = calcLyapunov(epsilon);
    }

    if (showingChart) {
        hideChart();
        return;
    }
    if(actualizar) {
        startStop(true);
    } 
    if(recorrido.length == 0) {
        alert("No ha habido simulación")
        return;
    }
    
    showingChart = true;
    document.getElementById("chartContainer").style.display = 'inline-block';

    let chart1 = document.getElementById('chart1');
    chart1.style.display = 'block';
    
    
    createChart(chart1);

    if (sam2enabled) {
        let chart2 = document.getElementById('chart2');
        let chart3 = document.getElementById('chart3');
        chart2.style.display = 'block';
        chart3.style.display = 'block';
        createChart(chart2,code=2);
        createChart(chart3,code=3);
        if (epsilon < 0.01) {
            let chart4 = document.getElementById('chart4');
            chart4.style.display = 'block';
            createChart(chart4,code=4);
        }
    }
}

function createChart(chart,code=1) {
    let n = recorrido.length;
    let y1,y2;
    
    if (code == 3) {
        var layout = {
            title: `Distancias entre SAM 1 y 2`,
            yaxis: {title:'Distancia (metros)'},
        }    

        Plotly.newPlot( chart, [{
            x: [...Array(n).keys()],
            y: distancias }],
            layout );
        return;
    }
    if (code == 4) {
        let lyaN = lyapunov.length;
        var layout = {
            title: `Exponente de Lyapunov`,
            yaxis: {title:'Lambda'},
        }    

        Plotly.newPlot( chart, [{
            x: [...Array(lyaN).keys()],
            y: lyapunov }],
            layout );
        return;
    }


    if (code==1) {
        y1 = acumTheta;
        y2 = acumR;
    } else  {
        y1 = acumTheta2;
        y2 = acumR2;
    }
    
    let trace1 = {
        x: [...Array(n).keys()],
        y: y1,
        name: 'Theta (rads)',
        type: 'scatter'
    };
      
    var trace2 = {
        x: [...Array(n).keys()],
        y: y2,
        name: 'r (metros)',
        yaxis: 'y2',
        type: 'scatter'
    };

    var data = [trace1, trace2];

    var layout = {
    title: `SAM ${code}`,
    yaxis: {title: 'theta (radianes)'},
    yaxis2: {
        title: 'r (metros)',
        titlefont: {color: 'rgb(148, 103, 189)'},
        tickfont: {color: 'rgb(148, 103, 189)'},
        overlaying: 'y',
        side: 'right'
    }
    
    };
    

    Plotly.newPlot(chart, data, layout);
}

function hideChart() {
    showingChart = false;
    document.getElementById("chartContainer").style.display = 'none';
    document.getElementById('chart1').style.display = 'none';
    document.getElementById('chart2').style.display = 'none';
    document.getElementById('chart3').style.display = 'none';
    document.getElementById('chart4').style.display = 'none';
}

// Button events
function startStop(showChrt = false) {
    if(!showChrt) {
        hideChart();
    }
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

let epsilon = 0;
function resetButton() {
    hideChart();
    tiempo = 0;
    iteraciones = 0;

    if(actualizar) {
      startStop();
    }
    let pasos = parseInt(document.getElementById("pasos").value)
    pasos = pasos ? pasos : 10;

    sam = new SAM();
    sam.getParams(false,pasos);
    recorrido = [];
    acumTheta = [];
    acumR = [];
    acumR2 = [];
    acumTheta2 = [];
    distancias = [];
    acumHistorial1 = [];
    acumHistorial2 = [];
    creaBotones();

    if (sam2enabled) {
        sam2 = new SAM();
        sam2.getParams(true,pasos);
        recorrido2 = [];

        epsilon = sam2.distance(sam);
        document.getElementById("epsilon").innerHTML = epsilon.toFixed(14);
    }
}

function zoomIn() {
    hideChart();
    escala = Math.min(30, escala+0.2);
}

function zoomOut() {
    hideChart();
    escala = Math.max(0.2, escala-0.2);
}

// si se cambian los parámetros del SAM...
function paramsChange(e) {
    if (e.keyCode === 13) 
        disableSensitivity();{
        let mu = document.getElementById("mu");
        let mu2 = document.getElementById("mu2");
    
        mu.value = mu.value < 0.1 ? 0.1 : mu.value;
        mu2.value = mu2.value < 0.1 ? 0.1 : mu2.value;

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
    sensitivityMode = false;
    sam2 = new SAM(true);

    recorrido2 = [];
    resetButton();
}

function enableSensitivity() {
    let deltaInput = document.getElementById("delta");
    deltaInput.disabled = false;
    sensitivityMode = true;
    delta = parseFloat(deltaInput.value);
    resetButton();
}

function disableSensitivity(reset=true) {
    let deltaInput = document.getElementById("delta");
    document.getElementById("Sensibilidad").checked = false;
    deltaInput.disabled = true;
    sensitivityMode = false;
    if(reset) {
        resetButton();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('sam2enabled').checked = false;
    document.getElementById('Sensibilidad').checked = false;

    let valor = parseFloat(document.getElementById("fade").value);
    valor = valor ? valor : 10000000;
    lenRecorrido = valor;
    
    document.getElementsByTagName('input').forEach(element => {
        if(element.id != "delta") {
            element.addEventListener('keyup',paramsChange);
        }
    });
    document.getElementById("delta").addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
            delta = parseFloat(document.getElementById("delta").value);
            if (!delta) { delta = 0.1;}
            resetButton();
        }
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
    document.getElementById("fade").addEventListener('change', function() {
        let valor = parseFloat(document.getElementById("fade").value);
        valor = valor ? valor : 10000000;
        lenRecorrido = valor;
    });
});

//mover figura
const min=-50,max=50;
document.addEventListener('keydown',(t) => {
    //izq
    if (t.key=="ArrowLeft") {
        translationx -= 10;
    //arriba
    } else if(t.key=="ArrowDown") {
        translationy += 10;
    //dcha
    } else if(t.key=="ArrowRight") {
        translationx += 10;
    //abajo
    } else if(t.key=="ArrowUp") {
        translationy -= 10;
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

function calcLyapunov(epsilon) {
    let iteraciones = acumHistorial1.length;
    let lyapunov = [];
    let lyapunovAcum = 0;
    for(let i = 1; i<=iteraciones; i++) {
        let distancia = distanciaEuclidea(acumHistorial1[i-1],acumHistorial2[i-1]);
        let lyi =  Math.log(distancia/epsilon);
        lyapunovAcum = lyapunovAcum + lyi;
        lyapunov.push(lyapunovAcum/i);
    }
    return lyapunov;
}

function distanciaEuclidea(pos1,pos2) {
    let r1,theta1,r2,theta2;
    r1 = pos1.r_i; 
    theta1 = pos1.t_i;
    r2 = pos2.r_i;
    theta2 = pos2.t_i;

    let x1 = (r1*Math.sin(theta1));
    let y1 = (r1*Math.cos(theta1));

    let x2 = (r2*Math.sin(theta2));
    let y2 = (r2*Math.cos(theta2));

    return Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2))
}
