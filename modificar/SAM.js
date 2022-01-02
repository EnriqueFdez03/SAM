class SAM{
    // Para predecir de manera numérica este problema hemos empleado
    // la mecánica hamiltoniana, ya que presenta ecuaciones diferenciales de
    // primer orden frente a Euler-Lagrange, que son de segundo orden.

    // --- VARIABLES INICIALES ---
    constructor(){
        this.M; // M: Masa del contrapeso. 
        this.m; // m: Masa de la bola oscilante.
        this.g = 9.8; // Gravedad
        this.r0; // Distancia de la bola oscilante de la polea.
        this.theta0; // Angulo de la bola oscilante con la vertical

        this.r; // Distancia de la bola oscilante de la polea. Son iguales que r0 y theta0, solo que hay dos por si se desea hacer reset... .
        this.theta; // Angulo de la bola oscilante con la vertical

        // --- VARIABLES QUE INTERVIENEN EN LA RESOLUCIÓN ---
        this.p_theta = 0; // Momento conjugado asociado a theta. El momento angular!
        this.dp_theta = 0; // Derivada de la anterior con respecto al tiempo. Eq. a: -dH/dp_thetha (eq. canónicas de Hamilton)

        this.p_r = 0;// Momento conjugado asociado a r.
        this.dp_r = 0; // Derivada de la anterior

        this.dtheta0; //dThetha/dt -> Velocidad angular!
        this.dr0; //dr/dt -> Velocidad hacia arriba o abajo!
        this.dtheta; //dThetha/dt -> Velocidad angular!
        this.dr; //dr/dt -> Velocidad hacia arriba o abajo!
        

        this.parar = false;

        // Instante de tiempo. A más pequeño, más precisión tendrá la predicción,
        // pero más lento (obvio). Si se dejan los valores por defecto, retorna r y theta
        // tras 10ms
        this.dt = 0.001;
        this.pasos = 10;
    }

    iteracion() {
        // dt es 0.001 y por defecto 10 pasos. 10*0.001 = 0.01.
        // Luego tras el for se habrá producido el movimiento  de 0.01 segundos.
        for(let i = 0; i < this.pasos; i++) {
            // obtención de theta
            this.dp_theta = -this.m*this.g*this.r*Math.sin(this.theta);
            this.p_theta  = this.p_theta + this.dp_theta*this.dt;
            this.dtheta   = this.p_theta/(this.m*Math.pow(this.r,2));
            this.theta    = this.theta + this.dtheta*this.dt;
            // obtención de r
            this.dp_r   = Math.pow(this.p_theta,2)/(this.m*Math.pow(this.r,3)) + this.m*this.g*Math.cos(this.theta) - this.M*this.g;
            this.p_r    = this.p_r + this.dp_r*this.dt;
            this.dr     = this.p_r/(this.m+this.M);
            this.r      = this.r + this.dr*this.dt; 
        }



        return {'r_i':this.r,'t_i':this.theta}
    }

    // función que toma los parámetros de los inputs y los añade a las variables
    getParams(){
        this.M = parseFloat(document.getElementById("M").value); 
        this.m = parseFloat(document.getElementById("m").value); 
        this.r = parseFloat(document.getElementById("r").value); 
        this.theta = parseFloat(document.getElementById("theta").value); 
        this.r0 = parseFloat(document.getElementById("r").value); 
        this.theta0 = parseFloat(document.getElementById("theta").value); 
        this.dr = parseFloat(document.getElementById("dr").value); 
        this.dtheta = parseFloat(document.getElementById("dtheta").value); 
        this.dr0 = parseFloat(document.getElementById("dr").value); 
        this.dtheta0 = parseFloat(document.getElementById("dtheta").value); 

        this.p_r = this.dr*(this.m+this.M);
        this.p_theta = this.m*this.dtheta*Math.pow(this.r,2);
    }

    start(button,s=60) {
        this.getParams()
        let acum = [];
        // Queremos que pasen s segundos. Está configurado para que tras iteracion
        // pase 0.01 segundos. Necesitamos llamar a iteración s/0.01 veces
        const iteraciones = s/(this.dt*this.pasos);           
        
        for(let j = 0; j<iteraciones; j++) {
            acum.push(this.iteracion());   
        }
        return acum;
    }

    restart() {
        this.r = this.r0.valueOf();
        this.theta = this.theta0.valueOf();
        this.dr = this.dr0.valueOf();
        this.dtheta = this.dtheta0.valueOf();
        this.start();
    }
}

