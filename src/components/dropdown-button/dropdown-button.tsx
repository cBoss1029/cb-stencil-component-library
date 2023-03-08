import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'dropdown-button',
  styleUrl: 'dropdown-button.css',
  shadow: true,
})
export class DropdownButton {
  options: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];

  renderMenuItems() {
    this.options.map((option) => {
      return <li>{option}</li>;
    });
  }

  render() {
    return (
      <Host>
        <button>Select an Option</button>
        <ol class="menu">
          {this.renderMenuItems()}
        </ol>
        <slot></slot>
      </Host>
    );
  }

}
