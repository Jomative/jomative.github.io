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
let velocityFactor = 0.05;
let centripetalFactor = 0.003; 
// the spin force pushes particles outward naturally, so make it small so it doesn't ...

let pDistEffect = 20;

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
        // let p2 = particles[i+1];
        // if(p2){//error handling
        //     ctx.beginPath();
        //     ctx.moveTo(p.x, p.y);
        //     ctx.lineTo(p2.x, p2.y);
        //     ctx.stroke();
        // } 

        //constelllation attempt 1
        // for(let j = 0; j < particles.length; j++){
        //     let p2 = particles[j];
        //     if(p == p2) continue;
        //     if(getDist(p.x, p.y, p2.x, p2.y) < pDistEffect){
        //         ctx.beginPath();
        //         ctx.moveTo(p.x, p.y);
        //         ctx.lineTo(p2.x, p2.y);
        //         ctx.stroke();
                
        //     }
        // }


        //what if rings of effect
        for(let j = 0; j < particles.length; j++){
            let p2 = particles[j];
            if(p == p2) continue;
            if(getDist(p.x,p.y,cx,cy) < 200
            && getDist(p.x,p.y,cx,cy) > 120
            && getDist(p2.x,p2.y,cx,cy) < 200
            && getDist(p2.x,p2.y,cx,cy) > 120
            && getDist(p.x,p.y,p2.x,p2.y) < 20
            ){
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
                
            }
        }

        
        //force code
        //pull to Center
        let dx = cx - p.x;
        let dy = cy - p.y;
        let dist = Math.sqrt(dx**2 + dy**2);
        if(dist < 5000){
            p.vx += dx / dist * velocityFactor;
            p.vy += dy / dist * velocityFactor;
        }

        //rotational force
        let angle = Math.atan2(dy, dx);
        angle += Math.PI / 2; //this makes it rotate because its going to constantly accelerate to a new angle(current Angle + Math.PI /2 which is 90deg)
        p.vx += Math.cos(angle) * centripetalFactor;
        p.vy += Math.sin(angle) * centripetalFactor;
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

function getDist(x1, y1, x2, y2){
    let dx = x2 - x1;
    let dy = y2 - y1;
    let dist = Math.sqrt(dx**2 + dy**2);
    return dist;
}

//TODO: Implement Delta Scale for snippets