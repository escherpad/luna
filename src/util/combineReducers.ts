import {Action, Hash, Reducer} from "../interfaces.ts";
// helper function
function pickReducer(reducers:Reducer):Reducer {
    var initialResult = {} as Reducer;
    return Object.keys(reducers).reduce((result:Reducer, key:string):Reducer=> {
        if (typeof reducers[key] === 'function') {
            result[key] = reducers[key];
        }
        return result;
    }, initialResult);
}


// mixed reducer type is not supported, but I want to add them later on.
export function combineReducers<TState extends Hash>(reducers:Reducer|Reducer):Reducer {
    const finalReducers:Reducer = pickReducer(reducers);
    const keys = Object.keys(finalReducers);

    var combinedReducer = <TState extends Hash>(state:TState, action:Action<TState>, callback?:(state:TState)=>void) => {
        var initialResult = {} as TState;
        return keys.reduce((result:TState, key:string):TState => {
            result[key] = finalReducers[key](
                state[key],
                action,
                (_state) => {
                    // call back is not called unless the inner reducer calls it.
                    result[key] = _state;
                    callback(_state);
                }
            );
            return result;
        }, initialResult);
    };
    return combinedReducer as Reducer;
}
