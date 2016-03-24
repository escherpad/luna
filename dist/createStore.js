"use strict";
const Store_1 = require("./Store");
function createStore(reducer, initialState) {
    return () => {
        return new Store_1.Store(reducer, initialState);
    };
}
exports.createStore = createStore;
