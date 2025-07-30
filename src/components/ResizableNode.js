import { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

const ResizableNode = ({ data, selected, type }) => {
  return (
    <div className='w-[calc(calc(100%-8px)] h-[calc(100%-8px)] flex items-center justify-center bordered rounded m-1' style={{ backgroundColor: data.color }}>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      {type !== "output" && (<Handle type="target" position={Position.Top} />)}
      <div>{data.label}</div>
      {type !== "input" && (<Handle type="source" position={Position.Bottom} />)}
    </div>
  );
};
 
export default memo(ResizableNode);