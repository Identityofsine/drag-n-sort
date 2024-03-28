import '../styles/draggable.scss';
import { ReactNode, RefObject } from "react";
export type PlacementMarker = 'left' | 'right' | 'top' | 'bottom';
export type DraggableProps = {
    children: ReactNode;
    parent_ref: RefObject<HTMLElement>;
    vertical?: boolean;
    onDrop?: (index: number, position: PlacementMarker) => void;
    section_id?: string;
    index?: number;
    drag_only_button?: boolean;
    drag_button?: ReactNode;
};
declare const Draggable: ({ parent_ref, section_id, drag_only_button, index, vertical, ...props }: DraggableProps) => import("react/jsx-runtime").JSX.Element;
export default Draggable;
