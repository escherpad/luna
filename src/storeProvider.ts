/** Created by ge on 12/17/15. */
import {Reducer} from "./interfaces";
import {Store} from "./Store";
import {createStore} from "./createStore";

// for angular2
import "reflect-metadata";
import {provide} from "angular2/core";

export function storeProvider <TState>(reducer:Reducer, initialState:TState):any[] {
    return [
        provide(Store, {useFactory: createStore(reducer, initialState)})
    ]
}