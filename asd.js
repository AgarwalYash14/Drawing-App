const canvas = new fabric.Canvas("canvas", {
    selection: false,
});
canvas.setHeight(650);
canvas.setWidth(1500);
canvas.isDrawingMode = true;
canvas.freeDrawingBrush.color = "#000000";
canvas.freeDrawingBrush.width = 5;
let isMoving = false;
let zoomLevel = 1;

canvas.on("mouse:wheel", function (opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 100) zoom = 100;
    if (zoom < 0.01) zoom = 0.01;
    canvas.setZoom(zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
});

// Event listeners for input changes
document.getElementById("color").addEventListener("input", updateColor);
document
    .getElementById("stroke-width")
    .addEventListener("input", updateStrokeWidth);
document
    .getElementById("brush-type")
    .addEventListener("change", updateBrushType);
document
    .getElementById("drawing-property")
    .addEventListener("change", updateDrawingProperty);
document.getElementById("text-input").addEventListener("keyup", drawText);
document.getElementById("clear-button").addEventListener("click", clearCanvas);
document
    .getElementById("download-btn")
    .addEventListener("click", downloadCanvas);
document.getElementById("draw-rect").addEventListener("click", drawRectangle);
document.getElementById("draw-circle").addEventListener("click", drawCircle);
document.getElementById("move-tool").addEventListener("click", toggleMoveTool);
document.getElementById("undo-btn").addEventListener("click", undo);
document.getElementById("redo-btn").addEventListener("click", redo);
document.getElementById("zoom-in-btn").addEventListener("click", zoomIn);
document.getElementById("zoom-out-btn").addEventListener("click", zoomOut);
document
    .querySelector("#selection-tool")
    .addEventListener("click", () => toggleMoveTool);

// Drawing functions
function drawText(event) {
    if (event.key === "Enter") {
        const text = new fabric.Textbox(event.target.value, {
            left: 50,
            top: 50,
            fill: canvas.freeDrawingBrush.color,
            editable: true,
        });
        canvas.add(text);
        event.target.value = "";
    }
}

function drawRectangle() {
    canvas.isDrawingMode = false;
    const rect = new fabric.Rect({
        left: 50,
        top: 50,
        width: 100,
        height: 100,
        fill: canvas.freeDrawingBrush.color,
        stroke: canvas.freeDrawingBrush.color,
        strokeWidth: canvas.freeDrawingBrush.width,
    });
    canvas.add(rect);
    canvas.isDrawingMode = true;
}

function drawCircle() {
    canvas.isDrawingMode = false;
    const listener = (options) => {
        const circle = new fabric.Circle({
            left: options.pointer.x,
            top: options.pointer.y,
            radius: 50,
            fill: canvas.freeDrawingBrush.color,
            stroke: canvas.freeDrawingBrush.color,
            strokeWidth: canvas.freeDrawingBrush.width,
        });
        canvas.add(circle);
        canvas.isDrawingMode = true;
        canvas.off('mouse:up', listener); // Remove the listener after it's executed
    };

    canvas.on("mouse:up", listener);
}


// Update functions
function updateColor(event) {
    canvas.freeDrawingBrush.color = event.target.value;
}

function updateStrokeWidth(event) {
    canvas.freeDrawingBrush.width = parseInt(event.target.value, 10);
}

function updateBrushType(event) {
    const selectedBrushType = event.target.value;
    switch (selectedBrushType) {
        case "PencilBrush":
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas, {
                width: 1, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        case "CrayonBrush":
            canvas.freeDrawingBrush = new fabric.CrayonBrush(canvas, {
                width: 1, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        case "FurBrush":
            canvas.freeDrawingBrush = new fabric.FurBrush(canvas, {
                width: 1, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        case "InkBrush":
            canvas.freeDrawingBrush = new fabric.InkBrush(canvas, {
                width: 1, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        case "LongfurBrush":
            canvas.freeDrawingBrush = new fabric.LongfurBrush(canvas, {
                width: 1, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        case "MarkerBrush":
            canvas.freeDrawingBrush = new fabric.MarkerBrush(canvas, {
                width: 1, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        case "RibbonBrush":
            canvas.freeDrawingBrush = new fabric.RibbonBrush(canvas, {
                width: 1, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        case "ShadedBrush":
            canvas.freeDrawingBrush = new fabric.ShadedBrush(canvas, {
                width: 1, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        case "SketchyBrush":
            canvas.freeDrawingBrush = new fabric.SketchyBrush(canvas, {
                width: 1, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        case "SpraypaintBrush":
            canvas.freeDrawingBrush = new fabric.SpraypaintBrush(canvas, {
                width: 1, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        case "SquaresBrush":
            canvas.freeDrawingBrush = new fabric.SquaresBrush(canvas, {
                width: 1, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        case "WebBrush":
            canvas.freeDrawingBrush = new fabric.WebBrush(canvas, {
                width: 1, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        // Add more cases here for additional stroke types
        default:
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas); // Default to PencilBrush
            break;
    }
}

function updateDrawingProperty(event) {
    canvas.isDrawingMode = event.target.value === "stroke";
}

function clearCanvas() {
    canvas.clear();
}

function downloadCanvas() {
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL({
        format: "png",
        quality: 1,
    });
    link.click();
}

function toggleMoveTool() {
    isMoving = !isMoving;
    canvas.selection = isMoving;
    canvas.forEachObject((obj) => {
        obj.set({
            selectable: isMoving,
        });
    });

    if (isMoving) {
        document.getElementById("move-tool").textContent = "Drawing Mode";
        canvas.isDrawingMode = false;

        console.log(" ... ");
    } else {
        document.getElementById("move-tool").textContent = "Selection Mode";
        canvas.isDrawingMode = true;
    }
}

// Undo and Redo functions
document.getElementById("undo-btn").addEventListener("click", function () {
    canvas.undo();
});

document.getElementById("redo-btn").addEventListener("click", function () {
    canvas.redo();
});

// Zoom functions
function zoomIn() {
    zoomLevel *= 1.1;
    canvas.setZoom(zoomLevel);
    canvas.renderAll();
}

function zoomOut() {
    zoomLevel /= 1.1;
    canvas.setZoom(zoomLevel);
    canvas.renderAll();
}
