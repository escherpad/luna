var Store_1 = require("./Store");
function createStore(reducer, initialState) {
    return new Store_1.Store(reducer, initialState);
}
exports.createStore = createStore;
