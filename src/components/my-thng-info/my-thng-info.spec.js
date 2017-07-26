import { MyThngInfoController } from './my-thng-info';

describe('my-thng-info component', () => {
    let scope, evt, support, ctrl;

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
        support = {
            onSupportChange: () => { }
        };
        ctrl = new MyThngInfoController();
    });

    it('should have initial state', () => {
        expect(ctrl.title).to.equal('Info Passing Test');
        expect(ctrl.subscriptions).to.be.empty; // no subscriptions yet
    });

    // ...
});
