import { useState, useCallback } from "react";
import {
	ReactFlow,
	applyNodeChanges,
	// applyEdgeChanges,
	addEdge,
	Background,
	BackgroundVariant,
	Controls,
	MarkerType,
	useNodesState,
	useEdgesState,
	useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ResizableNode from "./components/ResizableNode";
import GroupNode from "./components/GroupNode";
import AddElementModal from "./components/AddElementModal";
import { useBeforeRender } from "./components/UseBeforeRender";
import EdgeControlPanel from "./components/EdgeControlPanel";
import NodeControlPanel from "./components/NodeControlPanel";

const initialNodes = [
	{ id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
	{ id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
];
const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];

const nodeTypes = {
	default: ResizableNode,
	input: ResizableNode,
	output: ResizableNode,
	group: GroupNode,
};

const modalTypes = {
	addNode: {
		inputs: [
			{ label: "Node Name", type: "text", name: "title" },
			{ label: "Node Position X", type: "number", name: "positionX", defaultValue: 0 },
			{ label: "Node Position Y", type: "number", name: "positionY", defaultValue: 0 },
			{ label: "Node Color", type: "color", name: "nodeColor", defaultValue: "#ffffff" },
			{
				label: "Node Type",
				type: "select",
				name: "nodeType",
				options: [...Object.keys(nodeTypes)],
				defaultValue: "default",
			},
		],
	},
};

export default function App() {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [modalContent, setModalContent] = useState(null);
	const [rfInstance, setRfInstance] = useState(null);
	const [selectedItem, setSelectedItem] = useState();
	const { setViewport } = useReactFlow();

	useBeforeRender(() => {
		window.addEventListener("error", (e) => {
			if (e) {
				const resizeObserverErrDiv = document.getElementById(
					"webpack-dev-server-client-overlay-div"
				);
				const resizeObserverErr = document.getElementById(
					"webpack-dev-server-client-overlay"
				);
				if (resizeObserverErr)
					resizeObserverErr.className = "hide-resize-observer";
				if (resizeObserverErrDiv)
					resizeObserverErrDiv.className = "hide-resize-observer";
			}
		});
	}, []);

	const onConnect = useCallback(
		(params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
		[setEdges]
	);

	const addNode = useCallback((nodeData) => {
		var formData = new FormData(nodeData.target);
		// output as an object
		const positionX = parseFloat(formData.get("positionX")) || 0;
		const positionY = parseFloat(formData.get("positionY")) || 0;
		const nodeColor = formData.get("nodeColor") || "#ffffff";
		const nodeType = formData.get("nodeType") || "default";
		const nodeLabel = formData.get("title") || "New Node";
		setModalContent(null);
		setNodes((nds) => [
			...nds,
			{
				id: `${new Date().getTime()}`,
				position: { x: positionX, y: positionY },
				data: { label: nodeLabel, color: nodeColor },
				type: nodeType,
			},
		]);
	}, [setNodes]);

	const onInputChange = useCallback(
		(event, setter) => {
			const { name, value } = event.target;
			var displayValue = value;
			const additionalValues = {};
			const currentEdge = edges.find((n) => n.id === selectedItem.value.id);
			if (name.includes("marker")) {
				displayValue = event.target.checked
					? {
							type: MarkerType.ArrowClosed,
							width: 20,
							height: 20,
							color: currentEdge?.style?.stroke || "#b1b1b7",
					  }
					: undefined;
			}

			if (name === "style.stroke") {
				if (currentEdge?.markerEnd) {
					additionalValues.markerEnd = {
						...currentEdge.markerEnd,
						color: value,
					};
				}
				if (currentEdge?.markerStart) {
					additionalValues.markerStart = {
						...currentEdge.markerStart,
						color: value,
					};
				}
			}

			// handling nested names/values
			const keys = name.split(".");
			setter((prev) =>
				prev.map((item) => {
					if (item.id !== selectedItem.value.id) return item;
					let updated = { ...item };
					let obj = updated;
					for (let i = 0; i < keys.length - 1; i++) {
						obj[keys[i]] = { ...obj[keys[i]] };
						obj = obj[keys[i]];
					}
					obj[keys[keys.length - 1]] = displayValue;
					if (Object.keys(additionalValues).length > 0) {
						updated = { ...updated, ...additionalValues };
					}
					return updated;
				})
			);
		},
		[selectedItem, edges]
	);

	const onNodeDragStop = useCallback((_, node) => {
		// Handle node drag stop
		// Check if dragged node is not a group and is dropped inside a group node
		const padding = 4;
		const bottomMargin = 6;
		const labelWidth = 100;
		if (node.type !== "group") {
			const draggedNode = node;
			const groupNodes = nodes.filter((n) => n.type === "group");
			for (const group of groupNodes) {
				const groupX = group.position.x;
				const groupY = group.position.y;
				const groupWidth = 150;
				const groupHeight = 50;

				// Check if center of dragged node is inside group bounds
				const nodeCenterX = draggedNode.position.x + (draggedNode?.measured?.width || 100) / 2;
				const nodeCenterY = draggedNode.position.y + (draggedNode?.measured?.height || 47) / 2;
				if (
					nodeCenterX >= groupX &&
					nodeCenterX <= groupX + group?.measured?.width &&
					nodeCenterY >= groupY &&
					nodeCenterY <= groupY + group?.measured?.height
				) {
					// Expand group to fit the node and center the node inside
					// Find all nodes (except group) whose center is inside the group bounds
					const childNodes = nodes.filter(
						(n) =>
							n.group === group.id
					);

					// Add the dragged node if not already included
					const allNodesInGroup = childNodes.some((n) => n.id === draggedNode.id)
						? childNodes
						: [...childNodes, { ...draggedNode, group: group.id }];

					// Calculate total width and max height for flex layout
					const nodeWidths = allNodesInGroup.map((n) => n?.measured?.width || 100);
					const nodeHeights = allNodesInGroup.map((n) => n?.measured?.height || 47);
					const totalWidth = nodeWidths.reduce((a, b) => a + b, 0) + padding * (allNodesInGroup.length + 1) + labelWidth;
					const maxHeight = Math.max(...nodeHeights) + padding * 2 + bottomMargin;

					const newWidth = Math.max(groupWidth, totalWidth);
					const newHeight = Math.max(groupHeight, maxHeight);

					// Arrange nodes side by side inside the group
					let currentX = groupX + padding + labelWidth;
					const arrangedNodes = allNodesInGroup.map((n, idx) => {
						const width = n?.measured?.width || 100;
						const height = n?.measured?.height || 47;
						const pos = {
							x: currentX,
							y: groupY - padding + (maxHeight - height) / 2,
						};
						currentX += width + padding;
						return {
							id: n.id,
							type: "position",
							position: pos,
						};
					});

					const customDimensionsChange = [
						{
							id: group.id,
							type: "dimensions",
							dimensions: { width: newWidth, height: newHeight },
							resizing: true,
							setAttributes: true,
						},
						...arrangedNodes,
					];
					setNodes((nds) => {
						const nodesWithGroupId = nds.map((n) => arrangedNodes.find((a) => a.id === n.id) ? { ...n, group: group.id } : n);
						return applyNodeChanges(customDimensionsChange, nodesWithGroupId);
					});
					break;
				} else if (group.id === draggedNode.group) {
					const groupNodes = nodes.filter((n) => n.type !== "group" && n.group === group.id && n.id !== draggedNode.id);
					const nodeWidths = groupNodes.map((n) => n?.measured?.width || 100);
					const nodeHeights = groupNodes.map((n) => n?.measured?.height || 47);
					const totalWidth = nodeWidths.reduce((a, b) => a + b, 0) + padding * (groupNodes.length + 1) + labelWidth;
					const maxHeight = Math.max(...nodeHeights) + padding * 2 + 8;

					const newWidth = Math.max(groupWidth, totalWidth);
					const newHeight = Math.max(groupHeight, maxHeight);

					let currentX = groupX + padding + labelWidth;
					const arrangedNodes = groupNodes.map((n) => {
						const width = n?.measured?.width || 100;
						const height = n?.measured?.height || 47;
						const pos = {
							x: currentX,
							y: groupY - padding + (maxHeight - height) / 2,
						};
						currentX += width + padding;
						return {
							id: n.id,
							type: "position",
							position: pos,
						};
					});

					const customDimensionsChange = [
						{
							id: group.id,
							type: "dimensions",
							dimensions: { width: newWidth, height: newHeight },
							resizing: true,
							setAttributes: true,
						},
						...arrangedNodes,
					];
					setNodes((nds) => {
						const nodesWithGroupId = nds.map((n) => {
							if (n.id === draggedNode.id) {
								// Remove group flag from draggedNode
								const { group, ...rest } = n;
								return rest;
							}
							return arrangedNodes.find((a) => a.id === n.id) ? { ...n, group: group.id } : n;
						});
						// for dimension change, applyNodechanges is needed
						// for position change, we can just map the nodes
						return applyNodeChanges(customDimensionsChange, nodesWithGroupId);
					});
				}
			}
		} else {
			// if the group node is dragged, we update the child nodes' positions
			const draggedGroup = node;
			const groupNodes = nodes.filter((n) => n.group === draggedGroup.id);
			// const maxHeight = Math.max(...nodeHeights) + padding * 2 + bottomMargin;
			let currentX = draggedGroup.position.x + padding + labelWidth;
			const arrangedNodes = groupNodes.map((n) => {
				const width = n?.measured?.width || 100;
				const height = n?.measured?.height || 47;
				const pos = {
					x: currentX,
					y: draggedGroup.position.y - padding + (draggedGroup.measured.height - height) / 2,
				};
				currentX += width + padding;
				return {
					id: n.id,
					type: "position",
					position: pos,
				};
			});

			setNodes((nds) =>
				nds.map((n) => {
					const arrangedNode = arrangedNodes.find((a) => a.id === n.id);
					if (arrangedNode) {
						return { ...n, position: arrangedNode.position };
					} else {
						return n;
					}
				})
			);
		}
	}, [nodes, setNodes]);

	const onSave = useCallback(() => {
		if (rfInstance) {
		const flow = rfInstance.toObject();
		localStorage.setItem("felgo-diagram", JSON.stringify(flow));
		}
	}, [rfInstance]);
	
	const onRestore = useCallback(() => {
		const restoreFlow = async () => {
		const flow = JSON.parse(localStorage.getItem("felgo-diagram"));
	
		if (flow) {
			const { x = 0, y = 0, zoom = 1 } = flow.viewport;
			setNodes(flow.nodes || []);
			setEdges(flow.edges || []);
			setViewport({ x, y, zoom });
		}
		};
	
		restoreFlow();
	}, [setNodes, setViewport, setEdges]);

	return (
		<div
			className='h-screen w-screen'
			onClick={(e) => {
				// Deselect item when clicking outside controls
				if (!e.target.closest("#controls")) {
					setSelectedItem(null);
				}
			}}
		>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onNodeClick={(event, node) => {
					// resets inputs, otherwise the defaultValue will not be updated
					event.stopPropagation();
					if (selectedItem) setSelectedItem(null);
					setTimeout(() => setSelectedItem({ type: "node", value: node }), selectedItem ? 100: 0);
				}}
				onEdgeClick={(event, edge) => {
					event.stopPropagation();
					if (selectedItem) setSelectedItem(null);
					setTimeout(() => setSelectedItem({ type: "edge", value: edge }), selectedItem ? 100: 0);
				}}
				onNodeDragStop={onNodeDragStop}
				// onNodeDrag={onNodeDragStop}
				onConnect={onConnect}
				onInit={setRfInstance}
				fitView
			>
				<Background color='#ccc' variant={BackgroundVariant.Dots} />
				{/* Default control panel for zoom, locking and centering */}
				<Controls />
			</ReactFlow>
			{/* Control panel */}
			<div
				id='controls'
				className='fixed top-8 left-8 bg-white p-4 shadow-lg rounded-lg'
			>
				<h2 className='text-lg font-bold'>Controls</h2>
				<button
					className='mt-2 bg-blue-500 text-white p-2 rounded'
					onClick={() => setModalContent(modalTypes.addNode)}
				>
					Add
				</button>
				<button className="mt-2 bg-green-500 text-white p-2 rounded ml-2" onClick={onSave}>
					Save
				</button>
				<button className="mt-2 bg-green-500 text-white p-2 rounded ml-2" onClick={onRestore}>
					Restore
				</button>
				{selectedItem && (
					<button
						className='mt-2 bg-red-500 text-white p-2 rounded ml-2'
						onClick={() =>
							selectedItem.type === "node"
								? setNodes((nds) => {
										nds = nds.filter((n) => n.id !== selectedItem.value.id);
										setSelectedItem(null);
										return nds;
								  })
								: setEdges((eds) => {
										eds = eds.filter((e) => e.id !== selectedItem.value.id);
										setSelectedItem(null);
										return eds;
								  })
						}
					>
						Delete
					</button>
				)}
				{selectedItem && selectedItem.type === "edge" && (
					<EdgeControlPanel selectedItem={selectedItem} onInputChange={onInputChange} setEdges={setEdges} edges={edges} />
				)}
				{selectedItem && selectedItem.type === "node" && (
					<NodeControlPanel selectedItem={selectedItem} onInputChange={onInputChange} setNodes={setNodes} nodes={nodes} modalTypes={modalTypes} />
				)}
			</div>
			{/* Modal for adding elements */}
			<AddElementModal
				setModalContent={setModalContent}
				modalContent={modalContent}
				addNode={addNode}
			/>
		</div>
	);
}
