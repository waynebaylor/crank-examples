import { Context, createElement } from '@bikeshaving/crank';
import { Todo } from '../todoService';

interface Props {
  todo: Todo;
}

export function* EditTodoItem(this: Context<Props, any>, _props: Props) {
  const handleEditSubmit = (event: Event, todo: Todo) => {
    event.preventDefault();
    event.stopPropagation();

    const formEl = event.target as HTMLFormElement;
    const inputEl = formEl.elements[0] as HTMLInputElement;
    const value = inputEl.value.trim();

    if (value.length > 0) {
      this.dispatchEvent(new CustomEvent('edit-todo', { bubbles: true, detail: { value, todo } }));
      this.dispatchEvent(new CustomEvent('stop-editing', { bubbles: true }));
    }
  };

  const handleEditBlur = (event: Event) => {
    // requestSubmit() will trigger the form's onsubmit event
    (event.target as HTMLInputElement).form?.requestSubmit();
  };

  const handleEditKeydown = (event: Event) => {
    const key = (event as KeyboardEvent).key;
    if (key === 'Escape') {
      this.dispatchEvent(new CustomEvent('stop-editing', { bubbles: true }));
    }
  };

  for (const { todo } of this) {
    yield (
      <form onsubmit={(event: Event) => handleEditSubmit(event, todo)}>
        <input type="text" class="edit" value={todo.title} onblur={handleEditBlur} onkeydown={handleEditKeydown} />
      </form>
    );
  }
}
