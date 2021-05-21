import './style.css';
import page from 'page';
import { renderer } from '@bikeshaving/crank/dom';
import { createElement } from '@bikeshaving/crank';
import { AdvancedInfiniteScroll } from './screens';

page('/advanced', () => {
  document.title = 'Advanced Infinite Scroll';
  renderer.render(<AdvancedInfiniteScroll />, document.getElementById('app') as HTMLElement);
});

page('/', '/advanced');

page();
