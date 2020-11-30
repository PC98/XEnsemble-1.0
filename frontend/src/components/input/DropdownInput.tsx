import React from "react";
import TextFieldInput from "./TextFieldInput";
import Autocomplete from "@material-ui/lab/Autocomplete";

type Props = React.ComponentProps<typeof TextFieldInput> & {
  options: string[];
  shouldSortOptions?: boolean;
  disableClearable?: boolean;
  onValueSelect?: (value: string | null) => void;
};

const DropdownInput: React.FC<Props> = ({
  options,
  defaultValue,
  onValueSelect,
  disableClearable,
  shouldSortOptions = false,
  ...rest
}) => {
  return (
    <Autocomplete
      openOnFocus
      disableClearable={disableClearable}
      onChange={(_, value) => {
        onValueSelect && onValueSelect(value as string | null);
      }}
      defaultValue={defaultValue}
      options={shouldSortOptions ? [...options].sort() : options}
      renderInput={(params) => <TextFieldInput {...params} {...rest} />}
    />
  );
};

export default DropdownInput;
