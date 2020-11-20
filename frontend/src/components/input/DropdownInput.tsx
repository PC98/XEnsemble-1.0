import React from "react";
import TextFieldInput from "./TextFieldInput";
import Autocomplete from "@material-ui/lab/Autocomplete";

type Props = React.ComponentProps<typeof TextFieldInput> & {
  options: string[];
  shouldSortOptions?: boolean;
};

const DropdownInput: React.FC<Props> = ({
  options,
  defaultValue,
  shouldSortOptions = false,
  ...rest
}) => {
  return (
    <Autocomplete
      openOnFocus
      defaultValue={defaultValue}
      options={shouldSortOptions ? [...options].sort() : options}
      renderInput={(params) => <TextFieldInput {...params} {...rest} />}
    />
  );
};

export default DropdownInput;
