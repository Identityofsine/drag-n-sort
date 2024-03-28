"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var jsx_runtime_1 = require("react/jsx-runtime");
require("../styles/draggable.scss");
var react_1 = require("react");
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}
var Draggable = function (_a) {
    var parent_ref = _a.parent_ref, _b = _a.section_id, section_id = _b === void 0 ? "" : _b, _c = _a.drag_only_button, drag_only_button = _c === void 0 ? false : _c, index = _a.index, _d = _a.vertical, vertical = _d === void 0 ? false : _d, props = tslib_1.__rest(_a, ["parent_ref", "section_id", "drag_only_button", "index", "vertical"]);
    var _f = (0, react_1.useState)(false), holding = _f[0], setHolding = _f[1];
    var ref = (0, react_1.useRef)(null);
    var container_ref = (0, react_1.useRef)(null);
    var mouse_pos_ref = (0, react_1.useRef)({ x: 0, y: 0 });
    var ghost_ref = (0, react_1.useRef)(null);
    var animation_ref = (0, react_1.useRef)(0);
    var child_ref = (0, react_1.useRef)();
    var position_ref = (0, react_1.useRef)(vertical ? 'top' : 'left');
    var interval_ref = (0, react_1.useRef)();
    section_id = replaceAll(section_id, " ", "_").trim();
    (0, react_1.useEffect)(function () {
        var _a;
        if (holding) {
            (_a = ref.current) === null || _a === void 0 ? void 0 : _a.classList.remove('relative');
            animation_ref.current = requestAnimationFrame(onMouseAnimation);
        }
        else {
            cancelAnimationFrame(animation_ref.current);
            dropElement();
        }
        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousemove", onMouseMove);
        return function () {
            document.removeEventListener("mouseup", onMouseUp);
            document.removeEventListener("mousemove", onMouseMove);
            document.body.style.cursor = "auto";
            document.body.style.userSelect = "auto";
            cancelAnimationFrame(animation_ref.current);
        };
    }, [holding]);
    function onMouseDown(_e) {
        interval_ref.current = setTimeout(function () {
            document.body.style.cursor = "grabbing";
            document.body.style.userSelect = "none";
            if (parent_ref.current && ref.current) {
                setHolding(true);
            }
            else {
                console.warn("Parent not found");
            }
        }, 125);
    }
    function onMouseUp(_e) {
        clearTimeout(interval_ref.current);
        setHolding(false);
        document.body.style.cursor = "auto";
        document.body.style.userSelect = "auto";
    }
    function onMouseMove(e) {
        mouse_pos_ref.current = { x: e.clientX, y: e.clientY };
    }
    function dropElement() {
        var _a;
        if (ghost_ref.current && parent_ref.current && ref.current && !holding) {
            clearClosest(true);
            if (child_ref.current !== undefined) {
                if (child_ref.current !== index)
                    (_a = props.onDrop) === null || _a === void 0 ? void 0 : _a.call(props, child_ref.current, position_ref.current);
            }
            child_ref.current = undefined;
            ghost_ref.current.style.left = "0px";
            ghost_ref.current.style.top = "0px";
            clearClosest(true);
        }
    }
    function onMouseAnimation() {
        if (ghost_ref.current && container_ref.current && holding) {
            var mouse_pos = mouse_pos_ref.current;
            var element = ghost_ref.current;
            var child = findNearestElement();
            if (child) {
                if (child_ref.current !== child.element || position_ref.current !== child.position) {
                    child_ref.current = child.element;
                    position_ref.current = child.position;
                    clearClosest();
                }
            }
            var rect = container_ref.current.getBoundingClientRect();
            var x = mouse_pos.x - rect.left - element.clientWidth / 2;
            var y = mouse_pos.y - rect.top - element.clientHeight / 2;
            element.style.left = "".concat(x, "px");
            element.style.top = "".concat(y, "px");
        }
        animation_ref.current = requestAnimationFrame(onMouseAnimation);
    }
    function clearClosest(all) {
        var _a;
        if (all === void 0) { all = false; }
        var children = (_a = parent_ref.current) === null || _a === void 0 ? void 0 : _a.childNodes;
        if (children) {
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (i !== index && !all) {
                    child.classList.remove("close-".concat(vertical ? "top" : "left"));
                    child.classList.remove("close-".concat(vertical ? "bottom" : "right"));
                }
                else {
                    child.classList.remove("close-".concat(vertical ? "top" : "left"));
                    child.classList.remove("close-".concat(vertical ? "bottom" : "right"));
                }
            }
        }
    }
    function findNearestElement() {
        var _a;
        function getMinDistance(rect, buffer) {
            if (buffer === void 0) { buffer = 10; }
            var mouse_x = mouse_pos_ref.current.x;
            var left_distance = Math.abs(rect.left - mouse_x);
            var right_distance = Math.abs(rect.right - mouse_x);
            var up_distance = Math.abs(rect.top - mouse_pos_ref.current.y);
            var down_distance = Math.abs(rect.bottom - mouse_pos_ref.current.y);
            // Add a buffer before switching between DOMs
            if (vertical) {
                if (up_distance < buffer || down_distance < buffer) {
                    return [Math.min(left_distance, right_distance), Math.min(up_distance, down_distance), up_distance < down_distance ? "top" : "bottom"];
                }
                else {
                    return [Math.min(left_distance, right_distance), Math.min(up_distance, down_distance), mouse_pos_ref.current.y <= (rect.top + rect.bottom) / 2 ? "top" : "bottom"];
                }
            }
            else {
                if (left_distance < buffer || right_distance < buffer) {
                    return [Math.min(left_distance, right_distance), Math.min(up_distance, down_distance), left_distance < right_distance ? "left" : "right"];
                }
                else {
                    return [Math.min(left_distance, right_distance), Math.min(up_distance, down_distance), mouse_x <= (rect.left + rect.right) / 2 ? "left" : "right"];
                }
            }
        }
        function pointDistance(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        }
        if (ghost_ref.current && holding) {
            var children = (_a = parent_ref.current.childNodes) !== null && _a !== void 0 ? _a : [];
            var closest = -1;
            var closest_distance = Number.MAX_VALUE;
            var direction = vertical ? "top" : "left";
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (!child)
                    continue;
                if (!child.classList.contains("id-grabbable-".concat(section_id ? "" + section_id : "all")))
                    continue;
                var rect = child.getBoundingClientRect();
                var _b = getMinDistance(rect), _distance_x = _b[0], _distance_y = _b[1], dir = _b[2];
                var point_distance = pointDistance(mouse_pos_ref.current.x, mouse_pos_ref.current.y, (rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2);
                if (point_distance < closest_distance) {
                    closest = i;
                    closest_distance = point_distance;
                    direction = dir;
                }
            }
            var closest_element = children[closest];
            if (closest_element) {
                var min_distance = getMinDistance(closest_element.getBoundingClientRect());
                direction = min_distance[2];
                closest_element.classList.remove("close-".concat(position_ref.current));
                closest_element.classList.add("close-".concat(direction));
            }
            return { element: closest, position: direction };
        }
        else {
            return undefined;
        }
    }
    return ((0, jsx_runtime_1.jsxs)("div", { ref: container_ref, onMouseDown: function (e) { if (!drag_only_button)
            onMouseDown(e); }, className: "grabbable ".concat(drag_only_button ? 'button-only' : '', " id-grabbable-").concat(section_id ? section_id : "all", " relative"), children: [(0, jsx_runtime_1.jsx)("div", { ref: ref, className: "relative", children: props.children }), drag_only_button &&
                (0, jsx_runtime_1.jsx)("div", { className: "drag-button absolute top-0 right-0", onMouseDown: onMouseDown, children: (0, jsx_runtime_1.jsx)("img", { src: "/icons/move.svg", alt: "drag", className: "icon", draggable: false }) }), (0, jsx_runtime_1.jsx)("div", { ref: ghost_ref, className: "ghost absolute ".concat(holding ? "active" : "") })] }));
};
exports.default = Draggable;
//# sourceMappingURL=drgndrp.js.map