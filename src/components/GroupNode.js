import { memo, useEffect, useRef } from 'react';
 
const GroupNode = ({ data }) => {
  const containerRef = useRef();
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const child = containerRef.current.querySelector('div');
      if (child) {
        child.style.width = containerWidth > 150 ? '100px' : '150px';
      }
    }
  })
  return (
    <div ref={containerRef} style={{ backgroundColor: data.color }} className='rounded-lg shadow-lg p-4 opacity-60 h-full w-full relative'>
      <div className='absolute flex items-center justify-center h-full top-0 left-0 w-[150px]'>{data.label}</div>
    </div>
  );
};

export default memo(GroupNode);