import { Context, createElement, Fragment } from '@bikeshaving/crank';
import {
  deleteCompletedTodos,
  deleteTodo,
  getActiveTodos,
  getAllTodos,
  getCompletedTodos,
  saveTodo,
  setTodoStatus,
  Todo,
  toggleAllCompleted,
  updateTodoTitle,
} from '../todoService';
import { Footer, Header, TodoList } from '../components';

interface Props {
  filter: 'all' | 'active' | 'completed';
}

export function* TodosScreen(this: Context<Props, any>, props: Props) {
  this.addEventListener('add-todo', (event: Event) => {
    const value = (event as CustomEvent<string>).detail;
    saveTodo(value);
    this.refresh();
  });

  this.addEventListener('delete-todo', (event: Event) => {
    const todo = (event as CustomEvent<Todo>).detail;
    deleteTodo(todo);
    this.refresh();
  });

  this.addEventListener('change-status', (event: Event) => {
    const { todo, completed } = (event as CustomEvent<{ todo: Todo; completed: boolean }>).detail;
    setTodoStatus(todo, completed);
    this.refresh();
  });

  this.addEventListener('clear-completed', () => {
    deleteCompletedTodos();
    this.refresh();
  });

  this.addEventListener('toggle-all-completed', () => {
    toggleAllCompleted();
    this.refresh();
  });

  this.addEventListener('edit-todo', (event: Event) => {
    const { todo, value } = (event as CustomEvent<{ todo: Todo; value: string }>).detail;
    updateTodoTitle(todo, value);
    this.refresh();
  });

  for (const { filter } of this) {
    let todos: Todo[] = [];
    const todoCount = getAllTodos().length;

    switch (filter) {
      case 'all':
        todos = getAllTodos();
        break;
      case 'active':
        todos = getActiveTodos();
        break;
      case 'completed':
        todos = getCompletedTodos();
        break;
    }

    yield (
      <section class="todoapp">
        <Header />
        {todoCount > 0 && (
          <Fragment>
            <TodoList todos={todos} />
            <Footer selected={filter} />
          </Fragment>
        )}
      </section>
    );
  }
}
