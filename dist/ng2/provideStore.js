var Store_1 = require("./../Store");
var createStore_1 = require("./../createStore");
// for angular2
require("reflect-metadata");
var core_d_1 = require("../../node_modules/angular2/core.d");
function provideStore(reducer, initialState) {
    return [
        core_d_1.provide(Store_1.Store, { useFactory: createStore_1.createStore(reducer, initialState) })
    ];
}
exports.provideStore = provideStore;
