// 实现横向与纵向可拖动的功能
export const resizable = (resizer) => {
    console.log("current resizer:", resizer);
    const direction = resizer.getAttribute('data-direction') || 'horizontal';
    const prevSibling = resizer.previousElementSibling;
    const nextSibling = resizer.nextElementSibling;

    // The current position of mouse
    let x = 0;
    let y = 0;
    let prevSiblingHeight = 0;
    let prevSiblingWidth = 0;

    // Handle the mousedown event
    // that's triggered when user drags the resizer
    const mouseDownHandler = (e) => {
      console.log('mouse down!!');
      // Get the current mouse position
      x = e.clientX;
      y = e.clientY;
      const rect = prevSibling.getBoundingClientRect();
      prevSiblingHeight = rect.height;
      prevSiblingWidth = rect.width;

      console.log('x =', x);
      console.log('y =', y);
      console.log('prevSiblingHeigh =', prevSiblingHeight);
      console.log('prevSiblingWidth =', prevSiblingWidth);

      // Attach the listeners to `document`
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = (e) => {
      // How far the mouse has been moved
      const dx = e.clientX - x;
      const dy = e.clientY - y;

      switch (direction) {
        case 'vertical':
          // Calculate new height percentage when mouse is moving
          console.log('Calculating new height percentage...');
          console.log('prevSiblingHeight + dy =', prevSiblingHeight + dy);
          console.log('resizer.parentNode.getBoundingClientRect().height', resizer.parentNode.getBoundingClientRect().height);
          const h =
            ((prevSiblingHeight + dy) * 100) /
            resizer.parentNode.getBoundingClientRect().height;

          console.log('new height percentage:', `${h}%`)
          prevSibling.style.height = `${h}%`;
          break;
        case 'horizontal':
        default:
          // Calculate new width percentage when mouse is moving
          console.log('Calculating new width percentage...');
          console.log('prevSiblingWidth + dx =', prevSiblingWidth + dx);
          console.log('resizer.parentNode.getBoundingClientRect().width', resizer.parentNode.getBoundingClientRect().width);
          const w =
            ((prevSiblingWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;

          console.log('new width percentage:', `${w}%`);
          prevSibling.style.width = `${w}%`;
          break;
      }

      // set mouse curor style
      const cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
      resizer.style.cursor = cursor;
      document.body.style.cursor = cursor;

      // prevent the mouse events and text selection in both sides by 
      // setting the values for user-select and pointer-events
      prevSibling.style.userSelect = 'none';
      prevSibling.style.pointerEvents = 'none';

      nextSibling.style.userSelect = 'none';
      nextSibling.style.pointerEvents = 'none';
    };

    const mouseUpHandler = () => {
      console.log('mouse up!!');

      // Remove sytle which is for mouse moving
      resizer.style.removeProperty('cursor');
      document.body.style.removeProperty('cursor');

      prevSibling.style.removeProperty('user-select');
      prevSibling.style.removeProperty('pointer-events');

      nextSibling.style.removeProperty('user-select');
      nextSibling.style.removeProperty('pointer-events');

      // Remove the handlers of `mousemove` and `mouseup`
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    // Attach the handler
    resizer.addEventListener('mousedown', mouseDownHandler);
  };