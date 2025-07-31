import { Checkbox, Input, MenuItem, Select } from "@mui/material";

const EdgeControlPanel = ({ selectedItem, onInputChange, setEdges, edges }) => {
	const selectedEdge = edges.find((edge) => edge.id === selectedItem.value.id);
	const edgeTypes = {
		default: "0 0",
		dashed: "4 2",
		dotted: "1 2",
	}
	return (
		<div className='flex flex-col'>
			<h2 className='mt-4 mb-4 font-lg font-bold'>Edge Details</h2>
			<strong>Target:</strong>{" "}
			<Input
				type='text'
				name='target'
				defaultValue={selectedItem.value.target}
				onInput={(e) => onInputChange(e, setEdges)}
				className='border rounded py-1 px-2'
			/>
			<strong>Source:</strong>{" "}
			<Input
				type='text'
				name='source'
				defaultValue={selectedItem.value.source}
				onInput={(e) => onInputChange(e, setEdges)}
				className='border rounded py-1 px-2'
			/>
			<strong>Label:</strong>{" "}
			<Input
				type='text'
				name='label'
				defaultValue={selectedItem.value.label ?? ""}
				onInput={(e) => onInputChange(e, setEdges)}
				className='border rounded py-1 px-2'
			/>
			<strong>Style:</strong>{" "}
			<Select
				name='style.strokeDasharray'
				className='w-full border rounded h-[41px]'
				value={selectedEdge?.style?.strokeDasharray ?? "default"}
				defaultValue={""}
				onChange={(e) => onInputChange(e, setEdges)}
			>
				{Object.keys(edgeTypes).map((opt) => (
					<MenuItem key={opt} value={edgeTypes[opt]}>
						{opt}
					</MenuItem>
					))}
			</Select>
			<div>
				<strong>Arrow Start:</strong>{" "}
				<Checkbox
					type='checkbox'
					name='markerStart'
					checked={
						!!selectedEdge?.markerStart
					}
					onChange={(e) => onInputChange(e, setEdges)}
				/>
			</div>
			<div>
				<strong>Arrow End:</strong>{" "}
				<Checkbox
					type='checkbox'
					name='markerEnd'
					checked={
						!!selectedEdge?.markerEnd
					}
					onChange={(e) => onInputChange(e, setEdges)}
				/>
			</div>
			<strong>Color:</strong>{" "}
			<Input
				type='color'
				name='style.stroke'
				defaultValue={selectedEdge?.style?.stroke ?? ""}
				onInput={(e) => onInputChange(e, setEdges)}
				className='border rounded p-0 h-[41px]'
			/>
		</div>
	);
};

export default EdgeControlPanel;
