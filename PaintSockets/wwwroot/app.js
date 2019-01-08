var canvasDiv = document.getElementById('canvasDiv');
canvas = document.createElement('canvas');
canvas.setAttribute('width', 490);
canvas.setAttribute('height', 220);
canvas.setAttribute('id', 'canvas');
canvasDiv.appendChild(canvas);
if (typeof G_vmlCanvasManager != 'undefined') {
    canvas = G_vmlCanvasManager.initElement(canvas);
}
context = canvas.getContext("2d");

$('#canvas').mousedown(function (e) {
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;

    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    //redraw();
});

$('#canvas').mousemove(function (e) {
    if (paint) {
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        //redraw();
    }
});

$('#canvas').mouseup(function (e) {
    paint = false;
});

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;



function addClick(x, y, dragging) {

    connection.invoke("SendPoint", JSON.stringify({ clickX: x, clickY: y, dragging: dragging ? true : false})).catch(function (err) {
        return console.error(err.toString());
    });
    //clickX.push(x);
    //clickY.push(y);
    //clickDrag.push(dragging);
}

function redraw() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); 

    context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 5;

    for (var i = 0; i < clickX.length; i++) {
        context.beginPath();
        if (clickDrag[i] && i) {
            context.moveTo(clickX[i - 1], clickY[i - 1]);
        } else {
            context.moveTo(clickX[i] - 1, clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.stroke();
    }
}


var connection = new signalR.HubConnectionBuilder().withUrl("/paint").build();

connection.on("ReceivePoints", x => {
    console.log(x);
    let p = JSON.parse(x);
    clickX.push(p.clickX);
    clickY.push(p.clickY);
    clickDrag.push(p.dragging);
    redraw();
});

connection.on("Clear", () => {
    clickX = new Array();
    clickY = new Array();
    clickDrag = new Array();
    redraw();
});

connection.start().catch(function (err) {
    return console.error(err.toString());
});

