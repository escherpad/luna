# Luna, a reactive redux library supporting async reducers

[![Join the chat at https://gitter.im/escherpad/luna](https://img.shields.io/badge/GITTER-join%20chat-green.svg?style=flat-square)](https://gitter.im/escherpad/luna?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Redux is awesome. Here we want to use the reactive-extention (Rxjs) to make it even more better. Current luna is 
used at Escherpad with Angular2.

## How to use Luna

first run 

```shell
npm install
```

and then to run a test you can use `karma run`. I use webstorm's karma integration to run the tests.

```typescript
/** Created by ge on 12/6/15. */
import {Action, Hash, Reducer} from "luna";

// the Stat interface need to extend Hash so that the index keys are available.
interface TestState extends Hash {
    counter:number;
}

// Reducer example
const reducer = <Reducer>function (state:TestState, action:Action<TestState>, callback:(state:TestState)=>void):TestState {
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

// define the initial state of store
var state:TestState = {
    counter: 20
};

// now create store
var store = new Store<TestState>(reducer, state);

// stream states to view
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

// dispatch actions using the dispatcher$ BehaviorSubject
var action = {
    type: "ASYNC_INC"
}
store.dispatcher$.next(action);

```

## Plans next

Personally I think documentation is the most important part of a library, and for making everyone's life easier. Bad documentation wastes people's time.

If you would like to help, besides code you can create even larger impact by writing up examples. Redux (and luna) is a simple idea. Let's make it easier for people to understand the concept and start doing things that they set-out to do asap.

### Todo List

- [ ] use immutable in the test instead. Current form is too sloppy!
- [ ] more testing cases with complicated stores
- better store life-cycle support

## Acknowledgement

This library is influenced by @jas-chen's work on redux-core, and received help from @fxck and @robwormald.

Luna is part of my effort on re-writting [escherpad](http://www.escherpad.com), a beautiful real-time collaborative notebook supporting real-time LaTeX, collaborative Jupyter notebook, and a WYSIWYG rich-text editor.

## About Ge

I'm a graduate student studying quantum information and quantum computer at University of Chicago. When I'm not tolling away in a cleanroom or working on experiments, I write `(java|type)script` to relax. You can find my publications here: [google scholar](https://scholar.google.com/citations?user=vaQcF6kAAAAJ&hl=en)

## LICENSING

MIT.