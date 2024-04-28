const canvasElement = document.getElementById("canvas");
canvasElement.willReadFrequently = true;

const colorPicker = document.getElementById("color");
const shapesSVGs = document.querySelectorAll(".shapes-svg");

document.getElementById("color").addEventListener("input", updateColor);
document
    .getElementById("stroke-width")
    .addEventListener("input", updateStrokeWidth);

// Toolbar
document
    .querySelector("#selection-tool")
    .addEventListener("click", () => toggleMoveTool);
document.querySelector("#hand-tool").addEventListener("click", () => Panning);
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

document.getElementById("zoom-in-btn").addEventListener("click", zoomIn);
document.getElementById("zoom-out-btn").addEventListener("click", zoomOut);

const selectionColorValue = "rgba(117, 203, 233, 0.1)";

//creating new canvas
const canvas = new fabric.Canvas("canvas", {
    selectionBorderColor: "rgb(91, 155, 213)",
    selectionColor: selectionColorValue,
    selection: true,
    controlsAboveOverlay: true,
    // rulers: true,
    // centeredScaling: true,
});

const state = [];
let index = -1;

//setting height and width
canvas.setHeight(729);
canvas.setWidth(1536);

// canvas.width = document.body.clientWidth;
// canvas.height = document.body.clientHeight;

//basic states
canvas.isDrawingMode = false;
canvas.freeDrawingBrush.color = "#000000";
canvas.freeDrawingBrush.width = 1;
let isMoving = false;
let zoomLevel = 1;

let history = [];
let historyIndex = 0;

document
    .getElementById("draw-rect")
    .addEventListener("click", () => drawShape("rectangle"));
document
    .getElementById("draw-circle")
    .addEventListener("click", () => drawShape("circle"));
document
    .getElementById("draw-triangle")
    .addEventListener("click", () => drawShape("triangle"));
document
    .getElementById("draw-roundedRect")
    .addEventListener("click", () => drawShape("roundedRect"));
document
    .getElementById("draw-line")
    .addEventListener("click", () => drawShape("line"));

// Function to handle mouse wheel event for zooming
canvas.on("mouse:wheel", function (opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
});

// Update functions
function updateColor(event) {
    canvas.freeDrawingBrush.color = event.target.value;
}

