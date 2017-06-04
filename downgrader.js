var assert = require('assert')
var events = require('events')
var util = require('util')

function Downgrader () {
}
util.inherits(Downgrader, events.EventEmitter)

Downgrader.prototype.upgrade = function (request, socket, head) {
    if (request.headers['sec-downgrader-protocol-id'] == 'c2845f0d55220303d62fc68e4c145877') {
        assert(head.length == 0, 'head buffer must be zero length')
        socket.write(
            'HTTP/1.1 101 Conduit Protocol Handshake\r\n' +
            'Connection: Upgrade\r\n' +
            'Upgrade: Downgrader\r\n' +
            '\r\n'
        )
        this.emit('socket', request, socket)
    }
}

Downgrader.headers = function (headers) {
    headers = JSON.parse(JSON.stringify(headers))
    headers.connection = 'Upgrade'
    headers.upgrade = 'Downgrader'
    headers['sec-downgrader-protocol-id'] = 'c2845f0d55220303d62fc68e4c145877'
    headers['sec-downgrader-version'] = '1'
    return headers
}

module.exports = Downgrader
