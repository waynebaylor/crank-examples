# TodoMVC

This is a Crank.js implementation of [TodoMVC](https://todomvc.com/) which follows the recommended TodoMVC [application specification](https://github.com/tastejs/todomvc/blob/master/app-spec.md).

The goal of this example is to implement TodoMVC with Crank as if it were an app. The code has been structured to make implementing _the next feature_ as easy as possible. It is not supposed to be clever or hyper-optimized. Hopefully it's easy to read and understand.

To see it in action, check out the **[DEMO](https://waynebaylor.github.io/crank-examples/todomvc)**

## Implementation

### Libraries

- [Vite](https://vitejs.dev/) - build tool (alternatives: Webpack, Parcel, etc)
- [Crank.js](https://crank.js.org/) - view library
- [roadtrip](https://github.com/Rich-Harris/roadtrip) - router (alternatives: Page.js, Navigo, etc)

### Highlights

**JSX Support**

The `createElement` and `Fragment` specified here are both provided by Crank.

```javascript
// vite.config.js

jsxFactory: 'createElement',
jsxFragment: 'Fragment',

// Vite also has a cool feature where it will automatically add this import to
// all your jsx/tsx files. However VS Code doesn't recognize it and will show
// errors in the IDE.
jsxInject: `import { createElement } from '@bikeshaving/crank'`
```

The `jsxFactory` and `jsxFragmentFactory` are duplicated here for VS Code.

```json
// tsconfig.json

"jsx": "react",
"jsxFactory": "createElement",
"jsxFragmentFactory": "Fragment",
```

**Routing**

Every app starts with a single screen. It might seem like overkill to use a routing library for TodoMVC, but it gives us an opportunity to show how to use Crank with routing.

Every router library is a little different, but using Crank is straightforward. In the route handler you render the desired top-level Crank component, like I've done here with `<TodoScreen>`:

```typescript
// router.tsx

roadtrip.add('/:filter', (route: any) => {
  const activeFilter = route.params.filter || 'all';
  renderer.render(<TodosScreen filter={activeFilter} />, document.getElementById('app') as HTMLElement);
});
```

**Component Props**

I have chosen to implement each component with its own `Props` interface, for example:

```typescript
// TodosScreen.tsx

interface Props {
  filter: 'all' | 'active' | 'completed';
}

export function* TodosScreen(this: Context<Props, any>, _props: Props) {
  ...

  for (const { filter } of this) {
    ...
  }
}
```

The usage in `Context<Props, any>` allows the type information to carry over into the `for` loop. The second usage in `_props: Props` provides valid keys/types when using the component, like `<TodosScreen filter="all" />`.

> NOTE: `_props` is unused and typescript will tell you that's a problem. You could disable `noUnusedParameters` or toss in `@ts-ignore`, but I've chosen to use the `_` prefix as seen here.

**Events**

There are many ways to have components exchange information. In this app I've chosen to pass information from parent components to children via props, and when necessary from child components to parent via events.

Passing props to child components is nothing new, so I'll focus more on how events can be used with Crank components. For example, consider these two components: `TodoItem` (parent) and `ViewTodoItem` (child).

When the user double-clicks on the label in `ViewTodoItem` we dispatch an event, just like normal dom events.

```typescript
// ViewTodoItem.tsx
...

const handleTodoDoubleClick = () => {
  this.dispatchEvent(new CustomEvent('start-editing', { bubbles: true }));
};

...

<label ondblclick={handleTodoDoubleClick}>{todo.title}</label>

...
```

The parent component `TodoItem` is litening for this event and when received it will switch to editing mode.

```typescript
// TodoItem.tsx
...

this.addEventListener('start-editing', () => {
  editing = true;

  this.schedule((liElement) => {
    liElement.querySelector('.edit').focus();
  });

  this.refresh();
});

...
```

**Application State**

The TodoMVC spec says to use LocalStorage. I've wrapped all interaction with LocalStorage in functions exported by the `todoService` module, so other parts of the application don't need to know or care about LocalStorage. Other application state is managed by the Crank components themselves. For example, the `editing` state in `TodoItem`.
