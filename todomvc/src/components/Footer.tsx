import { Context, createElement } from '@bikeshaving/crank';
import { getActiveTodos, getCompletedTodos } from '../todoService';

interface Props {
  selected: 'all' | 'active' | 'completed';
}

export function* Footer(this: Context<Props, any>, _props: Props) {
  const handleClick = () => {
    this.dispatchEvent(new CustomEvent('clear-completed', { bubbles: true }));
  };

  for (const { selected } of this) {
    const activeCount = getActiveTodos().length;
    const completedCount = getCompletedTodos().length;

    yield (
      <footer class="footer">
        <span class="todo-count">
          <strong>{activeCount}</strong> {activeCount === 1 ? 'item' : 'items'} left
        </span>
        <ul class="filters">
          <li>
            <a class={selected === 'all' ? 'selected' : ''} href="/">
              All
            </a>
          </li>
          <li>
            <a class={selected === 'active' ? 'selected' : ''} href="/active">
              Active
            </a>
          </li>
          <li>
            <a class={selected === 'completed' ? 'selected' : ''} href="/completed">
              Completed
            </a>
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
