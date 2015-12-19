var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/** Created by ge on 12/4/15. */
var rxjs_1 = require('rxjs');
var combineReducers_1 = require('./util/combineReducers');
var INIT_STORE = 'INIT_STORE';
var Store = (function (_super) {
    __extends(Store, _super);
    function Store(rootReducer, initialState) {
        var _this = this;
        // this is a stream for the states of the store, call BehaviorSubject constructor
        _super.call(this, combineReducers_1.passOrCombineReducers(rootReducer)(initialState, { type: INIT_STORE }));
        this.select = function (key) {
            return _this
                .map(function (state) {
                var rState = state[key];
                return rState;
            })
                .distinctUntilChanged();
        };
        this.destroy = function () {
            _this.action$.complete();
            _this.complete();
        };
        this.rootReducer = combineReducers_1.passOrCombineReducers(rootReducer);
        // action$ is a stream for action objects
        this.action$ = new rxjs_1.Subject();
        this.action$
            .subscribe(function (action) {
            var currentState = _this.getValue();
            var state = _this.rootReducer(currentState, action);
            if (typeof state !== "undefined")
                _this.next(state);
        }, function (error) { return console.log('dispatcher$ Error: ', error.toString()); }, function () { return console.log('dispatcher$ completed'); });
    }
    Store.prototype.dispatch = function (action) {
        var _action, _actionThunk, newAction;
        if (typeof action === 'function') {
            _actionThunk = action;
            newAction = _actionThunk.apply(this);
            if (typeof newAction !== 'undefined') {
                return this.action$.next(newAction);
            }
        }
        else {
            _action = action;
            this.action$.next(_action);
        }
    };
    return Store;
})(rxjs_1.BehaviorSubject);
exports.Store = Store;
