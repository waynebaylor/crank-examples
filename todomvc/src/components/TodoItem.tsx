import { Context, createElement } from '@bikeshaving/crank';
import { Todo } from '../todoService';

interface Props {
  todo: Todo;
}

export function* TodoItem(this: Context<Props, any>, props: Props) {
  let editing = false;

  const handleDestroyClick = (todo: Todo) => {
    this.dispatchEvent(new CustomEvent('delete-todo', { bubbles: true, detail: todo }));
  };

  const handleCompletedChange = (todo: Todo, completed: boolean) => {
    this.dispatchEvent(new CustomEvent('change-status', { bubbles: true, detail: { todo, completed } }));
  };

  const handleTodoDoubleClick = () => {
    editing = true;

    this.schedule((liElement) => {
      liElement.querySelector('.edit').focus();
    });

    this.refresh();
  };

  const handleEditSubmit = (event: Event, todo: Todo) => {
    event.preventDefault();
    event.stopPropagation();

    const formEl = event.target as HTMLFormElement;
    const inputEl = formEl.elements[0] as HTMLInputElement;
    const value = inputEl.value.trim();

    if (value.length > 0) {
      editing = false;
      this.dispatchEvent(new CustomEvent('edit-todo', { bubbles: true, detail: { value, todo } }));
    }
  };

  const handleEditBlur = (event: Event) => {
    // requestSubmit() will trigger the form's onsubmit event
    (event.target as HTMLInputElement).form?.requestSubmit();
  };

  const handleEditKeydown = (event: Event) => {
    const key = (event as KeyboardEvent).key;
    if (key === 'Escape') {
      editing = false;
      this.refresh();
    }
  };

  for (const { todo } of this) {
    yield (
      <li class={`${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`}>
        {editing ? (
          <form onsubmit={(event: Event) => handleEditSubmit(event, todo)}>
            <input type="text" class="edit" value={todo.title} onblur={handleEditBlur} onkeydown={handleEditKeydown} />
          </form>
        ) : (
          <div class="view">
            <input type="checkbox" class="toggle" checked={todo.completed} onchange={(event: any) => handleCompletedChange(todo, event.target.checked)} />
            <label ondblclick={handleTodoDoubleClick}>{todo.title}</label>
            <button type="button" class="destroy" onclick={() => handleDestroyClick(todo)}></button>
          </div>
        )}
      </li>
    );
  }
}
