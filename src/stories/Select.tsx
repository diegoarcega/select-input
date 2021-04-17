import React, { ChangeEvent, useState, useEffect, useRef } from 'react';
import { ImSpinner9 } from 'react-icons/im';
import { IoCloseOutline } from 'react-icons/io5';
import { AiFillExclamationCircle } from 'react-icons/ai';

import './select.scss';
export interface Option {
  label: string;
  value: any;
  isError?: boolean;
}
export interface SelectProps {
  onChange: (value: any) => void;
  onInputChange?: (value: any) => void;
  valueValidator?: (value: any) => boolean;
  options?: Option[];
  defaultValue?: Option[];
  placeholder?: string;
  noResults?: React.ReactNode;
  isLoading?: boolean;
}

interface OptionsMenu extends Pick<SelectProps, 'options' | 'noResults'> {
  onOptionSelected: (option: Option) => () => void;
}
const OptionsMenu = ({ options = [], onOptionSelected, noResults }: OptionsMenu) => {
  if (!options.length) {
    return <div className="select-options-no-results">{noResults || 'No results'}</div>;
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
    if (event.target.value.length > 1) {
      setIsMenuOpen(true);
    }
  }

  function handleRemoveValue(valueToBeRemoved: Pick<Option, 'value'>) {
    return function () {
      const newValue = values.filter((value) => value.value !== valueToBeRemoved);
      onChange(newValue);
      setValues(newValue);
      setInputTextValue('');
    };
  }

  function handleOptionSelected(option: Option) {
    return function () {
      const newValue = [...values, option];
      onChange(newValue);
      setValues(newValue);
      setInputTextValue('');
      setIsMenuOpen(false);
    };
  }

  useEffect(() => {
    if (!inputRef || !inputRef.current) {
      return;
    }

    inputRef.current.addEventListener('keyup', handleKeyup);

    function handleKeyup(event: KeyboardEvent) {
      event.preventDefault();

      // TODO: Tab needs adjustments
      if (['Enter', 'Tab'].includes(event.key)) {
        // if empty value
        if (!inputTextValue.trim()) {
          setInputTextValue('');
          setIsMenuOpen(false);
          return;
        }
        console.log(valueValidator?.(inputTextValue));
        setValues((values) => [
          ...values,
          { label: inputTextValue, value: inputTextValue, isError: !valueValidator?.(inputTextValue) },
        ]);
        setInputTextValue('');
      }
    }

    return () => {
      if (!inputRef || !inputRef.current) {
        return;
      }
      inputRef.current.removeEventListener('keyup', handleKeyup);
    };
  }, [inputRef.current, inputTextValue]);

  return (
    <div className="select-container">
      <div className="select-value-input-container">
        {Array.isArray(values) &&
          values.map((value) => {
            const className = `select-value${value.isError ? ' error' : ''}`;
            const Icon = value.isError ? AiFillExclamationCircle : IoCloseOutline;
            const iconColor = value.isError ? '#EE515F' : 'inherit';
            const iconSize = value.isError ? '18px' : '20px';
            return (
              <div
                className={className}
                key={value.label}
                onClick={value.isError ? handleRemoveValue(value.value) : undefined}
              >
                <span>{value.label}</span>
                <Icon color={iconColor} size={iconSize} onClick={handleRemoveValue(value.value)} />
              </div>
            );
          })}
        <input
          className="select-input"
          type="text"
          value={inputTextValue}
          placeholder={placeholder}
          onChange={handleInputChange}
          ref={inputRef}
        />
      </div>

      <div className="select-loading">
        <ImSpinner9 />
      </div>

      {isMenuOpen && (
        <OptionsMenu
          options={filterOptions(inputTextValue, options, values)}
          onOptionSelected={handleOptionSelected}
          noResults={noResults}
        />
      )}
    </div>
  );
};

// should not show selected options
// should filter by term
function filterOptions(inputTextValue: string, options?: Option[], values?: Option[]) {
  return options?.filter((option) => {
    if (values?.some((value) => value.value === option.value)) {
      return false;
    }
    return option.label.includes(inputTextValue);
  });
}
