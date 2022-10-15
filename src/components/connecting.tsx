import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { blackA } from '@radix-ui/colors';
import { styled } from '@stitches/react';;
// font
import "@fontsource/inconsolata"; 
import "@fontsource/assistant"; 
// redux
import { selectUrl } from '../redux/connector';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

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

const Button = styled('button', {
	color: blackA.blackA9,
	height: 35,
	cursor: 'pointer',
	padding: 10,
	fontSize: '13px',
	border: '0',
	'&:hover': {
	},
});

export default function Connecting() {
	const url = useAppSelector(selectUrl);
	return (
		<AlertDialogPrimitive.Root open={true}>
		<AlertDialogPrimitive.Portal>
			<Overlay />
				<Content>
					<AlertDialogPrimitive.Title >Socket Inspector</AlertDialogPrimitive.Title>
					<AlertDialogPrimitive.Description>
						Connecting To <b style={{ 'fontFamily': 'assistant' }}>{url}</b>
					</AlertDialogPrimitive.Description>
				</Content>
		</AlertDialogPrimitive.Portal>
	</AlertDialogPrimitive.Root>
	)
}