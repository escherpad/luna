/** Created by ge on 3/26/16. */

/* to make this script a module */
export default {}

import {Action, Hash, Reducer, Store} from "./index";
let reducer = <Reducer>function (state:number = 0, action:Action, callback:(state:number)=>void):number {
    if (action.type === "INC") {
        return state + 1;
    } else if (action.type === "DEC") {
        return state - 1;
    } else {
        return state;
    }
};

import {Observable} from 'rxjs';

describe("store$", function () {
    it("can get updated state", function () {

        let store$:Store<number> = new Store(reducer) as Store<number>;
        expect(store$.value).toEqual(0);
        store$.subscribe(state => console.log("test 1: ", state));

    });
    it("can get updated state as well as actions", function () {

        let store$:Store<number> = new Store(reducer, 10) as Store<number>;
        store$
            .map(store => ({store, action: store$.action$.getValue()}))
            .subscribe(state => console.log("test 2: ", state));

    });
    it("can subscribe to actions", function () {
        let store$:Store<number> = new Store(reducer, 10);

        let testAction$ = Observable.from([
            {type: "INC"},
            {type: "DEC"},
            {type: "INC"},
            {type: "DEC"}
        ]);
        store$
            .map(store => {
                return {store, action: store$.action$.getValue()};
            })
            .subscribe(state => console.log("test 3: ", state));

        testAction$
            .subscribe((action:Action) => store$.dispatch(action));
    });
    it("can subscribe to actions directly", function () {
        let store$:Store<number> = new Store(reducer, 10) as Store<number>;

        let testAction$ = Observable.from([
            {type: "INC"},
            {type: "DEC"},
            {type: "INC"},
            {type: "DEC"}
        ]);
        store$
            .map(store => {
                return {store, action: store$.action$.getValue()};
            })
            .subscribe(state => console.log("test 4: ", state));

        testAction$
            .subscribe(store$.action$);
    });
});

