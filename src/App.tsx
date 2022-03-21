import React from 'react'
import { Button, Input } from '@vechaiui/react'
import { MdArrowForwardIos, MdWarning } from 'react-icons/md';
import { BiError, BiErrorAlt, BiTrash } from 'react-icons/bi'
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
  const [options, setOptions] = React.useState({
    useStringify: true,
    sendType: 'TEXT',
  });
  const [fields, setFields] = React.useState<{ name: string; data: any }[]>([])

  const log = (message: string | (() => JSX.Element), type: string = 'INFO') => {
    setLogs(logs => [...logs, { type, message, time: Date.now() }]);
  }

  const removeField = (name: string) => {
    setFields(fields => fields.filter((_, i) => _.name !== name));
  }

  const addField = (name: string, data: any = "") => {
    setFields(fields => [...fields, { name: name, data }]);
  }

  const setFieldData = (name: string, data: any) => {
    setFields(fields => fields.map((_, i) => _.name === name ? { ..._, data } : _));
  }

  function inspect(data: string) {
    return alert(data);
  }

  const handleConnect = () => {
    if(!socket && !connected) {
      setConnecting(true);
    log(() => <div>Connecting to <b className='cursor-pointer text-xs bg-gray-400 hover:bg-gray-500'>{websocketUrl}</b></div>, 'INFO');
    let ws: WebSocket;
    try {
     ws = new WebSocket(websocketUrl)
    }
    catch(err) {
      setConnecting(false);
      setConnected(false);
      setError(true);
      setSocket(null);
      log(() => <div className="flex items-center">Invalid URL (Cannot connect) : <a href="##" className='cursor-pointer text-sm bg-yellow-200 p-2 rounded-full mx-2 hover:bg-yellow-600 font-bold flex items-center' onClick={() => inspect(`Error: ${err}\nUrl: ${websocketUrl}`)}><FcInfo /> Click for more info</a></div>, 'ERROR');
      return;
    }
    setSocket(ws);

    ws.onerror = (e: Event) => {
      try { ws.close() } catch {}
      setError(true)
      setConnected(false)
      setSocket(null)
      setConnecting(false)
      log(() => <div className="flex items-center">Error: <a href="##" className='cursor-pointer text-sm bg-yellow-200 p-2 rounded-full mx-2 hover:bg-yellow-600 font-bold flex items-center' onClick={() => inspect(`Error: ${e}\nUrl: ${websocketUrl}`)}><FcInfo /> Click for more info</a></div>, 'ERROR');
     // log(() => <div>Error connecting to <b className='cursor-pointer text-sm bg-gray-400 hover:bg-gray-500'>{websocketUrl}</b></div>, 'ERROR');
     localStorage.removeItem('socket-inspector-url');
    };

    ws.onopen = () => {
      setConnecting(false);
      setConnected(true);
      log(() => <div>Connected to <b className='cursor-pointer text-sm bg-gray-400 hover:bg-gray-500'>{websocketUrl}</b></div>, 'INFO');
      localStorage.setItem('socket-inspector-url', websocketUrl);
    };

    ws.onclose = () => {
      setConnected(false);
      setConnecting(false);
      setSocket(null)
      log(() => <div>Disconnected from <b className='cursor-pointer text-sm bg-gray-400 hover:bg-gray-500'>{websocketUrl}</b></div>, 'INFO');
      localStorage.removeItem('socket-inspector-url');
    }

    ws.onmessage = (e:  MessageEvent) => {
        log(() => <div>Received <b className='cursor-pointer text-sm bg-gray-400 hover:bg-gray-500'>{e.data}</b></div>, 'INFO');
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
    if(!message || message === "") return log(() => <div>Message cannot be empty</div>, 'ERROR');
    if(socket) {
      const parsedMessage = options.useStringify ? JSON.stringify(message) : message;
      log(() => <div className="flex items-center">Sending Message (TEXT) : <a href="##" className='cursor-pointer text-sm bg-yellow-200 p-2 rounded-full mx-2 hover:bg-yellow-600 font-bold flex items-center' onClick={() => inspect(`Raw: ${message}\nSent: ${parsedMessage}\nType: Text`)}><FcInfo /> Click for more info</a></div>, 'INFO');
      socket.send(parsedMessage);
    }
  }

  const sendJsonMessage = () => {
    // uses fields
    if(!fields || fields.length === 0) return log(() => <div>No fields to send</div>, 'ERROR');
    if(socket) {
      // first generate a object from fields
      // name will be the key and data the value
      const obj: any = {};
      fields.forEach(field => {
        obj[field.name] = field.data;
      });
      const parsedMessage = JSON.stringify(obj);
      log(() => <div className="flex items-center">Sending Message (JSON): <a href="##" className='cursor-pointer text-sm bg-yellow-200 p-2 rounded-full mx-2 hover:bg-yellow-600 font-bold flex items-center' onClick={() => inspect(`Raw: ${obj}\nSent: ${parsedMessage}\nType: Json`)}><FcInfo /> Click for more info</a></div>, 'INFO');
      socket.send(parsedMessage);
    }
  }



  return (
    <div className='flex flex-wrap'>
      <div className="mt-2 flex w-full mx-3">
        <Input className="bg-gray-500 font-bold disabled:bg-gray-600" disabled={connected} type="text" value={websocketUrl} placeholder={"Websocket connection url"} onChange={(e) => setSocketUrl(e.target.value)} />
        <Button loading={connecting} className={`p-3 cursor-pointer ${error ? 'hover:bg-red-400' : connected ? 'hover:bg-red-400' : 'hover:bg-emerald-400'}`} onClick={error ? handleReset : connected ? handleReset : handleConnect}>{error ? (<a href="##" className="flex items-center"><BiError className="text-red-500" /> Cannot Connect</a>) : connected ? (<a href="##" className="flex items-center"><VscDebugDisconnect className='text-gold-500' /> Disconnect</a>) :  (<a href="##" className="flex items-center"><MdArrowForwardIos /> connect</a>)}</Button>
      </div>
      <div className="mt-2 flex w-full mx-3">
         {
           options.sendType === 'TEXT' ? (
           <div className="flex w-full mx-3">
              <Input className="font-bold disabled:bg-gray-600" disabled={!connected} type="text" placeholder={"Send Data"} onChange={(e) => setData(e.target.value)} />
              <Button className="p-3 cursor-pointer hover:bg-blue-400" onClick={() => sendMessage(data)} disabled={!connected}><b className="flex items-center"><FiSend /> Send Data</b></Button>
           </div>
           ) :
           (
            <div className="w-full mx-3">
              <div>
                {fields.map((field, index) => (
                  <div className="flex w-full mx-3" key={index}>
                    <Input className="font-bold disabled:bg-gray-600" disabled={!connected} type="text" value={field.name} placeholder={"key"} />
                    <Input className="font-bold disabled:bg-gray-600" disabled={!connected} type="text" placeholder={"Data"} onChange={(e) => setFieldData(field.name, e.target.value)} />
                    <Button className="p-3 cursor-pointer hover:bg-red-600" onClick={() => removeField(field.name)} disabled={!connected}><b className="flex items-center"><BiTrash /> Delete Field</b></Button>
                  </div>
                )
                )}
              </div>
              <div className="mx-2 flex mt-3">
                <Button className="cursor-pointer p-3 hover:bg-sky-400" onClick={sendJsonMessage}>Send Json</Button>
                <Button className="cursor-pointer p-3 hover:bg-purple-400" onClick={() => {
                  const fieldName = prompt('Enter field name');
                  if(!fieldName) return alert('Field name cannot be empty');
                  addField(fieldName);
                }} >Add Field</Button>
              </div>
            </div>
           )
         }
      </div>
      <div className="mt-2 flex w-full mx-3">
          <div className="flex flex-wrap">
            <div className="w-full">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-name">
                Options
              </label>
              <div className="flex">
                <div className="relative">
                  <select disabled={options.sendType === 'JSON'} className="block appearance-none w-full bg-yellow-200 border border-gray-500 text-black py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-yellow-400 focus:border-yellow-500" id="grid-name" onChange={(e) => setOptions({ ...options, useStringify: e.target.value === 'true' })}>
                    <option value="false">Don't use JSON.stringify</option>
                    <option value="true">Use JSON.stringify</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
                <div className="relative mx-3">
                  <select className="block appearance-none w-full bg-yellow-200 border border-gray-500 text-black py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-yellow-400 focus:border-yellow-500" id="grid-name" onChange={(e) => setOptions({ ...options, sendType: e.target.value })}>
                    <option value="TEXT">Text Send</option>
                    <option value="JSON">Json Send</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
      <div className="mt-2 flex w-full mx-3">
          <div className="table w-full">
            <div className="table-header-group">
              <div className="table-row bg-cyan-300 text-black font-semibold">
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
                    <div className="table-row hover:bg-gray-600 bg-gray-400 font-bold p-3" key={index}>
                      <div className="flex text-left items-center p-3">{log.type === "INFO" ? <FcInfo /> : log.type === "ERROR" ? <BiErrorAlt className="text-red-500" /> : <MdWarning />}&nbsp;&nbsp;{log.type}</div>
                      <div className="table-cell text-left p-3">{new Date(log.time).toLocaleString()}</div>
                      <div className="table-cell text-left p-3">{typeof log.message == 'function' ? log.message() : log.message}</div>
                      <div className="table-cell text-left p-3"></div>
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
