/**@type {HTMLCanvasElement} */
const can = document.getElementById("can");
const ctx = can.getContext("2d");
let screenScale = 3;
can.width *= screenScale;
can.height *= screenScale;

let cx = can.width / 2;
let cy = can.height / 2;
const pWidth = 3;
const pHeight = 3;
const velocityScale = 2;
let pullFactor = 0.5;
let centripetalFactor = 0.09; 
let randomNumber = 10;
let drag = 0.95;
// the spin force pushes particles outward naturally, so make it small so it doesn't ...

const particles = [];
let keys = [];

class Particle{
    x;
    y;
    vx;
    vy;
    lx;
    ly;

    constructor(x, y, vx, vy){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }

    draw(){
        ctx.fillStyle = "red";
        ctx.fillRect(Math.floor(this.x), Math.floor(this.y), pWidth, pHeight);

    }
    update(){
        this.lx = this.x;
        this.ly = this.y;
        this.vx *= drag;
        this.vy *= drag;
        this.x += this.vx;
        this.y += this.vy;

        //control for rand vel
        if(keys.s){
            this.vx += Math.random()-0.5;
            this.vy += Math.random()-0.5;
        }
        if(keys.a){
            this.vy += Math.random();
            this.vx += Math.random();
        }
        if(keys.w){
            this.vx += (Math.random()-0.5)*randomNumber;
            this.vy += (Math.random()-0.5)*randomNumber;
            
        }

        this.draw();
    }
}

function update(){
    requestAnimationFrame(update);
    // ctx.globalAlpha = 0.1;
    // ctx.fillStyle = "gray";
    // ctx.fillRect(0, 0, can.width, can.height);
    // ctx.globalAlpha = 1;

    //drag  button
    if(keys.d) {
        drag = 0.96;
    } else {
        drag = 1;
    }

    //add more particles
    if(keys.g){
        genParticles(10);
    }


    //main
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, can.width, can.height);
    for(let i = 0; i < particles.length; i++){
        let p = particles[i];
        
        //force code
        //pull to Center
        let dx = cx - p.x;
        let dy = cy - p.y;
        let dist = Math.sqrt(dx**2 + dy**2);
        if(dist < 1000){
            p.vx += dx / dist * pullFactor;
            p.vy += dy / dist * pullFactor;
        }

        //rotational force
        let angle = Math.atan2(dy, dx);
        angle += Math.PI / 2; //this makes it rotate because its going to constantly accelerate to a new angle(current Angle + Math.PI /2 which is 90deg)
        p.vx += Math.cos(angle) * centripetalFactor;
        p.vy += Math.sin(angle) * centripetalFactor;

        //tails
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.lx, p.ly);
        ctx.stroke();
        p.update();
    }
}

function genParticles(count){
    for(let i = 0; i < count; i++){
        let x = Math.random() * can.width;
        let y = Math.random() * can.height;
        let vx = (Math.random()-0.5);
        let vy = (Math.random()-0.5);
        particles.push(new Particle(x,y,vx,vy));
    }
}

genParticles(1000);

update();

//TODO: Implement Delta Scale for snippets

document.addEventListener("keydown", e=>{
    let key = e.key.toLowerCase();
    keys[key] = true;
})
document.addEventListener("keyup", e=>{
    let key = e.key.toLowerCase();
    keys[key] = false;
})


setInterval(e=>{
    genParticles(30);
}, 10000);

//Add sound effects?