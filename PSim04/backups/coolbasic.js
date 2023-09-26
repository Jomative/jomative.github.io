/**@type {HTMLCanvasElement} */
const can = document.getElementById("can");
const ctx = can.getContext("2d");
let screenScale = 3;
can.width *= screenScale;
can.height *= screenScale;

let cx = can.width / 2;
let cy = can.height / 2;
const pWidth = 5;
const pHeight = 5;
const velocityScale = 2;

const particles = [];

class Particle{
    x;
    y;
    vx;
    vy;

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
        this.x += this.vx;
        this.y += this.vy;

        this.draw();
    }
}

function update(){
    requestAnimationFrame(update);
    // ctx.globalAlpha = 0.1;
    // ctx.fillStyle = "gray";
    // ctx.fillRect(0, 0, can.width, can.height);
    // ctx.globalAlpha = 1;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, can.width, can.height);
    for(let i = 0; i < particles.length; i++){
        let p = particles[i];
        //force code
        let dx = cx - p.x;
        let dy = cy - p.y;
        let dist = Math.sqrt(dx**2 + dy**2);
        if(dist < 1000){
            p.vx += dx / dist;
            p.vy += dy / dist;
        }
        p.update();
    }
}

function genParticles(count){
    for(let i = 0; i < count; i++){
        let x = Math.random() * can.width;
        let y = Math.random() * can.height;
        let vx = (Math.random()-0.5)*velocityScale;
        let vy = (Math.random()-0.5)*velocityScale;
        particles.push(new Particle(x,y,vx,vy));
    }
}
genParticles(100);

update();

//TODO: Implement Delta Scale for snippets