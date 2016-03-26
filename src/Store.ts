/** Created by ge on 12/4/15. */
import {BehaviorSubject, Observable} from 'rxjs';
import {passOrCombineReducers} from './util/combineReducers';
import {Action, Thunk, Reducer, Hash} from "./interfaces";


const INIT_STORE = 'INIT_STORE';
const INIT_STORE_ACTION = {type: INIT_STORE};
export class Store<TState> extends BehaviorSubject<TState> {
    public rootReducer:Reducer;
    public action$:BehaviorSubject<Action>;

    constructor(rootReducer:Reducer | Hash<Reducer>,
                initialState:TState) {
        // this is a stream for the states of the store, call BehaviorSubject constructor
        super(passOrCombineReducers(rootReducer)(initialState, INIT_STORE_ACTION));
        this.rootReducer = passOrCombineReducers(rootReducer);

        // action$ is a stream for action objects
        this.action$ = new BehaviorSubject<Action>(INIT_STORE_ACTION);
        this.action$
            .subscribe(
                (action) => {
                    var currentState:TState = this.getValue();
                    var state:TState = this.rootReducer(currentState, action);
                    if (typeof state !== "undefined") this.next(state);
                },
                (error) => console.log('dispatcher$ Error: ', error.toString()),
                () => console.log('dispatcher$ completed')
            );

    }

    dispatch(action:Action|Thunk<TState>) {
        var _action:Action,
            _actionThunk:Thunk<TState>,
            newAction:Action;
        if (typeof action === 'function') {
            _actionThunk = action as Thunk<TState>;
            newAction = <Action>_actionThunk.apply(this);
            if (typeof newAction !== 'undefined') {
                return this.action$.next(newAction);
            }
        } else if (!action) {
            throw Error("Plain object action is undefined: action=" + _action);
        } else {
            _action = action as Action;
            this.action$.next(_action);
        }
    }

    // this method is just a wrapper function to make it compatible with redux convention.
    getState = ():TState => {
        return this.value
    };

    select = <TRState>(key:string):Observable<TRState> => {
        return this
            .map((state:any) => {
                var rState:TRState = state[key] as TRState;
                return rState;
            })
            .distinctUntilChanged();
    };

    destroy = ()=> {
        this.action$.complete();
        this.complete();
    }
}
