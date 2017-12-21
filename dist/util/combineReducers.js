"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// helper function
function pickReducers(reducers) {
    var initialResult = {};
    return Object
        .keys(reducers)
        .reduce(function (finalReducer, key) {
        if (typeof reducers[key] === 'function') {
            finalReducer[key] = reducers[key];
        }
        return finalReducer;
    }, initialResult);
}
// mixed reducer type is not supported, but I want to add them later on.
function combineReducers(reducers) {
    var finalReducers = pickReducers(reducers);
    var keys = Object.keys(finalReducers);
    var combinedReducer = function (state, action) {
        if (typeof state === "undefined")
            state = {};
        var hasChanged = false;
        var finalState = keys.reduce(function (_state, key) {
            var nextState;
            var previousStateForKey = _state[key];
            var nextStateForKey = finalReducers[key](_state[key], action);
            hasChanged = hasChanged || previousStateForKey !== nextStateForKey;
            if (!hasChanged) {
                return _state;
            }
            else {
                nextState = Object.assign({}, _state);
                nextState[key] = nextStateForKey;
                return nextState;
            }
        }, state);
        return hasChanged ? finalState : state;
    };
    return combinedReducer;
}
exports.combineReducers = combineReducers;
function passOrCombineReducers(reducers) {
    if (typeof reducers !== 'function') {
        return combineReducers(reducers);
    }
    else {
        return reducers;
    }
}
exports.passOrCombineReducers = passOrCombineReducers;
