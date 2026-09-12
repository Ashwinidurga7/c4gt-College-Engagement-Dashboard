// Simple SSE mock server for local testing
const http = require('http')
const url = require('url')

const PORT = process.env.PORT || 4000

const clients = new Set()

function sendEvent(data){
  const payload = `data: ${JSON.stringify(data)}\n\n`
  for(const res of clients){
    try{ res.write(payload) }catch(e){/* ignore */}
  }
}

function randomActivity(){
  const categories = ['C4GT Hub','GCC','Toust Masters','Internships']
  const actions = ['created a post','applied for','completed module','earned badge','joined']
  const category = categories[Math.floor(Math.random()*categories.length)]
  const title = `${category} — ${actions[Math.floor(Math.random()*actions.length)]}`
  return {
    id: `evt_${Date.now()}_${Math.floor(Math.random()*9999)}`,
    category,
    title,
    user: ['Alice','Bob','Carla','Dev'][Math.floor(Math.random()*4)],
    time: new Date().toISOString(),
  }
}

const server = http.createServer((req,res)=>{
  const parsed = url.parse(req.url,true)
  if(parsed.pathname === '/events'){
    // SSE handshake
    res.writeHead(200,{
      'Content-Type':'text/event-stream',
      'Cache-Control':'no-cache',
      'Connection':'keep-alive',
      'Access-Control-Allow-Origin':'*'
    })
    res.write('\n')
    clients.add(res)
    req.on('close', ()=>{ clients.delete(res) })
    return
  }

  if(parsed.pathname === '/emit' && req.method === 'POST'){
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', ()=>{
      try{
        const data = JSON.parse(body)
        // broadcast to clients
        sendEvent(data)
        res.writeHead(200,{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'})
        res.end(JSON.stringify({ok:true}))
      }catch(e){ res.writeHead(400); res.end('invalid') }
    })
    return
  }

  // basic info route
  if(parsed.pathname === '/'){
    res.writeHead(200,{'Content-Type':'text/plain','Access-Control-Allow-Origin':'*'})
    res.end('Mock SSE server running')
    return
  }

  res.writeHead(404); res.end('Not found')
})

server.listen(PORT, ()=>{
  console.log(`Mock SSE server listening on http://localhost:${PORT}`)
  // broadcast random activity every 4 seconds
  setInterval(()=> sendEvent(randomActivity()), 4000)
})
