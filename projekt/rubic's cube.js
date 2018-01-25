document.addEventListener("DOMContentLoaded", start);

let coords;
let cube;
let dragging = false;

function start() {
    let site = document.querySelectorAll('.strona')
    site.forEach(
        function (element) {
            element.addEventListener('mousedown', onMouseDown);
        }
    )
    cube = document.getElementById("cube");
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
}

function onMouseDown(e) {
    
    console.log('down', coords)
    dragging = true;
}
function onMouseUp(e) {
    dragging = false;
}
function onMouseMove(e) {
    if (dragging == true) {
        coords = {
            'x': e.clientX * 1.2,
            'y': e.clientY * 1.2
        }
        cube.style.transform = 'rotateY(' + coords.x + 'deg)' + 'rotateX(' + -coords.y + 'deg)';
        console.log(cube.style.transform)
    }
}