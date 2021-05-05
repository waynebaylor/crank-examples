import roadtrip from 'roadtrip';
import { renderer } from '@bikeshaving/crank/dom';
import { createElement } from '@bikeshaving/crank';
import { TodosScreen } from './screens';

// the extra base url handling is because we want this to work on github.io/crank-example/todomvc.
//
// NOTE: roadtrip doesn't seem to take the base url into account, so you'll see that prefixed
// in a few places.

roadtrip.base = `${import.meta.env.BASE_URL}`.slice(0, -1); // remove trailing '/'

roadtrip.add(`${roadtrip.base}/:filter`, (route: any) => {
  const activeFilter = route.params.filter || 'all';
  renderer.render(<TodosScreen filter={activeFilter} />, document.getElementById('app') as HTMLElement);
});

export const router = roadtrip;
