// create server connection
const Game = require('./game.js')
let app = require('express')()
let http = require('http').Server(app)
let io = require('socket.io')(http)
let port = process.env.PORT || 3000

app.get('/', function(req, res){
    res.sendFile(__dirname + '/testClient.html')
})

io.on('connection', function(socket){
    socket.on('start', function(msg){
        let game = new Game()
        socket.emit('gameState', game.getState())
        socket.on('turnLeft', function() {
            game.turnLeft()
            socket.emit('gameState', game.getState())
        })
        socket.on('turnRight', function() {
            game.turnRight()
            socket.emit('gameState', game.getState())
        })
        socket.on('shoot', function() {
            game.shoot()
            socket.emit('gameState', game.getState())
        })
        setInterval(function(){
            socket.emit('gameState', game.getState())
        }, 20)
    })
})

http.listen(port, function(){
    console.log('listening on *:' + port)
})
