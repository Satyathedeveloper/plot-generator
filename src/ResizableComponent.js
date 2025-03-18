import React, { useState, useRef } from 'react';

const ResizableComponent = () => {
  const [items, setItems] = useState([
    { id: 1, x: 20, y: 20, width: 200, height: 150, color: 'bg-blue-200' },
    { id: 2, x: 240, y: 20, width: 200, height: 150, color: 'bg-green-200' },
    { id: 3, x: 20, y: 190, width: 200, height: 150, color: 'bg-red-200' }
  ]);
  
  const [activeItem, setActiveItem] = useState(null);
  const [resizing, setResizing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseDown = (e, id, corner) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    setStartPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setActiveItem({ id, corner });
    setResizing(true);
  };

  const handleDragStart = (e, id) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    setStartPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setActiveItem({ id });
    setDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!activeItem) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const deltaX = currentX - startPos.x;
    const deltaY = currentY - startPos.y;

    setItems(prevItems => prevItems.map(item => {
      if (item.id !== activeItem.id) return item;

      if (dragging) {
        return {
          ...item,
          x: item.x + deltaX,
          y: item.y + deltaY
        };
      }

      if (resizing) {
        const corner = activeItem.corner;
        let newWidth = item.width;
        let newHeight = item.height;
        let newX = item.x;
        let newY = item.y;

        if (corner.includes('right')) {
          newWidth = Math.max(100, item.width + deltaX);
        }
        if (corner.includes('left')) {
          newWidth = Math.max(100, item.width - deltaX);
          newX = item.x + deltaX;
        }
        if (corner.includes('bottom')) {
          newHeight = Math.max(100, item.height + deltaY);
        }
        if (corner.includes('top')) {
          newHeight = Math.max(100, item.height - deltaY);
          newY = item.y + deltaY;
        }

        return {
          ...item,
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY
        };
      }

      return item;
    }));

    setStartPos({ x: currentX, y: currentY });
  };

  const handleMouseUp = () => {
    setActiveItem(null);
    setResizing(false);
    setDragging(false);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-gray-100 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {items.map(item => (
        <div
          key={item.id}
          className={`absolute ${item.color} rounded-lg shadow-lg`}
          style={{
            left: item.x,
            top: item.y,
            width: item.width,
            height: item.height,
          }}
        >
          {/* Resize handles */}
          <div className="absolute -top-1 -left-1 w-4 h-4 cursor-nw-resize"
               onMouseDown={(e) => handleMouseDown(e, item.id, 'topleft')} />
          <div className="absolute -top-1 -right-1 w-4 h-4 cursor-ne-resize"
               onMouseDown={(e) => handleMouseDown(e, item.id, 'topright')} />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 cursor-sw-resize"
               onMouseDown={(e) => handleMouseDown(e, item.id, 'bottomleft')} />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 cursor-se-resize"
               onMouseDown={(e) => handleMouseDown(e, item.id, 'bottomright')} />
          
          {/* Drag handle */}
          <button
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center cursor-move"
            onMouseDown={(e) => handleDragStart(e, item.id)}
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9h8M8 15h8" />
            </svg>
          </button>
          
          <div className="p-4">
            Component {item.id}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResizableComponent;