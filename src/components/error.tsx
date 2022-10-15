import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { red } from '@radix-ui/colors';
import { styled } from '@stitches/react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectUrl, setState } from '../redux/connector';
import { States } from '../constants';
import { tomatoA } from '@radix-ui/colors';

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
	backgroundColor: tomatoA.tomatoA7,
	position: 'fixed',
	inset: 0
});

const Flex = styled('div', { display: 'flex' })

const Button = styled('button', {
	height: 35,
	cursor: 'pointer',
	padding: 10,
	fontSize: '13px',
	border: '0',
});

export default function Error() {
	const url = useAppSelector(selectUrl);
	const dispatch = useAppDispatch()
	return (
		<AlertDialogPrimitive.Root open={true}>
		<AlertDialogPrimitive.Portal>
			<Overlay />
				<Content>
					<AlertDialogPrimitive.Title >Socket Inspector</AlertDialogPrimitive.Title>
					<AlertDialogPrimitive.Description>
						Error Connecting To <b style={{ 'fontFamily': 'assistant' }}>{url}</b>
					</AlertDialogPrimitive.Description>
					<Flex css={{ marginTop: 25, justifyContent: 'flex-end' }}>
						<Button css={{ backgroundColor: red.red9, '&:hover': { backgroundColor: red.red10 } }} onClick={() => dispatch(setState(States.idle))}>Back To Connect</Button>
					</Flex>
				</Content>
		</AlertDialogPrimitive.Portal>
	</AlertDialogPrimitive.Root>
	)
}