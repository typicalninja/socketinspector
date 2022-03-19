import React from 'react'
import { Button, Input } from '@vechaiui/react'
import { MdArrowForwardIos, MdWarning } from 'react-icons/md';
import { BiError, BiErrorAlt } from 'react-icons/bi'
import { VscDebugDisconnect } from 'react-icons/vsc'
import { FcInfo } from 'react-icons/fc';
import { FiSend } from 'react-icons/fi';
import { BsFillTrashFill } from 'react-icons/bs';

function App() { 
  const [websocketUrl, setSocketUrl] = React.useState(localStorage.getItem('socket-inspector-url') || ' ');
  const [connected, setConnected] = React.useState(false);
  const [connecting, setConnecting] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [socket, setSocket]: any = React.useState(null);
  const [logs, setLogs] = React.useState<{ type: string; message: string | (() => JSX.Element); time: number }[]>([{ type: 'INFO', message: 'Socket Inspector Started, Click connect to connect', time: Date.now() }]);
  const [data, setData] = React.useState('');

  const log = (message: string | (() => JSX.Element), type: string = 'INFO') => {
    setLogs(logs => [...logs, { type, message, time: Date.now() }]);
    //const newLogs = logs;
    //newLogs.push({ type: type, message, time: Date.now() });
   // setLogs(newLogs);
  }

  const handleConnect = () => {
    if(!socket && !connected) {
      setConnecting(true);
    log(() => <div>Connecting to <b className='cursor-pointer text-sm bg-gray-300 hover:bg-gray-500'>{websocketUrl}</b></div>, 'INFO');
    let ws: WebSocket;
    try {
     ws = new WebSocket(websocketUrl)
    }
    catch {
      setConnecting(false);
      setConnected(false);
      setError(true);
      setSocket(null);
      log(() => <div>Invalid URL (Cannot connect) : <b className='cursor-pointer text-sm bg-gray-300 hover:bg-gray-500'>{websocketUrl}</b></div>, 'ERROR');
      return;
    }
    setSocket(ws);

    ws.onerror = () => {
      try { ws.close() } catch {}
      setError(true)
      setConnected(false)
      setSocket(null)
      setConnecting(false)
      log(() => <div>Error connecting to <b className='cursor-pointer text-sm bg-gray-300 hover:bg-gray-500'>{websocketUrl}</b></div>, 'ERROR');
      localStorage.removeItem('socket-inspector-url');
    };

    ws.onopen = () => {
      setConnecting(false);
      setConnected(true);
      log(() => <div>Connected to <b className='cursor-pointer text-sm bg-gray-300 hover:bg-gray-500'>{websocketUrl}</b></div>, 'INFO');
      localStorage.setItem('socket-inspector-url', websocketUrl);
    };

    ws.onclose = () => {
      setConnected(false);
      setConnecting(false);
      setSocket(null)
      log(() => <div>Disconnected from <b className='cursor-pointer text-sm bg-gray-300 hover:bg-gray-500'>{websocketUrl}</b></div>, 'INFO');
      localStorage.removeItem('socket-inspector-url');
    }

    ws.onmessage = (e: MessageEvent) => {
        log(() => <div>Received <b className='cursor-pointer text-sm bg-gray-300 hover:bg-gray-500'>{e.data}</b></div>, 'INFO');
    }
    }
  }

  const handleReset = () => {
    if(socket) {
      socket.close();
    }
    setConnected(false);
    setConnecting(false);
    setError(false)
  }

  const sendMessage = (message: string) => {  
    if(socket) {
      log(() => <div>Sending <b className='cursor-pointer text-sm bg-gray-300 hover:bg-gray-500'>{message}</b></div>, 'INFO');
      socket.send(message);
    }
  }

  return (
    <div className='flex flex-wrap'>
      <div className="mt-2 flex w-full mx-3">
        <Input className="bg-gray-500 font-bold disabled:bg-gray-600" disabled={connected} type="text" value={websocketUrl} placeholder={"Websocket connection url"} onChange={(e) => setSocketUrl(e.target.value)} />
        <Button loading={connecting} className={`p-3 cursor-pointer ${error ? 'hover:bg-red-400' : connected ? 'hover:bg-red-400' : 'hover:bg-emerald-400'}`} onClick={error ? handleReset : connected ? handleReset : handleConnect}>{error ? (<a href="##" className="flex items-center"><BiError className="text-red-500" /> Cannot Connect</a>) : connected ? (<a href="##" className="flex items-center"><VscDebugDisconnect className='text-gold-500' /> Disconnect</a>) :  (<a href="##" className="flex items-center"><MdArrowForwardIos /> connect</a>)}</Button>
      </div>
      <div className="mt-2 flex w-full mx-3">
         <Input className="font-bold disabled:bg-gray-600" disabled={!connected} type="text" placeholder={"Send Data"} onChange={(e) => setData(e.target.value)} />
         <Button className="p-3 cursor-pointer hover:bg-blue-400" onClick={() => sendMessage(data)} disabled={!connected}><b className="flex items-center"><FiSend /> Send Data</b></Button>
      </div>
      <div className="mt-2 flex w-full mx-3">
          <div className="table w-full">
            <div className="table-header-group">
              <div className="table-row bg-black text-white">
                <div className="table-cell text-left"> Type</div>
                <div className="table-cell text-left">Time</div>
                <div className="table-cell text-left">Message</div>
                <div className="table-cell text-left">
                  <Button className="p-2 cursor-pointer hover:bg-red-400"  onClick={() => setLogs([])}>
                      <b className="flex items-center">
                        <BsFillTrashFill /> Clear Logs
                      </b>
                  </Button>
                </div>
              </div>
            </div>
            <div className="table-row-group">
              {
                logs.map((log, index) => {
                  return (
                    <div className="table-row" key={index}>
                      <div className="flex text-left items-center">{log.type === "INFO" ? <FcInfo /> : log.type === "ERROR" ? <BiErrorAlt className="text-red-500" /> : <MdWarning />} {log.type}</div>
                      <div className="table-cell text-left">{new Date(log.time).toLocaleString()}</div>
                      <div className="table-cell text-left">{typeof log.message == 'function' ? log.message() : log.message}</div>
                    </div>
                  )
                })
              }
            </div>
          </div>
      </div>
    </div>
  )
}

export default App
