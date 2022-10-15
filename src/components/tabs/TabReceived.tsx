import { styled } from "@stitches/react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearReceivedEvents, selectReceiverEvents } from "../../redux/receiver";
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { useState } from "react";
import { blackA, red } from '@radix-ui/colors';


const Table = styled('table', {
	border: '2px solid rgb(200,200,200)',
	borderCollapse: 'collapse',
	letterSpacing: '1px',
	fontsize: '0.8rem',
	width: '100%',
	maxWidth: '100%'
});

const Td = styled('td', {
	border: '1px solid rgb(190,190,190)',
 	padding: '10px 20px',
});

const Th = styled('th', {
	backgroundColor: 'rgb(235,235,235)',
	border: '1px solid rgb(190,190,190)',
	padding: '10px 20px',
})

const Tr = styled('tr', {
	'fontFamily': 'Inconsolata',
});

const Button = styled('button', {
	height: 35,
	cursor: 'pointer',
	padding: 10,
	fontSize: '13px',
	border: '0',
});

const Content = styled(AlertDialogPrimitive.Content, {
	backgroundColor: 'white',
	borderRadius: 6,
	boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
	position: 'fixed',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '90vw',
	maxWidth: '500px',
	maxHeight: '85vh',
	'fontFamily': 'Inconsolata',
	padding: 25,
	userSelect: 'none',
 });

const Overlay = styled(AlertDialogPrimitive.Overlay, {
	backgroundColor: blackA.blackA9,
	position: 'fixed',
	inset: 0
});

const Flex = styled('div', { display: 'flex' })

export default function TabReceived() {
	const receivedEvents = useAppSelector(selectReceiverEvents);
	const dispatch = useAppDispatch()
	const [inspectPayload, setInspectPayload] = useState<null | string>(null)
	const inspect = (data: string) => {
		return () => setInspectPayload(data);
	}
	return (
		<div>
			<Table>
				<thead>
				<Tr>
					<Th scope="col">Received On</Th>
					<Th scope="col">Id</Th>
					<Th scope="col">Actions</Th>
					<Th scope="col"><Button onClick={() => dispatch(clearReceivedEvents())} css={{ backgroundColor: red.red7, '&:hover': { backgroundColor: red.red9 } }}>Clear Logs</Button></Th>
				</Tr>
				</thead>
				<tbody>
					{
						receivedEvents.map((event) => {
							return (
								<Tr key={event.id}>
									<Td>{event.date}</Td>
									<Td>{event.id}</Td>
									<Td css={{ display: 'flex', gap: '1' }}>
										<Button onClick={inspect(event.data)} css={{ margin: '7px' }}>
											View Payload
										</Button>
									</Td>
								</Tr>
							)
						})
					}
				</tbody>
			</Table>
			<AlertDialogPrimitive.Root open={inspectPayload === null ? false : true}>
				<AlertDialogPrimitive.Portal>
					<Overlay />
						<Content>
							<AlertDialogPrimitive.Title >Packet Inspect</AlertDialogPrimitive.Title>
							<AlertDialogPrimitive.Description>
								{inspectPayload}
							</AlertDialogPrimitive.Description>
							<Flex css={{ marginTop: 25, justifyContent: 'flex-end' }}>
								<Button onClick={() => setInspectPayload(null)}>Close</Button>
							</Flex>
						</Content>
				</AlertDialogPrimitive.Portal>
			</AlertDialogPrimitive.Root>
		</div>
	)
}