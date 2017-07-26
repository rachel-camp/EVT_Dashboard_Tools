import SupportService from './support';

describe('Support service', () => {
    let Support;

    const val = 'foobar';

    beforeEach(() => {
        Support = new SupportService();
    });

    const cb = sinon.spy(),
        ccb = sinon.spy(),
        filter = {
            id: 'thng1'
        };

    describe('updateSupport', () => {
        it('should update support', function () {
            expect(Support.getUser()).to.be.undefined;
            expect(Support.getThngs()).to.be.undefined;
            expect(Support.getLocations()).to.be.undefined;
            Search.updateSearch(filter1, filter2, filter3);
            expect(Support.getUser()).to.equal(filter1);
            expect(Support.getUser()).to.equal(filter2);
            expect(Support.getUser()).to.equal(filter3);
        });

        it('should call all listeners with new info', () => {
            Search.onSupportChange(cb);
            Search.onSupportChange(ccb);
            Search.updateSearch(filter1, filter2, filter3);

            [cb, ccb].forEach(fn => {
                expect(fn).to.have.been.calledOnce;
                expect(fn).to.have.been.calledWith(filter);
            });
        });
    });

});
