import {Client} from '../lib/index';
import {fork} from 'child_process';
import {expect} from 'chai';

describe('Remote', () => {
    var child;
    var client = Client('http://localhost:9000');

    before(() => {
        child = fork('dist/test/server.js');
    });

    it('should roundtrip message updates', done => {
        var expected = {user: 'anon', text: 'Hi!'};

        var unsubscribe = client('/lobby/*').subscribe((key, message) => {
            expect(key).to.equal('/lobby/0');
            expect(message).to.eql(expected);

            unsubscribe();
            done();
        });

        client('/lobby').push(expected);
    });

    it('should roundtrip more message updates', done => {
        var expected = {user: 'anon', text: 'Hi!'};

        client('/lobby/*').subscribe((key, message) => {
            expect(key).to.equal('/lobby/1');
            expect(message).to.eql(expected);

            done();
        });

        client('/lobby').push(expected);
    });

    after(() => {
        child.kill();
    });

});