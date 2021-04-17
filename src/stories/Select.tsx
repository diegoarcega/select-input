import './select.scss';

export interface SelectProps {
  onChange: () => void;
}

export const SelectInput = ({ onChange }: SelectProps):JSX.Element  => {
  return <div className="select-container">hello world</div>
}
