import './style.css';
import page from 'page';
import { renderer } from '@bikeshaving/crank/dom';
import { createElement } from '@bikeshaving/crank';
import { SimpleInfiniteScroll } from './screens';

page('/simple', () => {
  document.title = 'Simple Infinite Scroll';
  renderer.render(<SimpleInfiniteScroll />, document.getElementById('app') as HTMLElement);
});

page('/', '/simple');

page();
