import express from 'express'
import socket from 'socket.io'
import http from 'http'

const PORT = 3010
const app = express()
app.use(express.json())
// app.use('/')
app.use(express.static(__dirname + './../public'))

const httpServer = http.createServer(app)
const io = socket(httpServer, {
    path: '/socket.io'
})

const clients: Array<any> = []

io.on('connection', (client: any) => {
    console.log(`Cliente conectado, id => ${client.id}`)
    clients.push(client)
    
    client.on('disconnect', () => {
        clients.splice(clients.indexOf(client), 1)
        console.log(`Cliente desconectado, id => ${client.id}`)
    })
})

app.get('/msg', (req, res) => {
    const msg = req.query.msg || ''

    // Emitindo mensagem para os clients... Tem que colocar no script do html
    for(const client of clients){
        client.emit('msg', msg)
    }

    res.json({
        ok: true
    })
})

httpServer.listen(PORT, () => {
    console.log(`Server iniciado na porta ${PORT}`)
})