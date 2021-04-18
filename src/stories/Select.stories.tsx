import { Story, Meta } from '@storybook/react';
import mockEmails from './email-options';
import App from '../App';

import { SelectInput, SelectProps } from './Select';

export default {
  title: 'Example/SelectInput',
  component: SelectInput,
} as Meta;

const TemplateFull = () => <App />;
const Template: Story<SelectProps> = (args) => <SelectInput {...args} />;

export const FullUsage = TemplateFull.bind({});

export const Loading = Template.bind({});
Loading.args = {
  onChange: console.log,
  placeholder: 'Enter recipients',
  isLoading: true,
};

export const EmptyNoValidation = Template.bind({});
EmptyNoValidation.args = {
  onChange: console.log,
  placeholder: 'Enter recipients',
};

export const WithValidator = Template.bind({});
WithValidator.args = {
  onChange: console.log,
  placeholder: 'Enter recipients',
  valueValidator: function validateEmail(email: string): boolean {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  },
};

export const WithOptions = Template.bind({});
WithOptions.args = {
  onChange: console.log,
  placeholder: 'Enter recipients',
  options: mockEmails.map((email) => ({ label: email, value: email })),
};

export const WithError = Template.bind({});
WithError.args = {
  onChange: console.log,
  placeholder: 'Enter recipients',
  options: mockEmails.map((email) => ({ label: email, value: email })),
  defaultValue: [
    {
      label: 'somebody@google.com',
      value: 'somebody@google.com',
    },
    {
      label: 'anything',
      value: 'anything',
      isError: true,
    },
    {
      label: 'any',
      value: 'any',
      isError: true,
    },
  ],
};

export const ManyValues = Template.bind({});
ManyValues.args = {
  onChange: console.log,
  placeholder: 'Enter recipients',
  options: mockEmails.map((email) => ({ label: email, value: email })),
  defaultValue: [
    {
      label: 'somebody@google.com',
      value: 'somebody@google.com',
    },
    {
      label: 'john@google.com',
      value: 'john@google.com',
    },
    {
      label: 'roberta@google.com',
      value: 'roberta@google.com',
    },
    {
      label: 'kennedy@google.com',
      value: 'kennedy@google.com',
    },
    {
      label: 'joseph@google.com',
      value: 'joseph@google.com',
    },
    {
      label: 'patricia@google.com',
      value: 'patricia@google.com',
    },
    {
      label: 'tim@google.com',
      value: 'tim@google.com',
    },
    {
      label: 'peter@google.com',
      value: 'peter@google.com',
    },
  ],
};
