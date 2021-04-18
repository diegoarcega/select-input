import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectInput } from './Select';

describe('Select Input', () => {
  const props = {
    onChange: jest.fn(),
    onInputChange: jest.fn(),
    valueValidator: function validateEmail(email: string): boolean {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
    },
    options: [{ label: 'john@google.com', value: 'john@google.com' }],
    placeholder: 'Enter recipients',
    noResults: 'No result was found',
    isLoading: false,
  };

  it('should match snapshot component', () => {
    const { container } = render(<SelectInput {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('should allow adding a value', () => {
    const { getByPlaceholderText, queryByText } = render(<SelectInput {...props} />);
    expect(queryByText('fake@email.com')).not.toBeInTheDocument();
    userEvent.type(getByPlaceholderText('Enter recipients'), 'fake@email.com{enter}');
    expect(queryByText('fake@email.com')).toBeInTheDocument();
  });

  it('should allow removing a value', () => {
    const newProps = {
      ...props,
      defaultValue: [{ value: 'fake@email.com', label: 'fake@email.com ' }],
    };
    const { getByTestId, queryByText } = render(<SelectInput {...newProps} />);
    expect(queryByText('fake@email.com')).toBeInTheDocument();
    userEvent.click(getByTestId('remove-value-fake@email.com'));
    expect(queryByText('fake@email.com')).not.toBeInTheDocument();
  });

  it('should show loading state', () => {
    const newProps = {
      ...props,
      isLoading: true,
    };
    const { getByTestId } = render(<SelectInput {...newProps} />);
    expect(getByTestId('select-loading')).toBeInTheDocument();
  });

  it('should show error', () => {
    const newProps = {
      ...props,
      defaultValue: [{ value: 'fake.com', label: 'fake.com ', isError: true }],
    };
    const { getByTestId } = render(<SelectInput {...newProps} />);
    expect(getByTestId('select-value-error-fake.com')).toBeInTheDocument();
  });

  it('should trigger input text change', () => {
    const { getByPlaceholderText } = render(<SelectInput {...props} />);
    userEvent.type(getByPlaceholderText('Enter recipients'), 'fake@email.com');
    expect(props.onInputChange).toHaveBeenCalled();
  });

  it('should load static options', () => {
    const { getByPlaceholderText, getByTestId } = render(<SelectInput {...props} />);
    userEvent.type(getByPlaceholderText('Enter recipients'), 'john');
    expect(getByTestId('select-results-john@google.com')).toBeInTheDocument();
  });

  it('should validate value if it is an email', () => {
    const { getByPlaceholderText, getByTestId } = render(<SelectInput {...props} />);
    userEvent.type(getByPlaceholderText('Enter recipients'), 'john{enter}');
    expect(getByTestId('select-value-error-john')).toBeInTheDocument();
  });
});
