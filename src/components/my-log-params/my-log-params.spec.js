import { MyLogParamsController } from './my-log-params';

describe('my-log-params component', () => {
    let scope, evt, logging, ctrl;

    beforeEach(inject(($rootScope) => {
        scope = $rootScope.$new();
    }));

    beforeEach(() => {
        evt = {
            operator: {
                thng: sinon.stub().returns({
                    read: sinon.stub().returns({
                        then: (cb) => cb(thngs)
                    })
                })
            }
        };
        logging = {
            onLoggingChange: () => { }
        };
        ctrl = new MyLogParamsController();
    });

    it('should have initial state', () => {
        expect(ctrl.title).to.equal('Info Passing Test');
        expect(ctrl.subscriptions).to.be.empty; // no subscriptions yet
    });

    // ...
});
