// create server connection
const Game = require('./game.js').HigherOrder
let app = require('express')()
let http = require('http').Server(app)
let io = require('socket.io')(http)
let port = process.env.PORT || 3001

app.get('/', function(req, res){
    res.sendFile(__dirname + '/testClient.html')
})

io.on('connection', function(socket){
    let game = Game()
    socket.on('start', function(msg){
        game.start()
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
        let i = setInterval(function(){
            let gameState = game.getState()
            socket.emit('gameState', gameState)
            if(gameState.playerLives <= 0) clearInterval(i)
        }, 20)
    })
})

http.listen(port, function(){
    console.log('listening on *:' + port)
})
