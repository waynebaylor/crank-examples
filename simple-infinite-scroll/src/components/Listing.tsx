import { Context, createElement } from '@bikeshaving/crank';
import { ApiItem } from '../ApiResponse';
import { Sentinal } from './Sentinal';

interface Props {
  items: ApiItem[];
  hasMoreItems: boolean;
}

export function* Listing(this: Context<Props, any>, _props: Props) {
  for (const { items, hasMoreItems } of this) {
    yield (
      <div class="listing">
        <h2>US Newspaper Directory: Colorado</h2>
        <p class="subtitle">
          <em>
            Data provided by <a href="https://chroniclingamerica.loc.gov">https://chroniclingamerica.loc.gov</a>
          </em>
        </p>

        {items.map((item) => (
          <div crank-key={item.id} class="tile">
            <div class="tile-icon">
              <i class="far fa-newspaper fa-2x"></i>
            </div>
            <div class="tile-content">
              <a href={item.url.replace('.json', '')} class="tile-title">
                {item.title}
              </a>
              <span class="date-range">
                {item.start_year} &ndash; {item.end_year}
              </span>
              <div class="tile-subtitle">
                <strong>Publisher:</strong> {item.publisher}
                <br />
                <strong>Place of publication:</strong> {item.place_of_publication}
              </div>
            </div>
          </div>
        ))}
        {hasMoreItems ? (
          <Sentinal />
        ) : (
          <div class="finish">
            <div>&#x1f389; &#x1f389; &#x1f389;</div>
            <div>
              <strong>
                <em>Congratulations, you scrolled to the end!</em>
              </strong>
            </div>
            <div>&#x1f388; &#x1f388;</div>
          </div>
        )}
      </div>
    );
  }
}
