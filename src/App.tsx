import { useState } from 'react'
import { States } from './constants';

import {selectState, selectUrl, setState } from './redux/connector';
import { useAppDispatch, useAppSelector } from './redux/hooks';

// sub ui components
import Connecting from './components/connecting';
import Idle from './components/idle';
import Connected from './components/connected';
import Error from './components/error';

function App() {
  //const [state, setState] = useState(States.idle);
  const state = useAppSelector(selectState);
  const url = useAppSelector(selectUrl)
  const dispatch = useAppDispatch()
  let [client, setClient] = useState<null | WebSocket>(null);
  const connect = () => {
    // only work in idle
    if(state !== States.idle) return false;
    dispatch(setState(States.connecting))
    console.log(`Establishing Connection to: ${url}`)
    let socket = new WebSocket(url)
    setClient(socket);
    socket.onerror = (e) => {
      dispatch(setState(States.error))
      socket.onerror = null
      socket.onopen = null;
    }

    socket.onopen = () => {
      dispatch(setState(States.connected))
    }

    socket.onclose = () => {
      dispatch(setState(States.error))
    }
  }

  return (
   <div>
    {
      state === States.idle ? <Idle connect={connect} />
      : 
      state === States.connecting ? <Connecting  />
      : 
      state === States.connected && client ? <Connected ws={client} />
      :
      state === States.error ? <Error />
      :
       <a>A Error Occurred (Invalid State) try restarting?</a>
    }
   </div>
  );
}

export default App
