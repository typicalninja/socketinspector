import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './store';
import { nanoid } from 'nanoid';


interface ReceiverState {
	ReceivedEvents: { date: string, data: string, id: string }[];
}

const initialState: ReceiverState = {
	ReceivedEvents: [],
}

export const SenderSlice = createSlice({
	name: 'receiver',
	initialState,
	reducers: {
		addReceive: (state, action) => {
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
			state.ReceivedEvents.push({
				date:  format.format(Date.now()),
				data: action.payload,
				id: nanoid()
			});
			if(state.ReceivedEvents.length >= 10) state.ReceivedEvents.pop()
		},
		removeReceivedEvent: (state, action) => {
			state.ReceivedEvents = state.ReceivedEvents.filter((items) => items.id !== action.payload)
		},
		clearReceivedEvents: (state) => {
			state.ReceivedEvents = []
		},
	}
})

export const { addReceive, removeReceivedEvent, clearReceivedEvents } = SenderSlice.actions;
export const selectReceiverEvents = (state: RootState) => state.receiver.ReceivedEvents;

// expose the reducer
export default SenderSlice.reducer;