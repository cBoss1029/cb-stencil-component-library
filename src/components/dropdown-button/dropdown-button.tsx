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
export type ClickHistory = {
  level: number;
  element: HTMLElement;
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
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  refs: { [x: string]: HTMLElement } = {};;
  _options: DropdownOption[] = [];
  history: ClickHistory[] = [];
  firstFocusableElement;
  lastFocusableElement;

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
      let isGoingBack = false;
      // TODO: change name of data-target to something less confusing
      let refId = e.target.dataset.target;
      if (!refId) return;
      let target = this.refs[refId];
      let oldTarget = this.refs[refId];
      
      const lastInHistory = this.history[this.history.length - 1];
      if (lastInHistory && lastInHistory.level === parseInt(e.target.dataset.level) +1) {
        isGoingBack = true;
        target = this.refs[`menuLvl${e.target.dataset.level}`];
      }
      this.firstFocusableElement = target.querySelector(`[data-child="first"][data-level="${target.dataset.level}"]`);
      this.lastFocusableElement = target.querySelector(`[data-child="last"][data-level="${target.dataset.level}"]`);
      if (target.getAttribute('aria-expanded') === 'false') {
        // add to history
        this.history.push({
          level: parseInt(target.dataset.level),
          element: e.target
        });
        target.setAttribute('aria-expanded', 'true');
        this.firstFocusableElement.focus();
      } else {
        if(isGoingBack) {
          oldTarget.setAttribute('aria-expanded', 'false');
        }
        if(!isGoingBack) {
          target.setAttribute('aria-expanded', 'false');
        }
        this.history.pop();
      }
    }
  }

  findLastFocusedElement() {
    if(this.history.length > 0) {
      const element = this.history[this.history.length - 1].element;
      return element;
    }
    return null;
  }

  handleKeyUp(e: KeyboardEvent) {
    if(e.key === 'Escape') {
      const lastFocusedElement = this.findLastFocusedElement();
      if (!lastFocusedElement) return;
      // close all menus
      lastFocusedElement.focus();
      lastFocusedElement.click();
    }
    if(e.key === 'Tab' && ! e.shiftKey && e.target === this.lastFocusableElement) {
      e.preventDefault();
      this.firstFocusableElement.focus();
    }
    if(e.key === 'Tab' && e.shiftKey &&  e.target === this.firstFocusableElement) {
      e.preventDefault();
      this.lastFocusableElement.focus();
    }
  }

  private renderMenuItems(
    level: number = 0,
    options: DropdownOption[] = this._options) {
    const olClass = level === 0 ? 'menu' : 'sub-menu';
    return (
      <ol
        class={olClass}
        data-target={`menuLvl${level}`}
        ref={this.setRef}
        aria-expanded="false"
        data-level={`${level}`}
        >
        {options.map((option: DropdownOption, index: number) => {
          const firstOrLast = index === 0 ? 'first' : index === options.length - 1 ? 'last' : '';
          return (
            <li key={`li-${option}-${index}`}>
              <a
                key={`a-${option}-${index}`}
                //TODO: add ability to override href
                href=""
                data-target={option.children ? `menuLvl${level + 1}` : null}
                data-level={`${level}`}
                data-child={firstOrLast}>{option.label}</a>
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
        <div class="dropdown-container" onClick={this.handleLinkClick} onKeyDown={this.handleKeyUp}>
          <a
            id="button"
            class='select'
            href=""
            data-target="menuLvl0"
            data-level="0"
            ref={this.setRef}>Select an Option</a>
          {this.renderMenuItems()}
        </div>
      </Host>
    );
  }

}
