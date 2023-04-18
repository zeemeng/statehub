<h1 align="center">StateHub</h1>
<p align="center">
  <img src="https://img.shields.io/npm/v/statehubjs?color=informational&logo=npm&logoColor=fff&logoWidth=12&label=npm%20package" alt="NPM package version" />
  <img src="https://img.shields.io/node/v/statehubjs" alt="supported node version" />
  <img src="https://img.shields.io/bundlephobia/min/statehubjs?color=success" alt="minified bundle size" />
  <img src="https://img.shields.io/github/license/zeemeng/statehub" alt="license" />
</p>

## About

_StateHub_ is a centralized state management solution which provides **reactivity** and **seamless intercommunication** between application components, as well as ease of use for application authors.

Benefits:

- Supports components of any type (React, Angular, Vue, Web Component, raw DOM nodes, etc.)
- Components subscribed/connected to the `StateHub` receive changes to the centralized state as they occur.
- Allows components to communicate with and affect each other irrespective of hierarchy.
- Separating state management logic from component view logic makes component code leaner.
- Aims to be easier to use than other contemporary state management solutions.

## Installation

Via NPM:

```shell
$ npm i statehubjs
```

OR

By cloning this Git [repository](https://github.com/zeemeng/statehub.git). Note that this repository contains Git submodules, so please use appropriate command line flags or use the following command:

```shell
$ git clone --recurse-submodules https://github.com/zeemeng/statehub.git

```

## Example and concepts

First import the module:

```js
/* FILE hub.js */

import StateHub from "statehubjs"; // In a Node environment

// OR

import StateHub from "./statehub/index.js"; // Import from index.js in non-Node environments
```

Then, instantiate and export a hub:

```js
import { actions } from "./actions.js";

const hub = new StateHub(actions, optionalInitialState);

export default hub;
```

Notice that the `StateHub` constructor takes 2 arguments. The second argument is optional. If supplied, it is assigned as the initial state value maintained by the hub. If not supplied, the initial state value of the hub will be an empty Object. The state can be of any data type, but using an Object might be good choice if the state that need to be maintained is complex and structured.

The first argument to the `StateHub` constructor is a dictionary of "actions" which are simply functions which describe how the state can be mutated. Thus, the first argument is in effect an Object containing key-value pairs, where the keys represent "action types" and must be unique strings, and where the values are "action" functions.

Here is an example of such a dictionary of "actions" defined in a separate file:

```js
/* FILE actions.js */

export const actionTypes = {
  removeSection: "removeSection",
  setActiveSection: "setActiveSection",
  toggleNavDropdown: "toggleNavDropdown",
  hideNavDropdown: "hideNavDropdown"
};

export const actions = {
  removeSection: (state, payload) => ({
    ...state,
    sections: state.sections.filter(section => section.id !== payload)
  }),
  setActiveSection: (state, payload) => ({ ...state, activeSection: payload }),
  toggleNavDropdown: state => ({ ...state, showNavDropdown: !state.showNavDropdown }),
  hideNavDropdown: state => ({ ...state, showNavDropdown: false })
};
```

Here we see more clearly the signature of an "action" function. It is a function which takes 1 or 2 arguments and returns a value, which will became the new state value of the hub once the action is triggered and executed.

The first argument is always the value of the state before the mutation occurs and the second argument is an optional value supplied by the component which triggers the action. More on that later.

We see that the return value of all the "action" functions in the example is a newly created Objet where some properties are copied from the old state value and some other are assigned new values. In contrast to directly assigning the new property values to the old state object, this provides multiple benefits, such as some guarantee of synchronicity to components that are subscribed to the hub and that might handle/use multiple "versions" of the state.

In the above example, there is also an exported `actionType` Object/dictionary which properties are associated with each key present in the `actions` Object. This is not required, but comes in handy later on in component code which need to trigger/dispatch action as we will see.

With the hub set up, it's time to use it in various components.

```js
import hub from "./hub.js"

/* In a component life-cycle method or when the component gets initialized */
...
  hub.subscribe((updatedStateValue) => {
    // Do something with the state value. For example, save it to a local state or use it to render some view.
    setLocalState(updatedStateValue);
  })
...
```

Now, everytime that the state of the hub updates, the callback provided to the `subscribe` method will be invoked with the new state value.

To trigger an action on the hub:

```js
import hub from "./hub.js";
import { actionTypes } from "./actions.js";

const someEventHandler = event => {
  const payload = event.target.id;
  hub.dispatch(actionType.removeSection, payload);
};
```

When the event handler get invoked, the hub state will be mutated according to the defined action and the supplied `payload`. Then, all subscribed components will be notified with the new state value.

## Notes

- This package is fully annotated and supports **IntelliSense**.
- Suggestions and contributions are welcome.
