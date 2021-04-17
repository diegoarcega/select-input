import { useState } from 'react';
import { SelectInput, Option } from './stories/Select';
import emails from './stories/email-options';
import { useQuery } from 'react-query';
import './App.css';

function App() {
  const [value] = useState();
  const { data, isLoading } = useQuery<Option[]>('emails', async () => {
    const emails = await fetchEmails();
    return emails.map((email) => ({ label: email, value: email }));
  });

  function handleChange(value: any) {
    console.log(value);
    // setValue(value);
  }

  function fetchEmails(): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000, emails);
    });
  }

  return (
    <div className="App">
      <SelectInput
        onChange={handleChange}
        options={data}
        isLoading={isLoading}
        defaultValue={value}
        placeholder="Enter recipients"
        valueValidator={validateEmail}
      />
    </div>
  );
}

function validateEmail(email: string): boolean {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export default App;
