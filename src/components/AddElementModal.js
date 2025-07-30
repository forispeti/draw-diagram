import { Dialog, Box, Typography, Tooltip } from "@mui/material";
const AddElementModal = ({ setModalContent, modalContent, addNode}) => {

return (<Dialog
				open={!!modalContent}
				className='outline-none'
				onClose={() => setModalContent(null)}
			>
				<Box sx={{ p: 3, minWidth: 320 }}>
					<Typography
						id='modal-modal-title'
						variant='h6'
						component='h2'
						sx={{ mb: 2 }}
					>
						Add Node
					</Typography>
					{modalContent?.inputs && (
						<form
							onSubmit={(e) => {
								e.preventDefault();
								addNode(e);
							}}
						>
							{modalContent.inputs.map((input) => {
								if (input.type === "select") {
									return (
										<Box key={input.name} sx={{ mb: 2 }}>
											<label style={{ display: "block", marginBottom: 4 }}>
												{input.label}
											</label>
											<Tooltip
												title={
													<div>
														<div>
															<b>default:</b> Regular node with input and output
														</div>
														<div>
															<b>input:</b> Only input connection
														</div>
														<div>
															<b>output:</b> Only output connection
														</div>
														<div>
															<b>group:</b> No connections
														</div>
														<div>
															<b>resizable:</b> Input and output, resizable
														</div>
													</div>
												}
												placement='right'
												arrow
											>
												<select
													name={input.name ?? ""}
													className='w-full border rounded p-2'
                                                    defaultValue={input.defaultValue ?? ""}
												>
													{input.options.map((opt) => (
														<option key={opt} value={opt}>
															{opt}
														</option>
													))}
												</select>
											</Tooltip>
										</Box>
									);
								}
								if (input.type === "color") {
									return (
										<Box key={input.name} sx={{ mb: 2 }}>
											<label style={{ display: "block", marginBottom: 4 }}>
												{input.label}
											</label>
											<input
												type='color'
												name={input.name ?? ""}
                                                defaultValue={input.defaultValue ?? "#ffffff"}
												// id={input.name}
												className='w-10 h-10 p-0 border-none'
											/>
										</Box>
									);
								}
								return (
									<Box key={input.name} sx={{ mb: 2 }}>
										<label style={{ display: "block", marginBottom: 4 }}>
											{input.label}
										</label>
										<input
											type={input.type}
											name={input.name ?? ""}
                                            defaultValue={input.defaultValue ?? ""}
											// id={input.name}
											className='w-full border rounded p-2'
										/>
									</Box>
								);
							})}
							<Box sx={{ mt: 3, display: "flex", gap: 2 }}>
								<button
									type='submit'
									className='bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600'
								>
									Add
								</button>
								<button
									type='button'
									className='bg-gray-300 px-4 py-2 rounded cursor-pointer'
									onClick={() => setModalContent(null)}
								>
									Cancel
								</button>
							</Box>
						</form>
					)}
				</Box>
			</Dialog>);
    }

    export default AddElementModal;