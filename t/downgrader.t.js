require('proof')(3, require('cadence')(prove))

function prove (async, assert) {
    var http = require('http')
    var delta = require('delta')

    var Upgrader = require('../downgrader')

    var upgrader = new Upgrader
    upgrader.upgrade({ headers: {} })

    var sockets = []

    upgrader.on('socket', function (request, socket) {
        sockets.push(socket)
        socket.on('data', function (buffer) {
            socket.write(buffer)
        })
    })

    var server = http.createServer(function (request, response) { throw new Error })
    server.on('upgrade', function (request, socket, head) {
        assert(head.length, 0, 'head is zero')
        assert(request.headers, {
            connection: 'Upgrade',
            upgrade: 'Conduit',
            host: '127.0.0.1:8088',
            'sec-conduit-protocol-id': 'c2845f0d55220303d62fc68e4c145877',
            'sec-conduit-version': '1'
        }, 'request')
        upgrader.upgrade(request, socket, head)
    })

    async(function () {
        server.listen(8088, async())
    }, function () {
        var request = http.request({
            host: '127.0.0.1',
            port: 8088,
            headers: Upgrader.headers({
                host: '127.0.0.1:8088'
            })
        })
        delta(async()).ee(request).on('upgrade')
        request.end()
    }, function (request, socket, head) {
        socket.write('hello')
        async(function () {
            delta(async()).ee(socket).on('data')
        }, function (data) {
            assert(data.toString(), 'hello', 'echo')
            socket.end(async())
            socket.destroy()
        })
    }, function () {
        sockets.forEach(function (socket) { socket.end(async()) })
        server.close(async())
    })
}
