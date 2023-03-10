import { DropdownButtonProps } from "./dropdown-button";
import { Story } from "@storybook/html";

export default {
  // this creates a ‘Components’ folder and a ‘MyComponent’ subfolder
  title: 'Components/DropdownButton',
};

// Note to self: don't use double quotes when passing a json string to the component
// Another note - outside click handler behaves weirdly when isolated in storybook so a wrapper div is needed
const Template: Story<DropdownButtonProps> = (args) => `
<div style="width: 100%; height: 600px; border: 2px solid blue; display: flex; flex-direction: column; justify-content: center; align-items: center">
  <dropdown-button options='${JSON.stringify(args.options)}'></dropdown-button>
</div>`;
export const Example = Template.bind({});

Example.args = {
  options: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2', children: [
      { label: 'Option 2.1', value: 'option2.1' },
      { label: 'Option 2.2', value: 'option2.2', children: [
        { label: 'Option 2.2.1', value: 'option2.2.1' },
        { label: 'Option 2.2.2', value: 'option2.2.2', children: [
          { label: 'Option uhhhh'}
        ] }
      ] }
    ] },
    { label: 'Option 3', value: 'option3' }
  ]
};