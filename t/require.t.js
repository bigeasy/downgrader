require('proof/redux')(1, prove)

function prove (assert) {
    var Downgrader = require('..')
    assert(Downgrader, 'require')
}
