'use client';
import '../styles/draggable.scss'
import { RefObject, useEffect, useRef, useState } from "react";

type MousePos = {
	x: number,
	y: number
}
export type PlacementMarker = 'left' | 'right' | 'top' | 'bottom'

type DraggableProps = {
	children: React.ReactNode,
	parent_ref: RefObject<HTMLElement>,
	vertical?: boolean,
	onDrop?: (index: number, position: PlacementMarker) => void
	section_id?: string,
	index?: number
	drag_only_button?: boolean
}

function replaceAll(str: string, find: string, replace: string) {
	return str.replace(new RegExp(find, 'g'), replace);
}


const Draggable = ({ parent_ref, section_id = "", drag_only_button = false, index, vertical = false, ...props }: DraggableProps) => {

	const [holding, setHolding] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const container_ref = useRef<HTMLDivElement>(null);
	const mouse_pos_ref = useRef<MousePos>({ x: 0, y: 0 });
	const ghost_ref = useRef<HTMLDivElement>(null);
	const animation_ref = useRef<number>(0);
	const child_ref = useRef<number>();
	const position_ref = useRef<PlacementMarker>(vertical ? 'top' : 'left');
	const interval_ref = useRef<NodeJS.Timeout>();
	section_id = replaceAll(section_id, " ", "_").trim();

	useEffect(() => {
		if (holding) {
			ref.current?.classList.remove('relative');
			animation_ref.current = requestAnimationFrame(onMouseAnimation);
		} else {
			cancelAnimationFrame(animation_ref.current);
			dropElement();
		}

		document.addEventListener("mouseup", onMouseUp);
		document.addEventListener("mousemove", onMouseMove);

		return () => {
			document.removeEventListener("mouseup", onMouseUp);
			document.removeEventListener("mousemove", onMouseMove);
			document.body.style.cursor = "auto";
			document.body.style.userSelect = "auto";
			cancelAnimationFrame(animation_ref.current);
		}
	}, [holding])

	function onMouseDown(e: React.MouseEvent) {
		interval_ref.current = setTimeout(() => {
			document.body.style.cursor = "grabbing";
			document.body.style.userSelect = "none";
			if (parent_ref.current && ref.current) {
				setHolding(true);
			} else {
				console.warn("Parent not found");
			}
		}, 125);
	}

	function onMouseUp(e: MouseEvent) {
		clearTimeout(interval_ref.current);
		setHolding(false);
		document.body.style.cursor = "auto";
		document.body.style.userSelect = "auto";
	}

	function onMouseMove(e: MouseEvent) {
		mouse_pos_ref.current = { x: e.clientX, y: e.clientY };
	}

	function dropElement() {
		if (ghost_ref.current && parent_ref.current && ref.current && !holding) {
			clearClosest(true);
			if (child_ref.current !== undefined) {
				if (child_ref.current !== index)
					props.onDrop?.(child_ref.current, position_ref.current);
			}
			child_ref.current = undefined;
			ghost_ref.current.style.left = "0px";
			ghost_ref.current.style.top = "0px"; clearClosest(true);
		}
	}

	function onMouseAnimation() {
		if (ghost_ref.current && container_ref.current && holding) {
			const mouse_pos = mouse_pos_ref.current;
			const element = ghost_ref.current;
			const child = findNearestElement();
			if (child) {
				if (child_ref.current !== child.element || position_ref.current !== child.position) {
					child_ref.current = child.element;
					position_ref.current = child.position;
					clearClosest();
				}
			}
			const rect = container_ref.current.getBoundingClientRect();
			const x = mouse_pos.x - rect.left - element.clientWidth / 2;
			const y = mouse_pos.y - rect.top - element.clientHeight / 2;
			element.style.left = `${x}px`;
			element.style.top = `${y}px`;

		}
		animation_ref.current = requestAnimationFrame(onMouseAnimation);
	}

	function clearClosest(all: boolean = false) {
		const children = parent_ref.current?.childNodes;
		if (children) {
			for (let i = 0; i < children.length; i++) {
				const child = children[i] as HTMLElement;
				if (i !== index && !all) {
					child.classList.remove(`close-${vertical ? "top" : "left"}`);
					child.classList.remove(`close-${vertical ? "bottom" : "right"}`);
				}
				else {
					child.classList.remove(`close-${vertical ? "top" : "left"}`);
					child.classList.remove(`close-${vertical ? "bottom" : "right"}`);
				}
			}
		}
	}

	function findNearestElement(): { element?: number, position: PlacementMarker } | undefined {

		function getMinDistance(rect: DOMRect, buffer: number = 10, id: string = ""): [number, number, PlacementMarker] {
			const mouse_x = mouse_pos_ref.current.x;
			const left_distance = Math.abs(rect.left - mouse_x);
			const right_distance = Math.abs(rect.right - mouse_x);
			const up_distance = Math.abs(rect.top - mouse_pos_ref.current.y);
			const down_distance = Math.abs(rect.bottom - mouse_pos_ref.current.y);
			// Add a buffer before switching between DOMs
			if (vertical) {
				if (up_distance < buffer || down_distance < buffer) {
					return [Math.min(left_distance, right_distance), Math.min(up_distance, down_distance), up_distance < down_distance ? "top" : "bottom"];
				} else {
					return [Math.min(left_distance, right_distance), Math.min(up_distance, down_distance), mouse_pos_ref.current.y <= (rect.top + rect.bottom) / 2 ? "top" : "bottom"];
				}
			} else {
				if (left_distance < buffer || right_distance < buffer) {
					return [Math.min(left_distance, right_distance), Math.min(up_distance, down_distance), left_distance < right_distance ? "left" : "right"];
				} else {
					return [Math.min(left_distance, right_distance), Math.min(up_distance, down_distance), mouse_x <= (rect.left + rect.right) / 2 ? "left" : "right"];
				}
			}
		}

		function pointDistance(x1: number, y1: number, x2: number, y2: number): number {
			return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
		}

		if (ghost_ref.current && holding) {
			const children = parent_ref.current!.childNodes ?? [];
			let closest: number = -1;
			let closest_distance: number = Number.MAX_VALUE;
			let direction: PlacementMarker = vertical ? "top" : "left";
			for (let i = 0; i < children.length; i++) {
				const child = children[i] as HTMLElement;
				if (!child) continue;
				if (!child.classList.contains(`id-grabbable-${section_id ? "" + section_id : "all"}`)) continue;
				const rect = child.getBoundingClientRect();
				const [distance_x, distance_y, dir] = getMinDistance(rect);
				const point_distance = pointDistance(mouse_pos_ref.current.x, mouse_pos_ref.current.y, (rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2);

				if (point_distance < closest_distance) {
					closest = i
					closest_distance = point_distance;
					direction = dir as PlacementMarker;
				}
			}
			const closest_element = children[closest] as HTMLElement;
			if (closest_element) {
				const min_distance = getMinDistance(closest_element.getBoundingClientRect());
				direction = min_distance[2];
				closest_element.classList.remove(`close-${position_ref.current}`)
				closest_element.classList.add(`close-${direction}`);
			}
			return { element: closest, position: direction };
		} else {
			return undefined
		}
	}


	return (
		<div ref={container_ref} onMouseDown={(e) => { if (!drag_only_button) onMouseDown(e) }} className={`grabbable ${drag_only_button ? 'button-only' : ''} id-grabbable-${section_id ? section_id : "all"} relative`}>
			<div ref={ref} className="relative">
				{props.children}
			</div>

			{drag_only_button &&
				<div className="drag-button absolute top-0 right-0" onMouseDown={onMouseDown}>
					<img src="/icons/move.svg" alt="drag" className="icon" draggable={false} />
				</div>
			}

			<div ref={ghost_ref} className={`ghost absolute ${holding ? "active" : ""}`}>
			</div>
		</div >
	)
}

export default Draggable
