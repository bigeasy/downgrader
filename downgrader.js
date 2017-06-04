var assert = require('assert')
var events = require('events')
var util = require('util')

function Upgrade () {
}
util.inherits(Upgrade, events.EventEmitter)

Upgrade.prototype.upgrade = function (request, socket, head) {
    if (request.headers['sec-conduit-protocol-id'] == 'c2845f0d55220303d62fc68e4c145877') {
        assert(head.length == 0, 'head buffer must be zero length')
        socket.write(
            'HTTP/1.1 101 Conduit Protocol Handshake\r\n' +
            'Connection: Upgrade\r\n' +
            'Upgrade: Conduit\r\n' +
            '\r\n'
        )
        this.emit('socket', request, socket)
    }
}

Upgrade.headers = function (headers) {
    headers = JSON.parse(JSON.stringify(headers))
    headers.connection = 'Upgrade'
    headers.upgrade = 'Conduit'
    headers['sec-conduit-protocol-id'] = 'c2845f0d55220303d62fc68e4c145877'
    headers['sec-conduit-version'] = '1'
    return headers
}

module.exports = Upgrade
