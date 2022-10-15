import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';
import { States } from '../constants';

interface ConnectorState {
	url: string,
	state: keyof typeof States,
}

const initialState: ConnectorState = {
	url: '',
	state: 'idle',
}

export const ConnectorSlice = createSlice({
	name: 'connector',
	initialState,
	reducers: {
		setUrl: (state, action) => {
			state.url = action.payload;
		},
		setState: (state, action) => {
			state.state = action.payload
		}
	}
})

export const { setUrl, setState } = ConnectorSlice.actions
export const selectUrl = (state: RootState) => state.connector.url
export const selectState = (state: RootState) => state.connector.state;
// expose the reducer
export default ConnectorSlice.reducer;