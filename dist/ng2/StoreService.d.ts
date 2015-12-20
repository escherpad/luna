/** Created by ge on 12/19/15.
 *
 * # NOTE:
 *
 * This is the parent class for store services in an angular2 project.
 *
 * I found it easier to organize the reducer and types as angular2 classes, and use
 * the dependency injection to automatically setup the rootStoreService.
 */
import { Reducer } from "./../interfaces";
export declare class StoreService<TState> {
    initialState: TState;
    reducer: Reducer;
    types: any;
    $: any;
    actions: any;
    constructor();
    onStoreInit(store: TState): void;
}
