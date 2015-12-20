var Store_1 = require("./../Store");
var createStore_1 = require("./../createStore");
// for angular2
require("reflect-metadata");
var core_1 = require("angular2/core");
function provideStore(reducer, initialState) {
    return [
        core_1.provide(Store_1.Store, { useFactory: createStore_1.createStore(reducer, initialState) })
    ];
}
exports.provideStore = provideStore;
