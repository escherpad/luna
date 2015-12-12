///<reference path="../typings/mocha/mocha.d.ts"/>
///<reference path="../typings/chai/chai.d.ts"/>

import chai = require('chai');
var expect = chai.expect;

/** Created by ge on 12/6/15. */
import {Action, Hash, Reducer} from "./index";

// the Stat interface need to extend Hash so that the index keys are available.
interface TestState extends Hash {
    counter:number;
}

let reducer = <Reducer>function (state:TestState, action:Action<TestState>, callback:(state:TestState)=>void):TestState {
    if (action.type === "INC") {
        state.counter += 1;
        return state
    } else if (action.type === "DEC") {
        state.counter -= 1;
        return state
    } else if (action.type === "ASYNC_INC") {
        console.log('adding right now ---------------');
        setTimeout(()=> {
            console.log('adding right now =================');
            state.counter += 1;
            callback(state);
        }, 10);
        return undefined;
    } else if (action.type === "ASYNC_DEC") {
        setTimeout(()=> {
            state.counter -= 1;
            callback(state);
        }, 10);
        return undefined;
    } else {
        return state;
    }
};

describe("interfaces", function () {
    it("Reducer can be a function", function () {
        var state:TestState = {counter: 0};
        expect(state.counter).to.equal(0);
        state = reducer(state, {type: "INC"});
        expect(state.counter).to.equal(1);
        state = reducer(state, {type: "DEC"});
        expect(state.counter).to.equal(0);
    });
    it("create store", function () {
        var state:TestState = {counter: 0};
        expect(state.counter).to.equal(0);
        state = reducer(state, {type: "INC"});
        expect(state.counter).to.equal(1);
        state = reducer(state, {type: "DEC"});
        expect(state.counter).to.equal(0);
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
        var state:TestState = {counter: 10};
        var store = new Store<TestState>(reducer, state);
        store.state$.subscribe(
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
        var state:TestState = {counter: 20};
        let reducer = <Reducer>function (state:TestState, action:Action<TestState>, callback:(state:TestState)=>void):TestState {
            if (action.type === "ASYNC_INC") {
                setTimeout(()=> {
                    state.counter += 1;
                    callback(state);
                }, 10);
                return undefined;
            } else if (action.type === "ASYNC_DEC") {
                setTimeout(()=> {
                    state.counter -= 1;
                    callback(state);
                }, 10);
                return undefined;
            } else {
                return state;
            }
        };
        var store = new Store<TestState>(reducer, state);
        store.state$.subscribe(
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
