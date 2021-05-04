import { Context, createElement } from '@bikeshaving/crank';
import { Todo } from '../todoService';
import { EditTodoItem } from './EditTodoItem';
import { ViewTodoItem } from './ViewTodoItem';

interface Props {
  todo: Todo;
}

export function* TodoItem(this: Context<Props, any>, _props: Props) {
  let editing = false;

  this.addEventListener('start-editing', () => {
    editing = true;

    this.schedule((liElement) => {
      liElement.querySelector('.edit').focus();
    });

    this.refresh();
  });

  this.addEventListener('stop-editing', () => {
    editing = false;
    this.refresh();
  });

  for (const { todo } of this) {
    yield (
      <li class={`${todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`}>
        {editing ? <EditTodoItem todo={todo} /> : <ViewTodoItem todo={todo} />}
      </li>
    );
  }
}
