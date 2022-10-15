import * as ToolbarPrimitive from '@radix-ui/react-toolbar';
import { styled } from '@stitches/react';
import { violet, blackA, mauve, green, red, cyan, crimson, indigo, cyanA } from '@radix-ui/colors';
import { States, Tabs } from '../constants';
import { useEffect, useState } from 'react';
// redux
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectState, selectUrl, setState } from '../redux/connector';
import { ToastContainer, toast } from 'react-toastify';
// fonts
import "@fontsource/inconsolata"; 
// sub ui tabs
import TabSent from './tabs/TabSent';
import TabSend from './tabs/TabSend';
import { clearEvents, setPayLoad } from '../redux/sender';
import TabReceived from './tabs/TabReceived';
import { addReceive, clearReceivedEvents } from '../redux/receiver';


const Toolbar = styled(ToolbarPrimitive.Root, {
	display: 'flex',
	padding: 10,
	width: '100%',
	minWidth: 'max-content',
	borderRadius: 6,
	backgroundColor: 'white',
	boxShadow: `0 2px 10px ${blackA.blackA7}`,
});
  
  
const Separator = styled(ToolbarPrimitive.Separator, {
	width: 1,
	backgroundColor: mauve.mauve6,
	margin: '0 10px',
});
  

const Button = styled('button', {
	height: 35,
	cursor: 'pointer',
	padding: 10,
	fontSize: '13px',
	border: '0',
});

const Span = styled('span', {
	display: 'inline-flex',
	color: green.green9,
	fontSize: '20px',
	'&:hover': {
		color: green.green6,
		cursor: 'pointer'
	}
});

export default function Connected({ ws }: { ws: WebSocket }) {
	const url = useAppSelector(selectUrl);
	const state = useAppSelector(selectState);
	const dispatch = useAppDispatch();
	const [tab, setTab] = useState(Tabs.sent);

	// component should not render when not connected
	if(state !== States.connected) return null;

	const changeTab = (tab: string) => {
		return () => setTab(tab)
	}

	const disconnect_ = () => {
		ws.onclose = null;
		ws.close();
	}

	// disconnect clearing session data
	const disconnect_Cs = () => {
		dispatch(setPayLoad(''));
		dispatch(clearEvents());
		dispatch(clearReceivedEvents())
		disconnect_()
		dispatch(setState(States.idle))
	}
	// disconnect without clearing session data
	const disconnect_wCs = () => {
		disconnect_()
		dispatch(setState(States.idle))
	}

	const disconnect = () => {
			toast(() => 
			<div>
				<Button onClick={disconnect_wCs} css={{ margin: '7px', backgroundColor: cyan.cyan7, '&:hover': { backgroundColor: cyan.cyan9 } }}>Do Not Clear Session Data</Button>
				<Button onClick={disconnect_Cs} css={{ margin: '7px', backgroundColor: violet.violet7, '&:hover': { backgroundColor: violet.violet9 } }}>Clear Session Data</Button>
			</div>, {
				autoClose: false,
				toastId: 'disconnect_alert'
			})
	}

	const TabDisabled = (cTab: string) => cTab === tab

	useEffect(() => {
		ws.onmessage = (_) => {
			console.log(_.data)
			dispatch(addReceive(_.data))
		}

		return () => {
			ws.onmessage = null
		};
	}, [])

	return (
		<div>
				<ToastContainer />
				<Toolbar>
					<Button disabled={TabDisabled(Tabs.send)} onClick={changeTab(Tabs.send)} css={{ backgroundColor: violet.violet7, '&:hover': { backgroundColor: !TabDisabled(Tabs.send) ? violet.violet9 : '' } }}>Send</Button>
					<Separator />
					<Button disabled={TabDisabled(Tabs.sent)} onClick={changeTab(Tabs.sent)} css={{ backgroundColor: crimson.crimson7, '&:hover': { backgroundColor: !TabDisabled(Tabs.sent) ? crimson.crimson9 : '' } }}>Sent</Button>
					<Separator />
					<Button disabled={TabDisabled(Tabs.receive)} onClick={changeTab(Tabs.receive)} css={{ backgroundColor: indigo.indigo7, '&:hover': { backgroundColor: !TabDisabled(Tabs.receive) ? indigo.indigo9 : '' } }}>Receive/Received</Button>
					<Separator />
					<Button onClick={disconnect} css={{ backgroundColor: red.red7, '&:hover': { backgroundColor: red.red9 } }}>Disconnect</Button>
					<Separator />
					<Span><svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.81825 1.18188C7.64251 1.00615 7.35759 1.00615 7.18185 1.18188L4.18185 4.18188C4.00611 4.35762 4.00611 4.64254 4.18185 4.81828C4.35759 4.99401 4.64251 4.99401 4.81825 4.81828L7.05005 2.58648V9.49996C7.05005 9.74849 7.25152 9.94996 7.50005 9.94996C7.74858 9.94996 7.95005 9.74849 7.95005 9.49996V2.58648L10.1819 4.81828C10.3576 4.99401 10.6425 4.99401 10.8182 4.81828C10.994 4.64254 10.994 4.35762 10.8182 4.18188L7.81825 1.18188ZM2.5 9.99997C2.77614 9.99997 3 10.2238 3 10.5V12C3 12.5538 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2238 12.2239 9.99997 12.5 9.99997C12.7761 9.99997 13 10.2238 13 10.5V12C13 13.104 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2238 2.22386 9.99997 2.5 9.99997Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>{url}</Span>
				</Toolbar>
				<br />
				{
					tab === Tabs.sent ? <TabSent />
					: 
					tab === Tabs.send ? <TabSend ws={ws} />
					: 
					tab === Tabs.receive ? <TabReceived />
					: <p>A Error: Invalid Tab: {tab}</p>
				}
		</div>
	)
} 