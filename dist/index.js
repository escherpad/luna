"use strict";
/** Created by ge on 12/4/15. */
var combineReducers_1 = require("./util/combineReducers");
exports.combineReducers = combineReducers_1.combineReducers;
exports.passOrCombineReducers = combineReducers_1.passOrCombineReducers;
var Store_1 = require("./Store");
exports.Store = Store_1.Store;
exports.INIT_STORE = Store_1.INIT_STORE;
exports.INIT_STORE_ACTION = Store_1.INIT_STORE_ACTION;
var createStore_1 = require("./createStore");
exports.createStore = createStore_1.createStore;
/*remove dependency on angular2*/
//export {provideStore} from "./ng2/provideStore";
//export {StoreService} from "./ng2/StoreService";
