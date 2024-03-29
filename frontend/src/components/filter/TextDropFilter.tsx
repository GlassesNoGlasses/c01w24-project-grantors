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
    setIsOpen(event.target.value != '');
  };

  return (
    <div className="flex flex-col">
      <div className="text-black font-bold">
        {label}
      </div>
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type to search..."
          className=' border-2 border-gray-500 p-2 rounded-md w-[30vw]'
          required
        />

      {isOpen && (
          <div className='absolute w-[30vw]'>
            {filteredOptions.map((option) => (
              <div
              key={option}
              className="bg-gray-200 hover:bg-gray-300 p-1"
              onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    
    </div>
  );
};

export default TextDropFilter;