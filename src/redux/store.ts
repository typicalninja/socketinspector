import { configureStore } from '@reduxjs/toolkit';
import Sender from './sender';
import Connector from './connector'
import Receiver from './receiver';

export const store = configureStore({
	reducer: {
		sender: Sender,
		connector: Connector,
		receiver: Receiver
	},
});
  
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch