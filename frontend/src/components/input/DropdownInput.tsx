import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
  container: {
    marginTop: 12,
    marginBottom: 12,
  },
  formHelperTextRoot: {
    marginLeft: 2,
  },
});

type Props = React.ComponentProps<typeof TextField> & {
  options: string[] | Promise<string[]>;
  shoulSortOptions?: boolean;
};

const DropdownInput: React.FC<Props> = ({
  options,
  shoulSortOptions = false,
  ...rest
}) => {
  const { container, formHelperTextRoot } = useStyles();
  const [optionsToUse, setOptionsToUse] = useState(
    Array.isArray(options) ? options : []
  );

  useEffect(() => {
    const loadOptions = async () => {
      if (!Array.isArray(options)) {
        setOptionsToUse(await options);
      }
    };

    loadOptions();
  }, [options]);

  return (
    <Autocomplete
      className={container}
      openOnFocus
      options={shoulSortOptions ? [...optionsToUse].sort() : optionsToUse}
      renderInput={(params) => (
        <TextField
          {...params}
          required
          variant="outlined"
          name={rest.label as string}
          FormHelperTextProps={{ classes: { root: formHelperTextRoot } }}
          {...rest}
        />
      )}
    />
  );
};

export default DropdownInput;
