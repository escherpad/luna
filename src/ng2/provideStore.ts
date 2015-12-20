/** Created by ge on 12/17/15. */
import {Reducer, Hash} from "./../interfaces";
import {Store} from "./../Store";
import {createStore} from "./../createStore";

// for angular2
import "reflect-metadata";
import {provide} from "../../node_modules/angular2/core.d";

export function provideStore<TState>(reducer:Reducer|Hash<Reducer>, initialState:TState):any[] {
    return [
        provide(Store, {useFactory: createStore(reducer, initialState)})
    ]
}
