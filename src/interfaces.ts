/** Created by ge on 12/6/15. */
export interface Action<TState> {
    type: string;
    state?:TState;
    $sync?: boolean;
    $async?: boolean;
}

export interface Thunk<TState> {
    (): Action<TState> | void ;
}

export interface Hash {
    [key:string]:any;
}

export interface Reducer {
    <TState>(state:TState, action:Action<TState>, callback?:(state:TState)=>void):TState;
    [key:string]:Reducer;
}
