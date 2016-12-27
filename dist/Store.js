"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/** Created by ge on 12/4/15. */
var rxjs_1 = require('rxjs');
var combineReducers_1 = require('./util/combineReducers');
var isAction_1 = require("./util/isAction");
exports.INIT_STORE = '@@luna/INIT_STORE';
exports.INIT_STORE_ACTION = { type: exports.INIT_STORE };
var Store = (function (_super) {
    __extends(Store, _super);
    function Store(rootReducer, initialState) {
        var _this = this;
        // this is a stream for the states of the store, call BehaviorSubject constructor
        _super.call(this, combineReducers_1.passOrCombineReducers(rootReducer)(initialState, exports.INIT_STORE_ACTION));
        this.destroy = function () {
            _this.action$.complete();
            _this.complete();
        };
        this.rootReducer = combineReducers_1.passOrCombineReducers(rootReducer);
        // action$ is a stream for action objects
        this.action$ = new rxjs_1.Subject();
        this.update$ = new rxjs_1.Subject();
        this.action$
            .subscribe(function (action) {
            var currentState = _this.getValue();
            var state = _this.rootReducer(currentState, action);
            _this.next(state);
            _this.update$.next({ state: _this.getValue(), action: action });
        }, function (error) { return console.log('dispatcher$ Error: ', error.toString()); }, function () { return console.log('dispatcher$ completed'); });
        this.action$.next(exports.INIT_STORE_ACTION);
    }
    Store.prototype.dispatch = function (action) {
        var _action, _actionThunk, newAction;
        if (typeof action === 'function') {
            _actionThunk = action;
            newAction = _actionThunk.apply(this);
            if (isAction_1.isAction(newAction))
                return this.action$.next(newAction);
        }
        else if (!action) {
            throw Error("Plain object action is undefined: action=" + _action);
        }
        else {
            _action = action;
            this.action$.next(_action);
        }
    };
    // this method is just a wrapper function to make it compatible with redux convention.
    Store.prototype.getState = function () {
        return this.getValue();
    };
    Store.prototype.select = function (key) {
        return this
            .map(function (state) {
            var rState = state[key];
            return rState;
        })
            .distinctUntilChanged();
    };
    return Store;
}(rxjs_1.BehaviorSubject));
exports.Store = Store;
