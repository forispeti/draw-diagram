import { Checkbox, Input } from "@mui/material";

const EdgeControlPanel = ({ selectedItem, onInputChange, setEdges, edges }) => {
	const selectedEdge = edges.find((edge) => edge.id === selectedItem.value.id);
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
				defaultValue={selectedItem.value.color ?? ""}
				onInput={(e) => onInputChange(e, setEdges)}
				className='border rounded p-0'
			/>
		</div>
	);
};

export default EdgeControlPanel;
