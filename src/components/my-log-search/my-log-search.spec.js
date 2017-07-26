import {MyLogSearchController} from './my-log-search';

describe('my-log-search component', () => {
  let evt, support, ctrl;

  const searchText = 'foobar',
    filter = {
      id: 'user1'
    };

  beforeEach(() => {
    evt = {
      operator: {
        user: sinon.stub().returns({
          read: sinon.stub().returns(Promise.resolve())
        })
      }
    };
    support = {
      updateLogging: sinon.spy()
    };
    ctrl = new MyLogSearchController(support, evt);
  });

  describe('search', function () {
    it('should return EVT.js read promise', function () {
      expect(ctrl.search().then).to.be.defined;
    });

    it('should search users by first name', function () {
      var filterStr = 'firstName=' + searchText + '*';
      ctrl.search(searchText);
      expect(evt.operator.users).to.have.been.calledWith();
      expect(evt.operator.users().read).to.have.been.calledWith({
        params: {
          filter: filterStr
        }
      });
    });
  });

  describe('updateSearch', function () {
    it('should store user in Search service', function () {
      ctrl.updateSearch(filter);
      expect(Logging.updateLogging).to.have.been.calledWith(filter);
    });
  });
});
