const colorPicker = document.getElementById("color");
const shapesSVGs = document.querySelectorAll(".shapes-svg");
// Event listeners for input changes
document
    .getElementById("selection-tool")
    .addEventListener("click", function () {
        canvas.selection = !canvas.selection; // Toggle selection mode
        console.log(
            "Selection mode:",
            canvas.selection ? "Enabled" : "Disabled"
        );
    });
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
document.getElementById("zoom-in-btn").addEventListener("click", zoomIn);
document.getElementById("zoom-out-btn").addEventListener("click", zoomOut);
document
    .querySelector("#selection-tool")
    .addEventListener("click", () => toggleMoveTool);

//creating new canvas
const canvas = new fabric.Canvas("canvas", {
    selectionBorderColor: "blue",
    selectionColor: "transparent",
    selectionLineWidth: 1,
    selection: true,
    controlsAboveOverlay: true,
    centeredScaling: true,
});

const state = [];
let index = -1;

//setting height and width
canvas.setHeight(729);
canvas.setWidth(1536);

// canvas.width = document.body.clientWidth;
// canvas.height = document.body.clientHeight;

//basic states
canvas.isDrawingMode = true;
canvas.freeDrawingBrush.color = "#000000";
canvas.freeDrawingBrush.width = 1;
let isMoving = false;
let zoomLevel = 1;

// Function to handle mouse wheel event for zooming
canvas.on("mouse:wheel", (opt) => {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
    var vpt = canvas.viewportTransform;
    console.log("opt : ", canvas.viewportTransform);
    if (zoom < 400 / 1000) {
        vpt[4] = 200 - (1000 * zoom) / 2;
        vpt[5] = 200 - (1000 * zoom) / 2;
    } else {
        if (vpt[4] >= 0) {
            vpt[4] = 0;
        } else if (vpt[4] < canvas.getWidth() - 1000 * zoom) {
            vpt[4] = canvas.getWidth() - 1000 * zoom;
        }
        if (vpt[5] >= 0) {
            vpt[5] = 0;
        } else if (vpt[5] < canvas.getHeight() - 1000 * zoom) {
            vpt[5] = canvas.getHeight() - 1000 * zoom;
        }
    }
});

// Update functions
function updateColor(event) {
    canvas.freeDrawingBrush.color = event.target.value;
}

function handleColorChange() {
    // console.log("Color changed");
    const color = colorPicker.value;
    // console.log("Selected color:", color);
    shapesSVGs.forEach((svg) => {
        // console.log("Shape:", svg);
        const shape =
            svg.querySelector("path") ||
            svg.querySelector("circle") ||
            svg.querySelector("rect");
        if (shape) {
            shape.setAttribute("fill", color);
            // console.log("Fill color set:", color);
        }
    });
}

colorPicker.addEventListener("change", handleColorChange);

handleColorChange();

function updateStrokeWidth(event) {
    canvas.freeDrawingBrush.width = parseInt(event.target.value, 10);
}

function updateDrawingProperty(event) {
    canvas.isDrawingMode = event.target.value === "stroke";
}

function erase() {
    canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
    canvas.freeDrawingBrush.width = 10;
    canvas.isDrawingMode = true;
}

// toolbar

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

