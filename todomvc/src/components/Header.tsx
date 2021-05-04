import { Context, createElement } from '@bikeshaving/crank';

interface Props {}

export function* Header(this: Context<Props, any>, _props: Props) {
  const handleSubmit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    // there are lots of ways to get the input value. here i've chosen to get it via the form element.
    const formEl = event.target as HTMLFormElement;
    const inputEl = formEl.elements[0] as HTMLInputElement;
    const value = inputEl.value.trim();

    if (value.length > 0) {
      this.dispatchEvent(new CustomEvent('add-todo', { bubbles: true, detail: value }));
      inputEl.value = '';
    }
  };

  for ({} of this) {
    yield (
      <header class="header">
        <h1>todos</h1>
        {/* a <form> is used here because it has built-in support for <<Enter>> to trigger submit. */}
        <form onsubmit={handleSubmit}>
          <input type="text" class="new-todo" placeholder="What needs to be done?" autofocus={true} />
        </form>
      </header>
    );
  }
}
