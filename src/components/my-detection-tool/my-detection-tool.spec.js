import { MyDetectionToolController } from './my-detection-tool';

describe('my-detection-tool component', () => {
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
        ctrl = new MyDetectionToolController();
    });

    it('should have initial state', () => {
        expect(ctrl.title).to.equal('Info Passing Test');
        expect(ctrl.subscriptions).to.be.empty; // no subscriptions yet
    });

    // ...
});
