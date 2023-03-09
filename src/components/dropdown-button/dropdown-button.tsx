import { Component, Host, h } from '@stencil/core';

export interface DropdownButtonProps {}

@Component({
  tag: 'dropdown-button',
  styleUrl: 'dropdown-button.css',
  shadow: true,
})
export class DropdownButton {
  options: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];

  renderMenuItems() {
    return this.options.map((option) => {
      return <li>{option}</li>;
    });
  }

  render() {
    return (
      <Host>
        <div class="dropdown-container">
          <button class='select'>Select an Option</button>
          <ol class="menu" aria-expanded="false">
            {/* {this.renderMenuItems()} */}
            <li><a href="#">option 1</a></li>
            <li><a href="#">option 2</a></li>
            <li><a href="#">option 3</a>
              <ol class="sub-menu">
                <li><a href="#">option 1</a></li>
                <li><a href="#">option 2</a></li>
                <li><a href="#">option 3</a></li>
              </ol>
            </li>
            <li><a href="#">option 4</a></li>
          </ol>
        </div>
      </Host>
    );
  }

}
