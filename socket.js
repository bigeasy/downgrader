var delta = require('delta')
var cadence = require('cadence')
var assert = require('assert')

exports.headers = function (headers) {
    headers = JSON.parse(JSON.stringify(headers))
    headers.connection = 'Upgrade'
    headers.upgrade = 'Conduit'
    headers['sec-conduit-protocol-id'] = 'c2845f0d55220303d62fc68e4c145877'
    headers['sec-conduit-version'] = '1'
    return headers
}

exports.upgrade = cadence(function (async, request) {
    request.on('response', assert.bind(null, false, 'should be no response'))
    async(function () {
        delta(async()).ee(request).on('upgrade')
        request.end()
    }, function (request, socket, head) {
        return [ request, socket, head ]
    })
})