function updateBrushType(event) {
    canvas.isDrawingMode = true;

    const selectedBrushType = event.target.value;
    switch (selectedBrushType) {
        case "PencilBrush":
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas, {
                width: canvas.freeDrawingBrush.width, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        case "CrayonBrush":
            canvas.freeDrawingBrush = new fabric.CrayonBrush(canvas, {
                width: canvas.freeDrawingBrush.width, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        case "FurBrush":
            canvas.freeDrawingBrush = new fabric.FurBrush(canvas, {
                width: canvas.freeDrawingBrush.width, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        case "InkBrush":
            canvas.freeDrawingBrush = new fabric.InkBrush(canvas, {
                width: canvas.freeDrawingBrush.width, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        case "LongfurBrush":
            canvas.freeDrawingBrush = new fabric.LongfurBrush(canvas, {
                width: canvas.freeDrawingBrush.width, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        case "MarkerBrush":
            canvas.freeDrawingBrush = new fabric.MarkerBrush(canvas, {
                width: canvas.freeDrawingBrush.width, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        case "RibbonBrush":
            canvas.freeDrawingBrush = new fabric.RibbonBrush(canvas, {
                width: canvas.freeDrawingBrush.width, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        case "ShadedBrush":
            canvas.freeDrawingBrush = new fabric.ShadedBrush(canvas, {
                width: canvas.freeDrawingBrush.width, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        case "SketchyBrush":
            canvas.freeDrawingBrush = new fabric.SketchyBrush(canvas, {
                width: canvas.freeDrawingBrush.width, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        case "SpraypaintBrush":
            canvas.freeDrawingBrush = new fabric.SpraypaintBrush(canvas, {
                width: canvas.freeDrawingBrush.width, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        case "SquaresBrush":
            canvas.freeDrawingBrush = new fabric.SquaresBrush(canvas, {
                width: canvas.freeDrawingBrush.width, // Width of brush
                color: canvas.freeDrawingBrush.color, // Color of brush
                opacity: 1, // Opacity of brush
            });
            break;
        case "WebBrush":
            canvas.freeDrawingBrush = new fabric.WebBrush(canvas, {
                width: canvas.freeDrawingBrush.width, // Width of brush
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

function drawRectangle() {
    canvas.isDrawingMode = false;
    let startX, startY, rectangle; // Variables to store initial mouse position and rectangle object

    // Event listener for mouse down
    canvas.on("mouse:down", function (options) {
        const pointer = canvas.getPointer(options.e);
        startX = pointer.x;
        startY = pointer.y;

        // Check if there's an existing rectangle
        const existingRectangle = canvas.getActiveObject();
        if (existingRectangle && existingRectangle.type === "rect") {
            rectangle = existingRectangle;
        } else {
            // Create a new rectangle
            rectangle = new fabric.Rect({
                left: startX,
                top: startY,
                width: 1,
                height: 1,
                fill: canvas.freeDrawingBrush.color,
                // stroke: canvas.freeDrawingBrush.color,
                // strokeWidth: canvas.freeDrawingBrush.width,
            });

            // Add rectangle to canvas
            canvas.add(rectangle);
        }
    });

    // Event listener for mouse move
    canvas.on("mouse:move", function (options) {
        if (!rectangle) return;

        const pointer = canvas.getPointer(options.e);
        const width = pointer.x - startX;
        const height = pointer.y - startY;

        // Update rectangle dimensions
        rectangle.set({ width: width, height: height });
        canvas.renderAll(); // Render canvas
    });

    // Event listener for mouse up
    canvas.on("mouse:up", function () {
        startX = null;
        startY = null;
        rectangle = null;
        canvas.isDrawingMode = true;
    });
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
        canvas.off("mouse:up", listener);
    };

    canvas.on("mouse:up", listener);
}

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

function getZoomPoint(event) {
    const canvasRect = canvas.getElement().getBoundingClientRect();
    return {
        x: event.clientX - canvasRect.left,
        y: event.clientY - canvasRect.top,
    };
}

// Zoom in function
function zoomIn(event) {
    const zoomPoint = getZoomPoint(event);
    const scaleFactor = 1.1;
    zoom(scaleFactor, zoomPoint);
}

// Zoom out function
function zoomOut(event) {
    const zoomPoint = getZoomPoint(event);
    const scaleFactor = 1 / 1.1;
    zoom(scaleFactor, zoomPoint);
}

// General zoom function
function zoom(scaleFactor, zoomPoint) {
    const oldZoom = zoomLevel;
    zoomLevel *= scaleFactor;
    if (zoomLevel < 0.1) zoomLevel = 0.1;
    if (zoomLevel > 10) zoomLevel = 10;

    const mouseBeforeZoom = {
        x: zoomPoint.x / oldZoom - canvas.viewportTransform[4] / oldZoom,
        y: zoomPoint.y / oldZoom - canvas.viewportTransform[5] / oldZoom,
    };

    const mouseAfterZoom = {
        x: zoomPoint.x / zoomLevel - canvas.viewportTransform[4] / zoomLevel,
        y: zoomPoint.y / zoomLevel - canvas.viewportTransform[5] / zoomLevel,
    };

    const deltaX = mouseBeforeZoom.x - mouseAfterZoom.x;
    const deltaY = mouseBeforeZoom.y - mouseAfterZoom.y;

    const zoomPointRelativeToCanvas = {
        x: zoomPoint.x - canvas.viewportTransform[4],
        y: zoomPoint.y - canvas.viewportTransform[5],
    };

    const newVpt = [
        canvas.viewportTransform[0] * scaleFactor,
        canvas.viewportTransform[1],
        canvas.viewportTransform[2],
        canvas.viewportTransform[3] * scaleFactor,
        canvas.viewportTransform[4] + deltaX,
        canvas.viewportTransform[5] + deltaY,
    ];

    canvas.setViewportTransform(newVpt);
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

function clearCanvas() {
    canvas.clear();
}

// Undo and Redo functions
const saveState = () => {
    index++;
    state[index] = JSON.stringify(canvas);
    if (index < state.length - 1) {
        state.splice(index + 1, state.length - index - 1);
    }
};

const undo = () => {
    if (index > 0) {
        index--;
        canvas.clear();
        canvas.loadFromJSON(state[index], () => {
            canvas.renderAll();
        });
    }
};

const redo = () => {
    if (index < state.length - 1) {
        index++;
        canvas.clear();
        canvas.loadFromJSON(state[index], () => {
            canvas.renderAll();
        });
    }
};

document.getElementById("undoBtn").addEventListener("click", undo);
document.getElementById("redoBtn").addEventListener("click", redo);
