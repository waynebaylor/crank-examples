import { Context, createElement } from '@bikeshaving/crank';
import { TodoItem } from './TodoItem';
import { Todo } from '../todoService';

interface Props {
  todos: Todo[];
}

export function* TodoList(this: Context<Props, any>, _props: Props) {
  const handleChange = () => {
    this.dispatchEvent(new CustomEvent('toggle-all-completed', { bubbles: true }));
  };

  for (const { todos } of this) {
    const allCompleted = todos.every((t) => t.completed);

    yield (
      <section class="main">
        <input class="toggle-all" id="toggle-all" type="checkbox" checked={allCompleted} onchange={handleChange} />
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
          {todos.map((todo) => (
            <TodoItem crank-key={todo.id} todo={todo} />
          ))}
        </ul>
      </section>
    );
  }
}
