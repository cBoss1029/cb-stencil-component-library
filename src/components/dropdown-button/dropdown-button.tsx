import { Component, Host, h, Prop, Watch } from '@stencil/core';

export type DropdownOption = {
  label: string;
  value?: string;
  href?: string;
  children?: DropdownOption[];
}
export interface DropdownButtonProps {
  options: DropdownOption[];
}

@Component({
  tag: 'dropdown-button',
  styleUrl: 'dropdown-button.css',
  shadow: true,
})
export class DropdownButton {
  constructor() {
    this.setRef = this.setRef.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
  }
  refs: { [x: string]: HTMLElement } = {};;
  _options: DropdownOption[] = [];

  @Prop() options: DropdownOption[] | string = [];
  @Watch('options')
  optionsWatcher(newValue: DropdownOption[] | string) {
    if (typeof newValue === 'string') {
      this._options = JSON.parse(newValue);
    } else {
      this._options = newValue;
    }
  }
  // We need to parse the JSON string for options
  // Watch doesn't fire on initial load
  componentWillLoad() {
    this.optionsWatcher(this.options);
  }

  disconnectedCallback() {
    // clean up event listeners
    const dropdownContainer = document.querySelector('.dropdown-container');
    if (dropdownContainer) {
      dropdownContainer.removeEventListener('click', this.handleLinkClick, {});
    }
  }

  private setRef(el: HTMLElement) {
    const { target } = el.dataset;
    this.refs = { ...this.refs, [target]: el };
  }

  // TODO: handle outside clicks to close menus
  private handleLinkClick(e: MouseEvent) {
    e.preventDefault();
    // TODO: not sure if this is the proper type guard for this event
    if (e.target instanceof HTMLElement) {
      let refId = e.target.dataset.target;
      if (!refId) return;
      const target = this.refs[refId];
      if (target.getAttribute('aria-expanded') === 'false') {
        target.setAttribute('aria-expanded', 'true');
      } else {
        target.setAttribute('aria-expanded', 'false');
      }
    }
  }

  private renderMenuItems(
    level: number = 1,
    options: DropdownOption[] = this._options) {
    const olClass = level === 1 ? 'menu' : 'sub-menu';
    return (
      <ol
        class={olClass}
        data-target={`menuLvl${level}`}
        ref={this.setRef}
        aria-expanded="false">
        {options.map((option: DropdownOption, index: number) => {
          return (
            <li key={`li-${option}-${index}`}>
              <a
                key={`a-${option}-${index}`}
                //TODO: add ability to override href
                href=""
                data-target={option.children ? `menuLvl${level + 1}` : null}>{option.label}</a>
              {option.children ? this.renderMenuItems(level + 1, option.children) : null}
            </li>
          );
        })}
      </ol>
    )
  }

  render() {
    return (
      <Host>
        <div class="dropdown-container" onClick={this.handleLinkClick}>
          <a
            id="button"
            class='select'
            href=""
            data-target="menuLvl1"
            ref={this.setRef}>Select an Option</a>
          {this.renderMenuItems()}
        </div>
      </Host>
    );
  }

}
