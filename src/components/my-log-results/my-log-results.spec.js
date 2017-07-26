import { MyLogResultsController } from './my-log-results';

describe('my-log-results component', () => {
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
        ctrl = new MyLogResultsController();
    });

    it('should have initial state', () => {
        expect(ctrl.title).to.equal('Info Passing Test');
        expect(ctrl.subscriptions).to.be.empty; // no subscriptions yet
    });

    describe('getIcon', () => {
        it('should return icon config', () => {
            let icon = ctrl.getIcon();
            let color = ctrl.getIconColor();

            expect(icon.iconUrl).to.include('pin-s');
            expect(icon.iconUrl).to.include(color);
            expect(icon.iconSize).to.eql([20, 50]);
        });
    });
});