function handleColorChange() {
    const color = colorPicker.value;
    const svgElement = document.getElementById("drawing-property");

    const polygons = svgElement.querySelectorAll("polygon");
    polygons.forEach((polygon) => {
        const currentFill = polygon.getAttribute("fill");
        if (currentFill !== "#fff") {
            polygon.setAttribute("fill", color);
        }
    });

    const paths = svgElement.querySelectorAll("path");
    paths.forEach((path) => {
        const currentFill = path.getAttribute("fill");
        if (currentFill !== "#fff") {
            path.setAttribute("fill", color);
        }
    });

    shapesSVGs.forEach((svg) => {
        const shape =
            svg.querySelector("polygon") ||
            svg.querySelector("path") ||
            svg.querySelector("circle") ||
            svg.querySelector("rect");
        if (shape) {
            const currentFill = shape.getAttribute("fill");
            if (currentFill !== "#fff") {
                shape.setAttribute("fill", color);
            }
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
    canvas.isDrawingMode = true;
}

// toolbar

// Get the toolbar div element
const selectionTool = document.getElementById("selection-tool");
const handTool = document.getElementById("hand-tool");
const redoBtn = document.getElementById("redo-btn");
const undoBtn = document.getElementById("undo-btn");

function toggleMoveTool() {
    canvas.isDrawingMode = false;
}

handTool.addEventListener("click", function () {
    // Deactivate all tools except handTool
    deactivateAllExcept(handTool);
    // Toggle the 'active' class on the handTool div
    handTool.classList.toggle("active");
});

function Panning() {
    canvas.on("mouse:down", function (opt) {
        var evt = opt.e;
        if (evt.altKey === true) {
            this.isDragging = true;
            this.selection = false;
            this.lastPosX = evt.clientX;
            this.lastPosY = evt.clientY;
        }
    });
    canvas.on("mouse:move", function (opt) {
        if (this.isDragging) {
            var e = opt.e;
            var vpt = this.viewportTransform;
            vpt[4] += e.clientX - this.lastPosX;
            vpt[5] += e.clientY - this.lastPosY;
            this.requestRenderAll();
            this.lastPosX = e.clientX;
            this.lastPosY = e.clientY;
        }
    });
    canvas.on("mouse:up", function (opt) {
        this.setViewportTransform(this.viewportTransform);
        this.isDragging = false;
        this.selection = true;
        this.isDrawingMode = false;
    });
}

function togglePencilMode() {
    canvas.isDrawingMode = true;
}

function updateBrushType(event) {
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

function drawShape(shapeType) {
    canvas.isDrawingMode = false;
    canvas.selection = true;
    canvas.selectionColor = "transparent";
    var shape, isDown, origX, origY;
    var points = [];

    // Disable selection for existing objects
    canvas.forEachObject(function (obj) {
        obj.set("selectable", false);
        obj.set("evented", false);
    });

    canvas.on("mouse:down", function (o) {
        var pointer = canvas.getPointer(o.e);
        isDown = true;
        origX = pointer.x;
        origY = pointer.y;

        const common = {
            fill: canvas.freeDrawingBrush.color,
            stroke: canvas.freeDrawingBrush.color,
            strokeWidth: canvas.freeDrawingBrush.width,
        };

        if (shapeType === "rectangle") {
            shape = new fabric.Rect({
                left: origX,
                top: origY,
                ...common,
            });
        } else if (shapeType === "circle") {
            shape = new fabric.Ellipse({
                left: origX,
                top: origY,
                rx: 0,
                ry: 0,
                ...common,
            });
        } else if (shapeType === "triangle") {
            shape = new fabric.Triangle({
                left: origX,
                top: origY,
                ...common,
            });
        } else if (shapeType === "roundedRect") {
            shape = new fabric.Rect({
                left: origX,
                top: origY,
                ...common,
                rx: 10,
                ry: 10,
            });
        } else if (shapeType === "line") {
            shape = new fabric.Line([origX, origY, origX, origY], {
                ...common,
            });
        }

        if (shapeType !== "line") {
            canvas.add(shape);
        }
    });

    canvas.on("mouse:move", function (o) {
        if (!isDown) return;
        var pointer = canvas.getPointer(o.e);

        if (shapeType === "rectangle") {
            if (origX > pointer.x) {
                shape.set({ left: Math.abs(pointer.x) });
            }
            if (origY > pointer.y) {
                shape.set({ top: Math.abs(pointer.y) });
            }
            shape.set({ width: Math.abs(origX - pointer.x) });
            shape.set({ height: Math.abs(origY - pointer.y) });
        } else if (shapeType === "circle") {
            var rx = Math.abs(origX - pointer.x) / 2;
            var ry = Math.abs(origY - pointer.y) / 2;
            shape.set({ rx: rx, ry: ry });
        } else if (shapeType === "triangle") {
            var width = Math.abs(origX - pointer.x);
            var height = Math.abs(origY - pointer.y);
            shape.set({ width: width, height: height });
        } else if (shapeType === "diamond") {
            var width = Math.abs(origX - pointer.x);
            var height = Math.abs(origY - pointer.y);
            width = height;
            shape.set({ width: width, height: height });
        } else if (shapeType === "roundedRect") {
            if (origX > pointer.x) {
                shape.set({ left: Math.abs(pointer.x) });
            }
            if (origY > pointer.y) {
                shape.set({ top: Math.abs(pointer.y) });
            }
            shape.set({ width: Math.abs(origX - pointer.x) });
            shape.set({ height: Math.abs(origY - pointer.y) });
        } else if (shapeType === "line") {
            points.push({ x: pointer.x, y: pointer.y });
            shape = new fabric.Line(
                points.map((point) => [point.x, point.y]),
                {
                    stroke: canvas.freeDrawingBrush.color,
                    strokeWidth: canvas.freeDrawingBrush.width,
                    selectable: false,
                }
            );
            canvas.add(shape);
        }

        canvas.renderAll();
    });

    canvas.on("mouse:up", function (o) {
        isDown = false;

        if (shapeType !== "line") {
            canvas.setActiveObject(shape);
        } else {
            canvas.isDrawingMode = false;
        }

        // Re-enable selection for existing objects
        canvas.forEachObject(function (obj) {
            obj.set("selectable", true);
            obj.set("evented", true);
        });
        canvas.selectionColor = selectionColorValue;
        canvas.off("mouse:down");
        canvas.off("mouse:move");
        canvas.off("mouse:up");
    });
}

function drawText() {
    var isDrawing = false;
    canvas.selection = true;
    canvas.selectionColor = "transparent";
    var points = [];

    canvas.on("mouse:down", function (o) {
        isDrawing = true;
        var pointer = canvas.getPointer(o.e);
        var startX = pointer.x;
        var startY = pointer.y;
        points = [startX, startY, startX, startY];

        var textbox = new fabric.Textbox("", {
            left: startX,
            top: startY,
            fontSize: 16,
            width: 1,
            height: 1,
            borderColor: "black",
            cornerColor: "black",
            transparentCorners: false,
            selectable: true,
        });

        canvas.add(textbox);
    });

    canvas.on("mouse:move", function (o) {
        if (!isDrawing) return;
        var pointer = canvas.getPointer(o.e);
        var currentX = pointer.x;
        var currentY = pointer.y;

        var textbox = canvas.item(canvas.getObjects().length - 1);
        if (textbox) {
            textbox.set({
                width: Math.abs(currentX - points[0]),
                height: Math.abs(currentY - points[1]),
            });
            textbox.setCoords();
            canvas.renderAll();
        }
    });

    canvas.on("mouse:up", function (o) {
        isDrawing = false;
    });
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
function saveState(action, object) {
    const canvasObjects = canvas.getObjects();
    const data = {
        action: action,
        object: object ? fabric.util.object.clone(object) : null,
        state: JSON.stringify(canvas),
    };

    if (action === "added" || action === "removed") {
        history = history.slice(0, historyIndex);
        history.push(data);
        historyIndex = history.length;
    } else if (action === "modified") {
        if (historyIndex === history.length) {
            history.push(data);
        } else {
            history[historyIndex] = data;
        }
        historyIndex++;
    }
}

function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        const data = history[historyIndex];
        canvas.loadFromJSON(data.state, () => {
            if (data.action === "added") {
                const obj = canvas.getObjects().find((o) => o === data.object);
                if (obj) canvas.remove(obj);
            } else if (data.action === "removed") {
                canvas.add(data.object);
            }
            canvas.renderAll();
        });
    }
}

function redo() {
    if (historyIndex < history.length) {
        const data = history[historyIndex];
        canvas.loadFromJSON(data.state, () => {
            if (data.action === "added") {
                canvas.add(data.object);
            } else if (data.action === "removed") {
                const obj = canvas.getObjects().find((o) => o === data.object);
                if (obj) canvas.remove(obj);
            }
            canvas.renderAll();
        });
        historyIndex++;
    }
}

document.getElementById("undoBtn").addEventListener("click", undo);
document.getElementById("redoBtn").addEventListener("click", redo);

canvas.on("object:added", (e) => saveState("added", e.target));
canvas.on("object:removed", (e) => saveState("removed", e.target));
canvas.on("object:modified", (e) => saveState("modified", e.target));

// Shortcut keys
window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey && e.key === "a") || (e.ctrlKey && e.key === "A")) {
        canvas.discardActiveObject();
        var selectable = [];
        canvas.getObjects().forEach((obj) => {
            selectable.push(obj);
        });
        canvas.setActiveObject(
            new fabric.ActiveSelection(selectable, {
                canvas: canvas,
            })
        );
        canvas.isDrawingMode = false;
        canvas.renderAll();
    } else if ((e.ctrlKey && e.key === "z") || (e.ctrlKey && e.key === "Z")) {
        // Code for Ctrl + Z (Undo)
        if (canvas.getActiveObject()) {
            canvas.getActiveObject().revertHistory();
            canvas.renderAll();
        } else {
            canvas.undo();
        }
    } else if (e.ctrlKey && e.shiftKey && e.key === "Z") {
        // Code for Ctrl + Shift + Z (Redo)
        if (canvas.getActiveObject()) {
            canvas.getActiveObject().resumeHistory();
            canvas.renderAll();
        } else {
            canvas.redo();
        }
    } else if (e.key === "v" || e.key === "V") {
        toggleMoveTool();
    } else if (e.key === "b" || e.key === "B") {
        togglePencilMode();
    } else if (e.key === "Delete" || e.key === "Backspace") {
        canvas.getActiveObjects().forEach((obj) => {
            canvas.remove(obj);
        });
        canvas.discardActiveObject().renderAll();
    }
});
