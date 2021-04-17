import React from 'react';
import { Story, Meta } from '@storybook/react';

import { SelectInput, SelectProps  } from './Select';

export default {
  title: 'Example/SelectInput',
  component: SelectInput,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

const Template: Story<SelectProps> = (args) => <SelectInput {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  onChange: () => null,
};
