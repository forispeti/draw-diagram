import { Input, MenuItem, Select } from "@mui/material";

const NodeControlPanel = ({ selectedItem, onInputChange, setNodes, nodes, modalTypes }) => {
    const selectedNode = nodes.find((node) => node.id === selectedItem.value.id);
	return (
		<div className='flex flex-col'>
			<h2 className='mt-4 mb-4 font-lg font-bold'>Node Details</h2>
			<strong>Position X:</strong>{" "}
			<Input
				type='text'
				name='position.x'
				defaultValue={selectedItem.value.position.x}
				onInput={(e) => onInputChange(e, setNodes)}
				className='border rounded py-1 px-2'
			/>
			<strong>Position Y:</strong>{" "}
			<Input
				type='text'
				name='position.y'
				defaultValue={selectedItem.value.position.y}
				onInput={(e) => onInputChange(e, setNodes)}
				className='border rounded py-1 px-2'
			/>
			<strong>Label:</strong>{" "}
			<Input
				type='text'
				name='data.label'
				value={
					selectedNode?.data?.label ?? ""
				}
				onInput={(e) => onInputChange(e, setNodes)}
				className='border rounded py-1 px-2'
			/>
			<strong>Background:</strong>{" "}
			<Input
				type='color'
				name='data.color'
				value={
					selectedNode?.data?.color ?? ""
				}
				onInput={(e) => onInputChange(e, setNodes)}
				className='border rounded p-0'
			/>
			<strong>Height:</strong>{" "}
			<Input
				type='number'
				name='measured.height'
				readOnly
				value={
					selectedNode?.measured?.height ?? ""
				}
				onInput={(e) => onInputChange(e, setNodes)}
				className='border rounded py-1 px-2'
			/>
			<strong>Width:</strong>{" "}
			<Input
				type='number'
				name='measured.width'
				readOnly
				value={
					selectedNode?.measured?.width ?? ""
				}
				onInput={(e) => onInputChange(e, setNodes)}
				className='border rounded px-2 py-1'
			/>
			<strong>Type:</strong>{" "}
			<Select
				name='type'
				className='w-full border rounded'
				value={selectedItem.value.type ?? "default"}
				onChange={(e) => onInputChange(e, setNodes)}
			>
				{modalTypes.addNode.inputs
					.find((input) => input.type === "select")
					.options.map((opt) => (
						<MenuItem key={opt} value={opt}>
							{opt}
						</MenuItem>
					))}
			</Select>
		</div>
	);
};

export default NodeControlPanel;
