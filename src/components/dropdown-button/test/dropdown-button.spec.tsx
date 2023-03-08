import { newSpecPage } from '@stencil/core/testing';
import { DropdownButton } from '../dropdown-button';

describe('dropdown-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DropdownButton],
      html: `<dropdown-button></dropdown-button>`,
    });
    expect(page.root).toEqualHtml(`
      <dropdown-button>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dropdown-button>
    `);
  });
});
