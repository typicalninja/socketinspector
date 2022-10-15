import { styled } from "@stitches/react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addSend, selectPayLoad, setPayLoad } from "../../redux/sender";
import * as LabelPrimitive from '@radix-ui/react-label'
import { blackA, violet } from "@radix-ui/colors";
import { ToastContainer, toast } from 'react-toastify';


const Label = styled(LabelPrimitive.Root, {
	fontSize: 15,
	fontWeight: 500,
	color: 'black',
});

const TextArea = styled('textarea', {
	all: 'unset',
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: 4,
	padding: '0 10px',
	fontSize: 15,
	lineHeight: 1,
	color: 'black',
	backgroundColor: blackA.blackA4,
	boxShadow: `0 0 0 1px ${violet.violet9}`,
	'&:focus': { boxShadow: `0 0 0 2px ${violet.violet9}` },
});


const Button = styled('button', {
	height: 35,
	cursor: 'pointer',
	padding: 10,
	fontSize: '13px',
	border: '0',
});


export default function TabSend({	ws	}: {	ws:WebSocket	}) {
	const payload = useAppSelector(selectPayLoad);
	const dispatch = useAppDispatch();
	const payloadChange = (e: any) => {
		dispatch(setPayLoad(e.target.value))
	}

	const sendPayload = () => {
		toast.success(() => 
		<p>Sent Payload: 
			<b>{payload}</b>
		</p>, {
			autoClose: 3000
		})
		ws.send(payload)
		dispatch(addSend(payload))
	}

	return (
		<div>
			<ToastContainer />
			<Label htmlFor="serverUrl" css={{ lineHeight: '35px' }}>Payload</Label>
			<TextArea id="payload" rows={10} cols={30} onChange={payloadChange} value={payload}></TextArea>
			<Button onClick={sendPayload}>Send</Button>
		</div>
	)
}