import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import "./AutoComplete.css";

type AutoCompleteValueChangedEventHandler = (e: string) => void;

interface AutoCompleteProps {
  className?: string;
  onChanged?: AutoCompleteValueChangedEventHandler;
  options: string[];
  value?: string;
}

const AutoComplete: FC<AutoCompleteProps> = ({
  className,
  onChanged,
  options,
  value,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [activeOption, setActiveOption] = useState(0);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [showOptions, setShowOptions] = useState(false);
  const [userInput, setUserInput] = useState(value ?? "");

  const setSelectedOption = useCallback(
    (value: any) => {
      const selectedOption = options.find((item) => item === value);
      setUserInput(value);
      if (selectedOption) onChanged?.(selectedOption);
    },
    [onChanged, options]
  );

  const handleChange = useCallback(
    ({ currentTarget }) => {
      setShowOptions(Boolean(currentTarget.value));
      setSelectedOption(currentTarget.value);
    },
    [setSelectedOption]
  );

  const handleClick = useCallback(
    ({ currentTarget }) => {
      setShowOptions(false);
      setFilteredOptions([]);
      setActiveOption(0);
      setSelectedOption(currentTarget.innerText);
    },
    [setSelectedOption]
  );

  const handleKeyDown = useCallback(
    (e) => {
      const { keyCode } = e;
      switch (keyCode) {
        case 13:
          e.preventDefault();
          setActiveOption(0);
          setShowOptions(false);
          setSelectedOption(filteredOptions[activeOption]);
          break;
        case 38:
          e.preventDefault();
          if (activeOption === 0) return;
          setActiveOption(activeOption - 1);
          break;
        case 40:
          e.preventDefault();
          if (activeOption === filteredOptions.length - 1) return;
          setActiveOption(activeOption + 1);
          break;
      }
    },
    [activeOption, filteredOptions, setSelectedOption]
  );

  const renderHighlistedText = useCallback(
    (value: string) => (
      <div
        dangerouslySetInnerHTML={{
          __html: value.replace(
            new RegExp(userInput, "gi"),
            (str) => `<span class="highlight">${str}</span>`
          ),
        }}
      />
    ),
    [userInput]
  );

  const OptionListComponent = useMemo(
    () =>
      filteredOptions.length ? (
        <ul className="options">
          {filteredOptions.map((option, index) => (
            <li
              className={index === activeOption ? "option-active" : undefined}
              key={option}
              onClick={handleClick}
            >
              {renderHighlistedText(option)}
            </li>
          ))}
        </ul>
      ) : (
        <div className="options empty">
          <em>No options available</em>
        </div>
      ),
    [activeOption, filteredOptions, handleClick, renderHighlistedText]
  );

  useEffect(() => {
    setFilteredOptions(() => {
      const filteredOptions = options.filter((value) =>
        value.toLowerCase().includes(userInput.toLowerCase())
      );
      return filteredOptions;
    });
  }, [options, userInput]);

  const scrollIntoViewIfNeeded = useCallback((target: HTMLElement | null) => {
    if (target) {
      const container = target.parentElement;
      if (container) {
        if (target.offsetTop < container.scrollTop) {
          target.scrollIntoView();
        }
        const offsetBottom = target.offsetTop + target.offsetHeight;
        const scrollBottom = container.scrollTop + container.offsetHeight;
        if (offsetBottom > scrollBottom) {
          target.scrollIntoView(false);
        }
      }
    }
  }, []);

  useEffect(() => {
    scrollIntoViewIfNeeded(
      ref.current?.querySelector(".option-active") ?? null
    );
  }, [activeOption, scrollIntoViewIfNeeded]);

  return (
    <div ref={ref} className={`root ${className}`}>
      <input
        type="text"
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        value={userInput}
      />
      {showOptions && OptionListComponent}
    </div>
  );
};

export default AutoComplete;
