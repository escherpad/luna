"use strict";
/** Created by ge on 12/4/15. */
const rxjs_1 = require('rxjs');
const combineReducers_1 = require('./util/combineReducers');
const INIT_STORE = 'INIT_STORE';
class Store extends rxjs_1.BehaviorSubject {
    constructor(rootReducer, initialState) {
        // this is a stream for the states of the store, call BehaviorSubject constructor
        super(combineReducers_1.passOrCombineReducers(rootReducer)(initialState, { type: INIT_STORE }));
        // this method is just a wrapper function to make it compatible with redux convention.
        this.getState = () => {
            return this.value;
        };
        this.select = (key) => {
            return this
                .map((state) => {
                var rState = state[key];
                return rState;
            })
                .distinctUntilChanged();
        };
        this.destroy = () => {
            this.action$.complete();
            this.complete();
        };
        this.rootReducer = combineReducers_1.passOrCombineReducers(rootReducer);
        // action$ is a stream for action objects
        this.action$ = new rxjs_1.Subject();
        this.action$
            .subscribe((action) => {
            var currentState = this.getValue();
            var state = this.rootReducer(currentState, action);
            if (typeof state !== "undefined")
                this.next(state);
        }, (error) => console.log('dispatcher$ Error: ', error.toString()), () => console.log('dispatcher$ completed'));
    }
    dispatch(action) {
        var _action, _actionThunk, newAction;
        if (typeof action === 'function') {
            _actionThunk = action;
            newAction = _actionThunk.apply(this);
            if (typeof newAction !== 'undefined') {
                return this.action$.next(newAction);
            }
        }
        else if (!action) {
            throw Error("Plain object action is undefined: action=" + _action);
        }
        else {
            _action = action;
            this.action$.next(_action);
        }
    }
}
exports.Store = Store;
