let Logging = function () {
    let thngs = [];
    let thng_id = [];
    let props = [];
    let start_date;
    let end_date;
    let listeners = [];
    let params = [];

    let onLoggingChange = (fn) => {
        listeners.push(fn);
    };

    let updateLogParams = (tid, prp, sd, ed) => {
        params = [];
        params.push(tid);
        params.push(prp);
        params.push(sd);
        params.push(ed);
    };

    let updateThngs = (t) => {

        thngs = t;
    }

    let getThngs = () => {
        return thngs;
    };

    let getLogParams = () => {
        return params;
    };

    return { onLoggingChange, updateLogParams, updateThngs, getThngs, getLogParams };
};

export default Logging;
