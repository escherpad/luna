"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Store_1 = require("./Store");
function createStore(reducer, initialState) {
    return function () {
        return new Store_1.Store(reducer, initialState);
    };
}
exports.createStore = createStore;
