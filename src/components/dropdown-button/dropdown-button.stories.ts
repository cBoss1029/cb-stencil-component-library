import { DropdownButtonProps } from "./dropdown-button";
import { Story } from "@storybook/html";

export default {
  // this creates a ‘Components’ folder and a ‘MyComponent’ subfolder
  title: 'Components/DropdownButton',
};

const Template: Story<DropdownButtonProps> = (args) => `<dropdown-button ${args}></dropdown-button>`;
export const Example = Template.bind({});