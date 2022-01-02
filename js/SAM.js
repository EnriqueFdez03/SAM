// Para predecir de manera numérica este problema hemos empleado
// la mecánica hamiltoniana, ya que presenta ecuaciones diferenciales de
// primer orden frente a Euler-Lagrange, que son de segundo orden.

// --- VARIABLES INICIALES ---

let M; // M: Masa del contrapeso. 
let m = 1; // m: Masa de la bola oscilante.
let g = 9.8; // Gravedad
let r0; // Distancia de la bola oscilante de la polea.
let theta0; // Angulo de la bola oscilante con la vertical

let r; // Distancia de la bola oscilante de la polea. Son iguales que r0 y theta0, solo que hay dos por si se desea hacer reset... .
let theta; // Angulo de la bola oscilante con la vertical

// --- VARIABLES QUE INTERVIENEN EN LA RESOLUCIÓN ---
let p_theta = 0; // Momento conjugado asociado a theta. El momento angular!
let dp_theta = 0; // Derivada de la anterior con respecto al tiempo. Eq. a: -dH/dp_thetha (eq. canónicas de Hamilton)

let p_r = 0;// Momento conjugado asociado a r.
let dp_r = 0; // Derivada de la anterior

let dtheta0; //dThetha/dt -> Velocidad angular!
let dr0; //dr/dt -> Velocidad hacia arriba o abajo!
let dtheta; //dThetha/dt -> Velocidad angular!
let dr; //dr/dt -> Velocidad hacia arriba o abajo!

// Instante de tiempo. A más pequeño, más precisión tendrá la predicción,
// pero más lento (obvio). Si se dejan los valores por defecto, retorna r y theta
// tras 10ms
const dt = 0.001;
const pasos = 10;
const iteracion = () => {
    // dt es 0.001 y por defecto 10 pasos. 10*0.001 = 0.01.
    // Luego tras el for se habrá producido el movimiento  de 0.01 segundos.
    for(let i = 0; i < pasos; i++) {
        // obtención de theta
        dp_theta = -m*g*r*Math.sin(theta);
        p_theta  = p_theta + dp_theta*dt;
        dtheta   = p_theta/(m*Math.pow(r,2));
        theta    = theta + dtheta*dt;
        // obtención de r
        dp_r   = (Math.pow(p_theta,2)/(m*Math.pow(r,3))) + m*g*Math.cos(theta) - M*g;
        p_r    = p_r + dp_r*dt;
        dr     = p_r/(m+M);
        r      = r + dr*dt; 
    }



    return {'r_i':r,'t_i':theta}
}

// función que toma los parámetros de los inputs y los añade a las variables
const getParams = () => {
    M = parseFloat(document.getElementById("mu").value); 
    r = parseFloat(document.getElementById("r").value); 
    theta = parseFloat(document.getElementById("theta").value); 
    r0 = parseFloat(document.getElementById("r").value); 
    theta0 = parseFloat(document.getElementById("theta").value); 
    dr = parseFloat(document.getElementById("dr").value); 
    dtheta = parseFloat(document.getElementById("dtheta").value); 
    dr0 = parseFloat(document.getElementById("dr").value); 
    dtheta0 = parseFloat(document.getElementById("dtheta").value); 
    
}

parar = false;
function start(button,s=60) {
    getParams()
    let acum = [];
    // Queremos que pasen s segundos. Está configurado para que tras iteracion
    // pase 0.01 segundos. Necesitamos llamar a iteración s/0.01 veces
    const iteraciones = s/(dt*pasos);           
    
    for(let j = 0; j<iteraciones; j++) {
        acum.push(iteracion());   
    }

    var i = 0;
    function bucle() {         
        setTimeout(function() { 
            let {r_i,t_i} = acum[i];   
            i++;                    
            if (i < iteraciones && !parar) {           
                document.getElementById("r_value").innerHTML = r_i;
                document.getElementById("theta_value").innerHTML = t_i; 
                bucle();
            } else {
                parar = false;
            }           
        }, 10)
    }

    bucle();

    return acum;
}

function restart() {
    r = r0.valueOf();
    theta = theta0.valueOf();
    dr = dr0.valueOf();
    dtheta = dtheta0.valueOf();
    start();
}

document.getElementById("simulate").onclick = start;
document.getElementById("restart").onclick = restart;
document.getElementById("stop").onclick = function() { parar = true };
