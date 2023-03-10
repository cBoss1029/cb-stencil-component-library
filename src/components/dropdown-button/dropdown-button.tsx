import { Component, Host, h, Prop, Watch } from '@stencil/core';
import ChevronDown from '../../assets/chevron-down.svg';

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
  firstFocusableElement: HTMLElement;
  lastFocusableElement: HTMLElement;
  outsideClickHandler: EventListener;

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
    this.outsideClickHandler = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement) {
        if (!e.target.closest('dropdown-button')) {
          for(let key in this.refs) {
            this.refs[key].setAttribute('aria-expanded', 'false');
          }

        }
      }
    }
    document.addEventListener('click', this.outsideClickHandler);
  }
  
  disconnectedCallback() {
    // clean up event listeners
    const dropdownContainer = document.querySelector('.dropdown-container');
    if (dropdownContainer) {
      dropdownContainer.removeEventListener('click', this.handleLinkClick, {});
    }
    document.removeEventListener('click', this.outsideClickHandler);
  }

  private setRef(el: HTMLElement) {
    const { destination } = el.dataset;
    this.refs = { ...this.refs, [destination]: el };
  }

  private handleLinkClick(e: MouseEvent) {
    e.preventDefault();
    // TODO: not sure if this is the proper type guard for this event
    if (e.target instanceof HTMLElement) {
      let isGoingBack = false;
      let refId = e.target.dataset.destination;
      if (!refId) return;
      // The list element targeted by the element that was clicked
      let destinationElement = this.refs[refId];
      let oldTarget = this.refs[refId];

      const lastElementInHistory = this.history[this.history.length - 1];
      // if last element in history is a level deeper than the current element, we know we're going back
      if (lastElementInHistory && lastElementInHistory.level === parseInt(e.target.dataset.level) + 1) {
        isGoingBack = true;
        destinationElement = this.refs[`menuLvl${e.target.dataset.level}`];
      }
      // these will be used to trap focus within the menu
      this.firstFocusableElement = destinationElement.querySelector(`[data-child="first"][data-level="${destinationElement.dataset.level}"]`);
      this.lastFocusableElement = destinationElement.querySelector(`[data-child="last"][data-level="${destinationElement.dataset.level}"]`);
      if (destinationElement.getAttribute('aria-expanded') === 'false') {
        // add to history
        this.history.push({
          level: parseInt(destinationElement.dataset.level),
          element: e.target
        });
        destinationElement.setAttribute('aria-expanded', 'true');
        this.firstFocusableElement.focus();
      } else {
        if (isGoingBack) {
          oldTarget.setAttribute('aria-expanded', 'false');
        }
        if (!isGoingBack) {
          destinationElement.setAttribute('aria-expanded', 'false');
        }
        this.history.pop();
      }
    }
  }

  findLastFocusedElement() {
    if (this.history.length > 0) {
      const element = this.history[this.history.length - 1].element;
      return element;
    }
    return null;
  }

  handleKeyUp(e: KeyboardEvent) {
    const escapeKeyValues = ['Escape', 'Esc'];
    // back out a level if escape is pressed
    if (escapeKeyValues.includes(e.key)) {
      const lastFocusedElement = this.findLastFocusedElement();
      if (!lastFocusedElement) return;
      lastFocusedElement.focus();
      lastFocusedElement.click();
    }
    if (e.key === 'Tab' && !e.shiftKey && e.target === this.lastFocusableElement) {
      e.preventDefault();
      this.firstFocusableElement.focus();
    }
    if (e.key === 'Tab' && e.shiftKey && e.target === this.firstFocusableElement) {
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
        data-destination={`menuLvl${level}`}
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
                aria-haspopup={option.children ? 'true' : 'false'}
                data-destination={option.children ? `menuLvl${level + 1}` : null}
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
          <button
            id="button"
            class='select'
            type='button'
            data-destination="menuLvl0"
            data-level="0"
            ref={this.setRef}
            aria-haspopup="true">Select an Option <img class="icon" alt="" src={ChevronDown}></img></button>
          {this.renderMenuItems()}
        </div>
      </Host>
    );
  }

}
