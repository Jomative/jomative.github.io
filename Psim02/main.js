/**@type {HTMLCanvasElement} */
const can = document.getElementById("can");
can.width = 600;
can.height = 300;
const ctx = can.getContext("2d");
let nob = new NobsinEngine(can.width, can.height);

const black = [0,0,0,255];

/**@type {Obj[]} */
let objs = [];
class Obj{
    x;y;vx;vy;
    constructor(x, y, vx, vy){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        
    }

}

for(let i = 0; i < 5000; i++){
    objs.push(new Obj(Math.random()*can.width, Math.random()*can.height, Math.random()-0.5, Math.random()-0.5));
}

let keys = {};
let mx = 0;
let my = 0;

function update(){
    requestAnimationFrame(update);
    nob.buf.fill(0);

    let base_colors = [
        [0,0,0,255],
        [255,0,0,255],
        [0,255,0,255],
        [0,0,255,255]
    ];
    let colors = [
        [100, 100, 50, 255],
        [150, 100, 50, 255],
        [100, 150, 50, 255],
        [150, 150, 100, 255]
    ];
    let maxSpeed = 4;
    let drag = 0;
    let drag2 = 1;
    for(let i = 0; i < objs.length; i++){
        let o = objs[i];

        let dx = 0;
        let dy = 0;
        let dist = 0;

        if(keys.a){
            drag2 = 0.97;
        }
        if(keys.s){
            maxSpeed = 6;
        }
        if(keys.d){
            maxSpeed = 30;
        }
        dx = mx - o.x;
        dy = my - o.y;
        dist = Math.sqrt(dx**2 + dy**2);
        if(dist < (!keys.s) ? 80 : 1000){
            o.vx += dx / dist / 2;
            o.vy += dy / dist / 2;
        }
        if(Math.random() < 0.1){
            o.vx += (Math.random() - 0.5) / 8;
            o.vy += (Math.random() - 0.5) / 8;
        }

        let ang = Math.atan2(dy, dx) - Math.PI/2;
        let tx = Math.cos(ang) / dist * 2;
        let ty = Math.sin(ang) / dist * 2;
        o.vx += tx;
        o.vy += ty;

        //

        if(o.vx > maxSpeed) o.vx = maxSpeed;
        else if(o.vx < -maxSpeed) o.vx = -maxSpeed;
        if(o.vy > maxSpeed) o.vy = maxSpeed;
        else if(o.vy < -maxSpeed) o.vy = -maxSpeed;

        if(o.vx >= drag) o.vx -= drag;
        else if(o.vx <= -drag) o.vx += drag;
        else o.vx = 0;
        if(o.vy >= drag) o.vy -= drag;
        else if(o.vy <= -drag) o.vy += drag;
        else o.vy = 0;

        o.vx *= drag2;
        o.vy *= drag2;

        o.x += o.vx;
        o.y += o.vy;

        //Screen edge collison
        if(o.x < 0){
            o.vx = Math.abs(o.vx);
            o.x = 0;
        }
        else if(o.x >= can.width){
            o.vx = -Math.abs(o.vx);
            o.x = 0;
        }
        if(o.y < 0){
            o.vy = Math.abs(o.vy);
            o.y = 0;
        }
        else if(o.y >= can.width){
            o.vy = -Math.abs(o.vy);
            o.y = 0;
        }

        nob.setPixel(o.x, o.y, black);
    }
    ctx.putImageData(new ImageData(nob.buf, nob.width, nob.height), 0, 0);
    
}
update();

document.addEventListener("mousemove", e=>{
    mx = (e.clientX / can.clientWidth) * can.width;
    my = (e.clientY / can.clientHeight) * can.height;
});

document.addEventListener("keydown", e=>{
    keys[e.key.toLowerCase()] = true;
})
document.addEventListener("keyup", e=>{
    keys[e.key.toLowerCase()] = false;
})
