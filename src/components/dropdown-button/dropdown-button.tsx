import { Component, Host, h } from '@stencil/core';

export interface DropdownButtonProps {
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
  options: string[] = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];
  refs: {[x: string]: HTMLElement} = {};;

  private setRef(el) {
    el.addEventListener('click', this.handleLinkClick)
    this.refs = { ...this.refs, [el.id]: el };
  }

  private handleLinkClick(e) {
    e.preventDefault();
    let refId = e.target.getAttribute('href');
    if (!refId || refId.at(0) !== "#") return;
    refId = refId.substring(1, refId.length);
    const target = this.refs[refId];
    if (target.getAttribute('aria-expanded') === 'false') {
      target.setAttribute('aria-expanded', 'true');
    } else {
      target.setAttribute('aria-expanded', 'false');
    }
  }

  // private renderMenuItems() {
  //   return this.options.map((option) => {
  //     return <li>{option}</li>;
  //   });
  // }

  render() {
    return (
      <Host>
        <div class="dropdown-container">
          <a id="button" class='select' href='#menuLvl1' ref={this.setRef}>Select an Option</a>
          <ol id="menuLvl1" class="menu" aria-expanded="false" ref={this.setRef}>
            {/* {this.renderMenuItems()} */}
            <li><a href="">option 1</a></li>
            <li><a href="">option 2</a></li>
            <li><a href="#menuLvl2">option 3</a>
              <ol id="menuLvl2" class="sub-menu" aria-expanded="false" ref={this.setRef}>
                <li><a href="">option 1</a></li>
                <li><a href="">option 2</a></li>
                <li><a href="">option 3</a></li>
              </ol>
            </li>
            <li><a href="">option 4</a></li>
          </ol>
        </div>
      </Host>
    );
  }

}
