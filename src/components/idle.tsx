import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import * as LabelPrimitive from '@radix-ui/react-label'
import { blackA, violet, teal } from '@radix-ui/colors';
import { styled } from '@stitches/react';;
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectUrl, setUrl } from '../redux/connector';

// font
import "@fontsource/inconsolata"; 
import 'react-toastify/dist/ReactToastify.css';

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

const Input = styled('input', {
	all: 'unset',
	width: 200,
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: 4,
	padding: '0 10px',
	height: 35,
	fontSize: 15,
	lineHeight: 1,
	color: 'black',
	backgroundColor: blackA.blackA4,
	boxShadow: `0 0 0 1px ${violet.violet9}`,
	'&:focus': { boxShadow: `0 0 0 2px ${violet.violet9}` },
});

const Flex = styled('div', { 
	display: 'flex',
	flexWrap: 'wrap', 
	gap: 15, 
	alignItems: 'center'
});

const Label = styled(LabelPrimitive.Root, {
	fontSize: 15,
	fontWeight: 500,
	color: 'black',
});

const Button = styled('button', {
	color: blackA.blackA9,
	height: 35,
	backgroundColor: teal.teal5,
	cursor: 'pointer',
	padding: 10,
	fontSize: '13px',
	border: '0',
	'&:hover': {
		backgroundColor: teal.teal7,
	},
});


const validProtocols = ['wss:', 'ws:'];

function toastError(msg: string) {
	return toast.error(msg, {
		closeOnClick: true,
		theme: "dark",
		autoClose: 2000,
		draggable: true,
	});
}

// Handles while idle
export default function Idle({ connect }: { connect: () => void }) { 
	const url = useAppSelector(selectUrl);
	const dispatch = useAppDispatch();


	const OnInput = (e: any) => {
		e.preventDefault();
		dispatch(setUrl(e.target.value))
	}

	const onConnect = (e: any) => {
		if(url === '') return toastError(`Please Enter A Url to Connect`);
		let UrlData;
		try {
			UrlData = new URL(url);
		}
		catch {
			return toastError(`Please Provide A Valid Url`)
		}
		// unsupported Protocol
		if(!validProtocols.includes(UrlData.protocol)) return toastError(`Protocol: "${UrlData.protocol.replace(":", "")}" Is Unsupported, use: ${validProtocols.map((p) => p.replace(":", "")).join(", ")}`)
		// all is well, connect
		return connect()
	}

	return (
	<AlertDialogPrimitive.Root open={true}>
		<AlertDialogPrimitive.Portal>
			<Overlay />
				<Content>
					<AlertDialogPrimitive.Title >Socket Inspector</AlertDialogPrimitive.Title>
					<AlertDialogPrimitive.Description>
						Input The Server Link to Begin <b>Inspecting</b>
					</AlertDialogPrimitive.Description>
					<Flex>
						<Label htmlFor="serverUrl" css={{ lineHeight: '35px' }}>Server Url :</Label>
						<Input onChange={OnInput} value={url} type="text" id="serverUrl" spellCheck="false" placeholder='wss://link.to.server:3000'></Input>
					</Flex>
					<Button onClick={onConnect}>Connect</Button>
				</Content>
		<ToastContainer />
		</AlertDialogPrimitive.Portal>
	</AlertDialogPrimitive.Root>
	)
}