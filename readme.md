# `Drag-N-Sort`

`Drag-N-Sort` is a React DOM package designed to effortlessly add Drag and Drop functionality to both flex and grid containers, enabling innovative content sorting capabilities.

![Drag-N-Sort Demo](https://eu-central.storage.cloudconvert.com/tasks/db832873-66c8-4761-9cef-c53479ecd94d/Screencast%20from%2003-28-2024%2007:46:51%20PM.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=cloudconvert-production/20240328/fra/s3/aws4_request&X-Amz-Date=20240328T195220Z&X-Amz-Expires=86400&X-Amz-Signature=0cdb83318b20c895afd329aeb3df6233c0ba5123e4489b307ac304c116e2bd71&X-Amz-SignedHeaders=host&response-content-disposition=attachment;%20filename=%22Screencast%20from%2003-28-2024%2007:46:51%20PM.gif%22&response-content-type=image/gif&x-id=GetObject)

---

## Installation

To install `Drag-N-Sort`, simply run:

```bash
npm i drag-n-drop
```

in your project directory.

## Usage

To implement `Drag-N-Sort`, utilize the `Draggable` component within your container `div`. Wrap your actual component with the `Draggable` component, ensuring uniformity of the `section_id` across all relevant `Draggable` objects.

```jsx
<div className="flex relative gap-02" ref={ref}>
  {array.map((element, _index) => (
    <Draggable
      parent_ref={ref}
      onDrop={(id: number, direction: PlacementMarker) => console.log(id, direction)}
      section_id={"array_one"}
      vertical={false}
      drag_only_button={false}
      key={element.id}
    >
      <Component/>
    </Draggable>
  ))}
</div>
```

Upon rendering the page, users can click and hold to drag and drop items within the container (based on the children).

## Differentiating Between Containers

To segregate different groups of `Draggable` elements, utilize the `section_id` parameter to group `Draggable` elements, ensuring they interact only with elements sharing the same key.

```jsx
<div className="flex relative gap-02" ref={ref}>
  {array_of_array.map((element) => (
    {element.array.map((sub_element) => ( 
      <Draggable
        parent_ref={ref}
        onDrop={(id: number, direction: PlacementMarker) => console.log(id, direction)}
        section_id={element.key}
        vertical={false}
        drag_only_button={false}
        key={element.key}
      >
        <Component {...sub_element}/>
      </Draggable>
    )
  ))}
</div>
```

## Changing Click Area

To customize the click area, utilize the `drag_only_button` and `drag_button` parameters. By default, the click area targets the top right of the `Draggable` object, though this will change in future versions.

```jsx
<div className="flex relative gap-02" ref={ref}>
  {array.map((element, _index) => (
    <Draggable
      parent_ref={ref}
      onDrop={(id: number, direction: PlacementMarker) => console.log(id, direction)}
      section_id={"array_one"}
      vertical={false}
      drag_only_button={true}
      drag_button={<img src="/icons/move.svg" alt="drag" className="icon" draggable={false}/>}
      key={element.id}
    >
      <Component/>
    </Draggable>
  ))}
</div>
```

## Orientation

Depending on the website layout, you may prefer vertical drag and drop functionality over traditional horizontal. Toggle this using the `vertical` parameter.

```jsx
<div className="flex column relative gap-02" ref={ref}>
  {array.map((element, _index) => (
    <Draggable
      parent_ref={ref}
      onDrop={(id: number, direction: PlacementMarker) => console.log(id, direction)}
      section_id={"array_one"}
      vertical={true}
      drag_only_button={true}
      drag_button={<img src="/icons/move.svg" alt="drag" className="icon" draggable={false}/>}
      key={element.id}
    >
      <Component/>
    </Draggable>
  ))}
</div>
```

# Types

## `PlacementMarker`

This simple type is passed into the `onDrop` callback, describing the element's position, especially when `vertical` is set to true.

```ts
export type PlacementMarker = 'left' | 'right' | 'top' | 'bottom'
```

## `DraggableProps`

`DraggableProps` is a simple prop type for the `Draggable` component.

```ts
export type DraggableProps = {
  children: ReactNode,
  parent_ref: RefObject<HTMLElement>,
  vertical?: boolean,
  onDrop?: (index: number, position: PlacementMarker) => void
  section_id?: string,
  index?: number
  drag_only_button?: boolean
  drag_button?: ReactNode
}
```

# Features

- Seamless integration with existing components and containers.
- Efficient Drag and Drop functionality for sorting elements on a page.
- Easy-to-use callback function.

# Limitations

- Not yet optimized for mobile (*planned for future updates*).
- Right-clicking may cause tracking issues.
- Drag button styling is not adjustable (*planned for future updates*).


---

# Links
- [GitHub](https://github.com/Identityofsine/drag-n-sort)
- [npm](https://www.npmjs.com/package/drag-n-sort)

