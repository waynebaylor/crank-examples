import { Context, createElement } from '@bikeshaving/crank';
import { Todo } from '../todoService';

interface Props {
  todo: Todo;
}

export function* ViewTodoItem(this: Context<Props, any>, _props: Props) {
  const handleDestroyClick = (todo: Todo) => {
    this.dispatchEvent(new CustomEvent('delete-todo', { bubbles: true, detail: todo }));
  };

  const handleCompletedChange = (todo: Todo, completed: boolean) => {
    this.dispatchEvent(new CustomEvent('change-status', { bubbles: true, detail: { todo, completed } }));
  };

  const handleTodoDoubleClick = () => {
    this.dispatchEvent(new CustomEvent('start-editing', { bubbles: true }));
  };

  for (const { todo } of this) {
    yield (
      <div class="view">
        <input type="checkbox" class="toggle" checked={todo.completed} onchange={(event: any) => handleCompletedChange(todo, event.target.checked)} />
        <label ondblclick={handleTodoDoubleClick}>{todo.title}</label>
        <button type="button" class="destroy" onclick={() => handleDestroyClick(todo)}></button>
      </div>
    );
  }
}
