import { Badge } from "@/components/ui/badge";
import { X, Search } from "lucide-react";
import { useState } from "react";

const MultipleSelector = ({
  value = [],
  onChange,
  placeholder = "Search and select...",
  defaultOptions = [],
  emptyIndicator = "No options found",
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleUnselect = (option) => {
    onChange(value.filter((s) => s.value !== option.value));
  };

  const handleSelect = (option) => {
    onChange([...value, option]);
    setInputValue("");
  };

  // Filter options based on search input and exclude already selected
  const selectables = defaultOptions.filter((option) => {
    const isNotSelected = !value.some((s) => s.value === option.value);
    const matchesSearch =
      inputValue === "" ||
      option.label.toLowerCase().includes(inputValue.toLowerCase());
    return isNotSelected && matchesSearch;
  });

  return (
    <div className={`w-full ${className}`}>
      {/* Selected Items Display */}
      {value.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-2">
          {value.map((option) => (
            <Badge
              key={option.value}
              variant="secondary"
              className="bg-[#8417ff] hover:bg-[#741bda] text-white text-sm px-3 py-1.5 flex items-center gap-1"
            >
              {option.label}
              <button
                className="ml-1 ring-offset-background rounded-full outline-none hover:bg-white/20 p-0.5"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUnselect(option);
                }}
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            // Prevent form submission on Enter
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
              // If there's exactly one result, select it
              if (selectables.length === 1) {
                handleSelect(selectables[0]);
              }
            }
            // Close dropdown on Escape
            if (e.key === "Escape") {
              setOpen(false);
              e.target.blur();
            }
          }}
          placeholder={placeholder}
          className="w-full bg-[#2a2b33] border border-[#2f303b] rounded-md pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#8417ff] transition-colors"
        />
      </div>

      {/* Dropdown List */}
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute w-full z-20 mt-2 rounded-md border border-[#2f303b] bg-[#2a2b33] shadow-xl max-h-64 overflow-y-auto">
            {selectables.length > 0 ? (
              <div className="py-1">
                {selectables.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className="px-4 py-2.5 cursor-pointer hover:bg-[#3a3b43] text-white text-sm transition-colors flex items-center justify-between group"
                  >
                    <span>{option.label}</span>
                    <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to add
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 text-sm">
                {inputValue ? `No results for "${inputValue}"` : emptyIndicator}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MultipleSelector;
