import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './store';
import { nanoid } from 'nanoid'
import { States } from '../constants';

interface SenderState {
	events: { date: string, data: string, id: string }[];
	sendingPayload: string
}

const initialState: SenderState = {
	events: [],
	sendingPayload: ''
}

export const SenderSlice = createSlice({
	name: 'sender',
	initialState,
	reducers: {
		addSend: (state, action) => {
			const locale =  (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language;
			var format = new Intl.DateTimeFormat(
				locale,
				{
				  year: "numeric",
				  month: "numeric",
				  day: "numeric",
				  hour: "numeric",
				  minute: "numeric",
				}
			  )
			state.events.push({
				date: format.format(Date.now()),
				data: action.payload,
				id: nanoid()
			});
			if(state.events.length >= 10) state.events.pop()
		}, 
		removeEvent: (state, action) => {
			state.events = state.events.filter((items) => items.id !== action.payload)
		},
		clearEvents: (state) => {
			state.events = []
		},
		setPayLoad: (state, action) => {
			state.sendingPayload = action.payload;
		}
	}
})

export const { addSend, removeEvent, clearEvents, setPayLoad } = SenderSlice.actions;
export const selectEvents = (state: RootState) => state.sender.events;
export const selectPayLoad = (state: RootState) => state.sender.sendingPayload;
// expose the reducer
export default SenderSlice.reducer;