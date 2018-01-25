let snowflakes = [];
let flake_prop = [];
let positions = [];
let maxSize = 200;
let dist = 200;
let appearCount;
let svg;
let svgns = "http://www.w3.org/2000/svg";
let bg; //background
let i = -1;
let flake;
let ellipse;
let ellipse2;
let ellipse3;
let resiz = false;
let mouse = false;
let tmp;
let tmp2;
let tmp3;
let tmp4;
let flake_r;
let mousePos;

class Snowball {
    constructor() {
    }

    createNewSnowBall() {
        setTimeout(function () {
            appearCount = Math.floor((Math.random() * 100) + 1);
            let width = window.innerWidth * 0.5;
            //   console.log(width, window.innerWidth)
            let cx = Math.floor((Math.random() * width) - 20)
            let shape = document.createElementNS(svgns, "circle");
            shape.setAttributeNS(null, "cx", cx);
            shape.setAttributeNS(null, "cy", 5);
            shape.setAttributeNS(null, "r", 3);
            shape.setAttributeNS(null, "fill", "white");
            shape.setAttributeNS(null, "class", "snowBalls");
            svg.appendChild(shape);
            i++;
            snowflakes[i] = {
                'shape': shape,
                'x': 0,
                'y': 0,
            }
            //  console.log(shape)
            SnowBallAnim(snowflakes[i], cx);
            if (i < maxSize - 1) {
                this.createNewSnowBall();
            }
        }.bind(this), appearCount)
    }
}

document.addEventListener("DOMContentLoaded", start); // start programu
/////////////////////////////////////////////////////////////////////////
function start() {
    svg = document.getElementById("svg");
    flake = document.getElementById("flake"); //do obliczenia promienia śnieżki
    ellipse = document.getElementById("ellipse");
    ellipse2 = document.getElementById("ellipse2");
    ellipse3 = document.getElementById("ellipse3");
    bg = document.getElementById("background"); //background
    let snowball = new Snowball();
    snowball.createNewSnowBall();
    startDraw();
    document.addEventListener("mousedown", mouseDown);
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
    window.addEventListener('resize', resizing);
    window.oncontextmenu = function () { return false; }
    //  checkthisout();
}
////////////////////////////////////////////////////////////////////////////

function startDraw() {
    tmp = draw(ellipse, tmp);
    tmp2 = draw(flake, tmp2);
    tmp3 = draw(ellipse2, tmp3);
    tmp4 = draw(ellipse3, tmp4);
}

function SnowBallAnim(element, cx) {
    let animation = new TimelineMax({ paused: false });
    let tmp = Math.floor((Math.random() * 300) + 100);
    animation.to([element.shape], 4, { bezier: { values: [{ x: 0, y: 0 }, { x: cx + tmp, y: 251 }, { x: cx - tmp, y: 376.5 }, { x: cx + tmp, y: 502 }, { x: cx - tmp, y: 627.5 }], type: "cubic" }, ease: /*Power1.easeInOut*/ Linear.easeNone, onUpdate: checkPos, onUpdateParams: [element, animation] });
}

function checkPos(element, animation) {
    let boundingRect = element.shape.getBoundingClientRect();
    //console.log(boundingRect)
    let x = boundingRect.x;
    let y = boundingRect.y;
    snowflakes[i].x = x;
    snowflakes[i].y = y;
    // console.log(snowflakes[i].x, snowflakes[i].y)
    let bottom = Math.floor(boundingRect.bottom);
    let x1 = x - positions[0].x;
    let y1 = y - positions[0].y;
    let r1 = flake_r + positions[0].r;
    let x2 = x - positions[3].x;
    let y2 = y - positions[3].y;
    let r2 = flake_r + positions[3].r;
    let x3 = x - positions[2].x;
    let y3 = y - positions[2].y;
    let r3 = flake_r + positions[2].r;
    //  console.log(Math.sqrt((x1 * x1) + (y1 * y1)))
    // console.log(r1)
    if (r1 > Math.sqrt((x1 * x1) + (y1 * y1)) + 3 || r2 > Math.sqrt((x2 * x2) + (y2 * y2)) + 3 || r3 > Math.sqrt((x3 * x3) + (y3 * y3))) {
        animation.kill();
    }
    if (mousePos && mouse) {
        let currDist = Math.sqrt((mousePos.x - x) * (mousePos.x - x) + (mousePos.y - y) * (mousePos.y - y));
        if (currDist < dist) {
            animation.kill();
            /*   let styl = window.getComputedStyle(element.shape, null);
               let tr = styl.getPropertyValue("transform");
               let values = tr.split('(')[1].split(')')[0].split(', ');
               let transX = values[4];
               let transY = values[5];
               console.log(transX, transY)*/
            console.log(x, y);
            console.log(element.shape.getBoundingClientRect())
            element.shape.setAttributeNS(null, "cx", x);
            element.shape.setAttributeNS(null, "cy", y);
            element.shape.style.transform = "none";
            let anim = new TimelineMax({ paused: false });
            // console.log(mousePos.x, mousePos.y)
          
              anim.to([element.shape], 1, {
                  x: mousePos.x - x, y: mousePos.y - y, onComplete: () => { console.log(element.shape.getBoundingClientRect()) }
              })
            //console.log(x - transY, y - transY)
            //  console.log(mousePos.x - x, mousePos.y - y)
            // console.log(mousePos.x - x, mousePos.y - y)
        }
    }

}

function resizing() {
    resiz = true;
    tmp = draw(ellipse, tmp);
    resiz = true;
    tmp2 = draw(flake, tmp2);
    resiz = true;
    tmp3 = draw(ellipse2, tmp3);
    resiz = true;
    tmp4 = draw(ellipse3, tmp4);
}

function draw(element, r) {
    if (resiz) {
        r.outerHTML = "";
        delete r;
    }
    r = CalcR(element);
    resiz = false;
    return r;
}


function CalcR(element) {
    let r;
    let brect = element.getBoundingClientRect();
    let cx = brect.width / 2 + brect.x;
    let cy = brect.height / 2 + brect.y;
    let rect = document.createElement("div");
    rect.style.position = "absolute";
    rect.style.left = cx + 'px';
    rect.style.top = cy + 'px';
    rect.style.width = brect.width / 2 + 'px';
    rect.style.height = brect.height / 2 + 'px';
    // rect.style.border = '1px solid black';
    bg.appendChild(rect);//tu
    let pr = rect.getBoundingClientRect();
    if (resiz) {
        positions.shift();
    }
    let pos = {
        'name': element.id,
        'x': pr.x,
        'y': pr.y,
        'r': pr.height
    }
    //  console.log(element.id)
    if (element.id == "flake") {
        flake_r = pr.height;
        //    console.log("wtf")
    }
    positions.push(pos);
    //  console.log(positions)
    r = rect;

    return r;
}

function mouseDown(e) {
    mouse = true;
    mousePos = {
        'x': e.clientX,
        'y': e.clientY
    }
     console.log(mousePos.x, mousePos.y)
}
function mouseMove(e) {
    if (mouse) {
        mousePos = {
            'x': e.clientX,
            'y': e.clientY
        }
        console.log(mousePos.x, mousePos.y)
    }
}
function mouseUp() {
    mouse = false;
}

function pushIn() {
}
function pushOut() {

}
