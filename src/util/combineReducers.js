"use strict";
// helper function
function pickReducers(reducers) {
    var initialResult = {};
    return Object
        .keys(reducers)
        .reduce((finalReducer, key) => {
        if (typeof reducers[key] === 'function') {
            finalReducer[key] = reducers[key];
        }
        return finalReducer;
    }, initialResult);
}
// mixed reducer type is not supported, but I want to add them later on.
function combineReducers(reducers) {
    const finalReducers = pickReducers(reducers);
    const keys = Object.keys(finalReducers);
    var combinedReducer = (state, action) => {
        if (typeof state === "undefined")
            state = {};
        var hasChanged = false;
        var finalState = keys.reduce((_state, key) => {
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
