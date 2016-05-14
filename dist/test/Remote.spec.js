'use strict';

var _index = require('../lib/index');

var _child_process = require('child_process');

var _chai = require('chai');

describe('Remote', function () {
    var child;
    var client = (0, _index.Client)('http://localhost:9000');

    before(function () {
        child = (0, _child_process.fork)('dist/test/server.js');
    });

    it('should roundtrip message updates', function (done) {
        var expected = { user: 'anon', text: 'Hi!' };

        var unsubscribe = client('/lobby/*').subscribe(function (key, message) {
            (0, _chai.expect)(key).to.equal('/lobby/0');
            (0, _chai.expect)(message).to.eql(expected);

            unsubscribe();
            done();
        });

        client('/lobby').push(expected);
    });

    it('should roundtrip more message updates', function (done) {
        var expected = { user: 'anon', text: 'Hi!' };

        client('/lobby/*').subscribe(function (key, message) {
            (0, _chai.expect)(key).to.equal('/lobby/1');
            (0, _chai.expect)(message).to.eql(expected);

            done();
        });

        client('/lobby').push(expected);
    });

    after(function () {
        child.kill();
    });
});