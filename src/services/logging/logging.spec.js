import LoggingService from './logging';

describe('Logging service', () => {
    let Logging;

    const val = 'foobar';

    beforeEach(() => {
        Logging = new LoggingService();
    });

    const cb = sinon.spy(),
        ccb = sinon.spy(),
        filter = {
            id: 'thng1'
        };

    describe('updateLogging', () => {
        it('should update logging', function () {
            expect(Logging.getUser()).to.be.undefined;
            expect(Logging.getThngs()).to.be.undefined;
            expect(Logging.getLocations()).to.be.undefined;
            Search.updateSearch(filter1, filter2, filter3);
            expect(Logging.getUser()).to.equal(filter1);
            expect(Logging.getUser()).to.equal(filter2);
            expect(Logging.getUser()).to.equal(filter3);
        });

        it('should call all listeners with new info', () => {
            Search.onLoggingChange(cb);
            Search.onLoggingChange(ccb);
            Search.updateSearch(filter1, filter2, filter3);

            [cb, ccb].forEach(fn => {
                expect(fn).to.have.been.calledOnce;
                expect(fn).to.have.been.calledWith(filter);
            });
        });
    });

});
