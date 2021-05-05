import { Context, createElement } from '@bikeshaving/crank';
import { getActiveTodos, getCompletedTodos } from '../todoService';
import { Link } from './Link';

interface Props {
  filter: 'all' | 'active' | 'completed';
}

export function* Footer(this: Context<Props, any>, _props: Props) {
  const handleClick = () => {
    this.dispatchEvent(new CustomEvent('clear-completed', { bubbles: true }));
  };

  for (const { filter } of this) {
    const activeCount = getActiveTodos().length;
    const completedCount = getCompletedTodos().length;

    yield (
      <footer class="footer">
        <span class="todo-count">
          <strong>{activeCount}</strong> {activeCount === 1 ? 'item' : 'items'} left
        </span>
        <ul class="filters">
          <li>
            <Link selected={filter === 'all'} href="/">
              All
            </Link>
          </li>
          <li>
            <Link selected={filter === 'active'} href="/active">
              Active
            </Link>
          </li>
          <li>
            <Link selected={filter === 'completed'} href="/completed">
              Completed
            </Link>
          </li>
        </ul>
        {completedCount > 0 && (
          <button type="button" class="clear-completed" onclick={handleClick}>
            Clear completed
          </button>
        )}
      </footer>
    );
  }
}
