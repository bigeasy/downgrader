var delta = require('delta')
var cadence = require('cadence')
var assert = require('assert')
var coalesce = require('nascent.coalesce')

var PROTOCOL = {
    http: require('http'),
    https: require('https')
}

exports.connect = cadence(function (async, options) {
    var protocol = options.secure ? PROTOCOL.https : PROTOCOL.http
    options = {
        port: coalesce(options.port, options.secure ? 443 : 80),
        host: coalesce(options.host, 'localhost'),
        socketPath: options.socketPath,
        headers: JSON.parse(JSON.stringify(coalesce(options.headers, {})))
    }
    var headers = {
        connection: 'Upgrade',
        upgrade: 'Conduit',
        'sec-conduit-protocol-id': 'c2845f0d55220303d62fc68e4c145877',
        'sec-conduit-version': 1
    }
    for (var name in headers) {
        options.headers[name] = headers[name]
    }
    if (options.socketPath) {
        delete options.port
        delete options.host
        options.headers.host = options.host + ':' + options.port
    } else {
        delete options.socketPath
    }
    var request = protocol.request(options)
    request.on('response', assert.bind(null, false, 'should be no response'))
    async(function () {
        delta(async()).ee(request).on('upgrade')
        request.end()
    }, function (request, socket, head) {
        return [ request, socket, head ]
    })
})
