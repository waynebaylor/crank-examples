import roadtrip from 'roadtrip';
import { renderer } from '@bikeshaving/crank/dom';
import { createElement } from '@bikeshaving/crank';
import { TodosScreen } from './screens';

roadtrip.add('/:filter', (route: any) => {
  const activeFilter = route.params.filter || 'all';
  renderer.render(<TodosScreen filter={activeFilter} />, document.getElementById('app') as HTMLElement);
});

export const router = roadtrip;
