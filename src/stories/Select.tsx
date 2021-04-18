import React, { ChangeEvent, useState, useEffect, useRef } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { AiFillExclamationCircle } from 'react-icons/ai';
import { ClassicSpinner } from 'react-spinners-kit'; // bloated lib, but used to be quick for the test
import './select.scss';
export interface Option {
  label: string;
  value: any;
  isError?: boolean;
}

export interface SelectProps {
  onChange: (value: any) => void;
  onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  valueValidator?: (value: any) => boolean;
  options?: Option[];
  defaultValue?: Option[];
  placeholder?: string;
  noResults?: React.ReactNode;
  isLoading?: boolean;
}

interface OptionsMenuType extends Pick<SelectProps, 'options' | 'noResults'> {
  onOptionSelected: (option: Option) => () => void;
  showNoResults: boolean;
}
const OptionsMenu = ({ options = [], onOptionSelected, noResults, showNoResults }: OptionsMenuType) => {
  if (!options.length && !showNoResults) {
    return null;
  }

  if (!options.length) {
    return <div className="select-options-results">{noResults || 'No results'}</div>;
  }

  return (
    <ul className="select-options-results">
      {options.map((option) => (
        <li key={option.label} onClick={onOptionSelected(option)}>
          {option.label}
        </li>
      ))}
    </ul>
  );
};

const SelectedValues = ({
  values,
  onRemove,
}: {
  values: Option[];
  onRemove: (value: Pick<Option, 'value'>) => () => void;
}) => {
  return (
    <React.Fragment>
      {values.map((value) => {
        const className = `select-value${value.isError ? ' error' : ''}`;
        const Icon = value.isError ? AiFillExclamationCircle : IoCloseOutline;
        const iconColor = value.isError ? '#EE515F' : 'inherit';
        const iconSize = value.isError ? '18px' : '20px';
        return (
          <div className={className} key={value.label} onClick={value.isError ? onRemove(value.value) : undefined}>
            <span>{value.label}</span>
            <Icon color={iconColor} size={iconSize} onClick={onRemove(value.value)} />
          </div>
        );
      })}
    </React.Fragment>
  );
};

export const SelectInput = ({
  onChange,
  onInputChange,
  options,
  defaultValue,
  placeholder,
  noResults,
  valueValidator,
  isLoading,
}: SelectProps): JSX.Element => {
  const [values, setValues] = useState<Option[]>(defaultValue || []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inputTextValue, setInputTextValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    setInputTextValue(event.target.value);

    if (onInputChange) {
      onInputChange(event);
    }

    if (event.target.value.length > 0 && !isMenuOpen) {
      setIsMenuOpen(true);
    }

    if (event.target.value.length === 0 && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }

  function handleRemoveValue(valueToBeRemoved: Pick<Option, 'value'>) {
    return function () {
      const newValue = values.filter((value) => value.value !== valueToBeRemoved);
      setValues(newValue);
      setInputTextValue('');
    };
  }

  function handleOptionSelected(option: Option) {
    return function () {
      const newValue = [...values, option];
      setValues(newValue);
      setInputTextValue('');
      setIsMenuOpen(false);
      inputRef.current?.focus();
    };
  }

  // event listeners
  useEffect(() => {
    const inputReference = inputRef.current;
    if (!inputReference) {
      return;
    }

    inputReference.addEventListener('keyup', handleKeyup);

    function handleKeyup(event: KeyboardEvent) {
      event.preventDefault();

      // TODO: Tab needs adjustments, it is only selecting after navigating all other options first
      if (['Enter', 'Tab'].includes(event.key)) {
        // if empty value, don't add the option
        if (!inputTextValue.trim()) {
          setInputTextValue('');
          setIsMenuOpen(false);
          return;
        }

        // TODO: when the user clicks ENTER it should select the first item of the list if the term typed is in the first item
        setValues((values) => [
          ...values,
          { label: inputTextValue, value: inputTextValue, isError: valueValidator && !valueValidator(inputTextValue) },
        ]);

        setInputTextValue('');
        setIsMenuOpen(false);
      }
    }

    return () => {
      if (!inputReference) {
        return;
      }

      inputReference.removeEventListener('keyup', handleKeyup);
    };
  }, [inputTextValue, valueValidator]);

  // when internal values change, trigger outside onChange
  useEffect(() => {
    onChange(values);
  }, [values, onChange]);

  return (
    <div className="select-container">
      <div className="select-value-input-container">
        {Array.isArray(values) && <SelectedValues values={values} onRemove={handleRemoveValue} />}
        <input
          className="select-input"
          type="text"
          value={inputTextValue}
          placeholder={isLoading ? 'loading...' : placeholder}
          onChange={handleInputChange}
          ref={inputRef}
        />
      </div>

      <div className="select-loading">{isLoading && <ClassicSpinner size={18} color="silver" />}</div>

      {isMenuOpen && (
        <OptionsMenu
          options={filterOptions(inputTextValue, options, values)}
          onOptionSelected={handleOptionSelected}
          noResults={noResults}
          showNoResults={!isLoading}
        />
      )}
    </div>
  );
};

// should not show selected options
function filterOptions(inputTextValue: string, options?: Option[], values?: Option[]) {
  return options?.filter((option) => {
    if (values?.some((value) => value.value === option.value)) {
      return false;
    }
    return true;
  });
}
