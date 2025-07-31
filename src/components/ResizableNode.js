import { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

const ResizableNode = ({ data, selected, type }) => {
  return (
    <div className='w-[calc(calc(100%-4px)] min-w-[146px] h-[calc(100%-4px)] min-h-[41px] flex items-center justify-center border rounded m-[2px]' style={{ backgroundColor: data.color }}>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={150}
        minHeight={45}
      />
      {type !== "output" && (<Handle type="target" position={Position.Top} />)}
      <div>{data.label}</div>
      {type !== "input" && (<Handle type="source" position={Position.Bottom} />)}
    </div>
  );
};
 
export default memo(ResizableNode);