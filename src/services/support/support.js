let Support = function () {
    let thng_ids = [];
    let location_ids = [];
    let user_id = [];
    let listeners = [];

    let onSupportChange = (fn) => {
        listeners.push(fn);
    };

    let updateSupport = (uid, lid) => {
        user_id = uid;
        location_ids = lid;
    };

    let updateThngs = (tid) => {

        thng_ids = tid;
    }

    let getUser = () => {
        return user_id;
    };

    let getThngs = () => {
        return thng_ids;
    };

    let getLocations = () => {
        return location_ids;
    };

    return { onSupportChange, updateSupport, updateThngs, getUser, getThngs, getLocations };
};

export default Support;
