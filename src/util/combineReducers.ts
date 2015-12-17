import {Action, Hash, Reducer} from "../interfaces.ts";
// helper function
function pickReducers<Reducer>(reducers:Hash<Reducer>):Hash<Reducer> {
    var initialResult:Hash<Reducer> = {};
    return Object
        .keys(reducers)
        .reduce((finalReducer:Hash<Reducer>, key:string):Hash<Reducer> => {
            if (typeof reducers[key] === 'function') {
                finalReducer[key] = reducers[key];
            }
            return finalReducer;
        }, initialResult);
}


// mixed reducer type is not supported, but I want to add them later on.
export function combineReducers<TState>(reducers:Hash<Reducer>):Reducer {
    const finalReducers:Hash<Reducer> = pickReducers<Reducer>(reducers);
    const keys = Object.keys(finalReducers);

    var combinedReducer = <TState extends Hash<any>>(state:TState, action:Action<TState>, callback?:(state:TState)=>void) => {
        var hasChanged:boolean = false;
        var initialState = {} as TState;
        var finalState:TState = keys.reduce((state:TState, key:string):TState => {
            var previousStateForKey:any = state[key];
            var nextStateForKey:any = finalReducers[key](
                state[key],
                action,
                (_state) => {
                    // call back is not called unless the inner reducer calls it.
                    state[key] = _state;
                    callback(_state);
                }
            );
            hasChanged = hasChanged || previousStateForKey !== nextStateForKey;
            return nextStateForKey;
        }, initialState);

        return hasChanged ? finalState : state;
    };
    return combinedReducer as Reducer;
}
