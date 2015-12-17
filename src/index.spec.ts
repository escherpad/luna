///<reference path="../typings/mocha/mocha.d.ts"/>
///<reference path="../typings/chai/chai.d.ts"/>

import chai = require('chai');
var expect = chai.expect;

/** Created by ge on 12/6/15. */
import {Action, Hash, Reducer} from "./index";

// the Stat interface need to extend Hash so that the index keys are available.

let reducer = <Reducer>function (state:number, action:Action<number>, callback:(state:number)=>void):number {
    if (action.type === "INC") {
        return state + 1;
    } else if (action.type === "DEC") {
        return state - 1;
    } else if (action.type === "ASYNC_INC") {
        setTimeout(()=> {
            callback(state + 1);
        }, 10);
        return undefined;
    } else if (action.type === "ASYNC_DEC") {
        setTimeout(()=> {
            callback(state - 1);
        }, 10);
        return undefined;
    } else {
        return state;
    }
};

describe("interfaces", function () {
    it("Reducer can be a function", function () {
        var state:number = 0;
        expect(state).to.equal(0);
        state = reducer(state, {type: "INC"});
        expect(state).to.equal(1);
        state = reducer(state, {type: "DEC"});
        expect(state).to.equal(0);
    });
    it("create store", function () {
        var state:number = 0;
        expect(state).to.equal(0);
        state = reducer(state, {type: "INC"});
        expect(state).to.equal(1);
        state = reducer(state, {type: "DEC"});
        expect(state).to.equal(0);
    });
});

import {combineReducers} from "./index";
describe("combineReducers", function () {
    it("should return same reducer", function () {
    })
});

import {Store} from "./index";
describe("store", function () {
    it("sync reducers should work", function () {
        var state:number = 10;
        var store = new Store<number>(reducer, state);
        store.subscribe(
            (state)=> {
                console.log('spec state: ', state)
            },
            error=> console.log('error ', error),
            () => console.log('completed.')
        );
        store.dispatch({type: "INC"});
        store.dispatch({type: "DEC"});
        store.destroy();
    });
    it("async reducers also work", function (done:()=>void) {
        var state:number = 20;
        let reducer = <Reducer>function (state:number, action:Action<number>, callback:(state:number)=>void):number {
            if (action.type === "ASYNC_INC") {
                setTimeout(()=> {
                    callback(state + 1);
                }, 10);
                return undefined;
            } else if (action.type === "ASYNC_DEC") {
                setTimeout(()=> {
                    callback(state - 1);
                }, 10);
                return undefined;
            } else {
                return state;
            }
        };
        var store = new Store<number>(reducer, state);
        store.subscribe(
            (state)=> {
                console.log('spec state: ', state)
            },
            error=> console.log('error ', error),
            () => {
                console.log('completed.');
                done();
            }
        );
        store.dispatch({type: "ASYNC_INC"});
        store.dispatch({type: "ASYNC_DEC"});
        setTimeout(() => {
            store.destroy()
        }, 500);
    });
});
describe("dispatch function", function () {

    it("support action creator", function () {
        var state:number = 30;
        var store = new Store<number>(reducer, state);

        function increase():Action<number> {
            return {
                type: "INC"
            };
        }

        store.subscribe(
            (state)=> {
                console.log('spec state: ', state)
            },
            error=> console.log('error ', error),
            () => console.log('completed.')
        );
        store.dispatch(increase());
        store.dispatch({type: "DEC"});
        store.destroy();
    });
    it("support passing in thunk", function () {
        var state:number = 40;
        var store = new Store<number>(reducer, state);

        function increase():Action<number> {
            return {
                type: "INC"
            };
        }

        store.subscribe(
            (state)=> {
                console.log('spec state: ', state)
            },
            error=> console.log('error ', error),
            () => console.log('completed.')
        );
        store.dispatch(increase);
        store.dispatch({type: "DEC"});
        store.destroy();
    })
    it("support passing in thunk, and thunk have access to dispatch", function () {
        var state:number = 40;
        var store = new Store<number>(reducer, state);

        function increase():void {
            var _store:Store<number> = this;
            setTimeout(function ():void {
                var action:Action<number> = {
                        type: "INC"
                    };
                _store.dispatch(action)
            }, 200);
        }

        store.subscribe(
            (state)=> {
                console.log('spec state: ', state)
            },
            error=> console.log('error ', error),
            () => console.log('completed.')
        );
        store.dispatch(increase);
        store.dispatch({type: "DEC"});
        store.destroy();
    })

});
