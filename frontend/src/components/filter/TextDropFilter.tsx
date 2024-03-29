import React, { useState } from 'react';
import { TextDropFilterProps } from './TextDropFilterProps';

const TextDropFilter = ({
    label,
    options,
    onSelect
}: TextDropFilterProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const filteredOptions = options.filter(
    option => option.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (option: string) => {
    setInputValue(option);
    onSelect(option);
    setIsOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col">
      <div className="text-black">
        {label}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type to search..."
        className=' border-1 border-gray-400'
        required
      />
      {isOpen && (
        <div className="z-30">
          {filteredOptions.map((option) => (
            <div
            key={option}
            className=""
            onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextDropFilter;