import React, { ChangeEvent, useState } from 'react';
import { SelectInput, Option } from './stories/Select';
import emails from './stories/email-options';
import { useQuery } from 'react-query';
import { QueryClient, QueryClientProvider } from 'react-query';
import debounceFn from 'debounce-fn';

const queryClient = new QueryClient();

function App() {
  const [value, setValue] = useState<Option[]>();
  const [inputTextValue, setInputTextValue] = useState('');
  // requests with the same term are cached with react-query
  const { data, isLoading } = useQuery<Option[]>(['emails', inputTextValue], async () => {
    const emails = await fetchEmails(inputTextValue);
    return emails.map((email) => ({ label: email, value: email }));
  });

  function handleChange(value: Option[]) {
    setValue(value);
  }

  function fetchEmails(term: string): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(
        resolve,
        1000,
        emails.filter((email) => email.includes(term))
      );
    });
  }

  const debouncedHandleInputChange = debounceFn(
    (event: ChangeEvent<HTMLInputElement>) => {
      setInputTextValue(event.target.value);
    },
    { wait: 600 }
  );

  return (
    <React.Fragment>
      <SelectInput
        onChange={handleChange}
        onInputChange={debouncedHandleInputChange}
        options={data}
        isLoading={isLoading}
        defaultValue={value}
        placeholder="Enter recipients"
        valueValidator={validateEmail}
        noResults="No email was found with this term"
      />
      <small>
        <p>App State</p>
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </small>
    </React.Fragment>
  );
}

function validateEmail(email: string): boolean {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

const AppWrapped = () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
export default AppWrapped;
