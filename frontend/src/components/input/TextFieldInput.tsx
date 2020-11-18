import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles({
  container: {
    marginTop: 8,
    marginBottom: 8,
  },
  formHelperTextRoot: {
    marginLeft: 2,
  },
});

const TextFieldInput: React.FC<React.ComponentProps<typeof TextField>> = (
  props
) => {
  const { container, formHelperTextRoot } = useStyles();

  return (
    <TextField
      classes={{ root: container }}
      required
      variant="outlined"
      name={props.label as string}
      FormHelperTextProps={{ classes: { root: formHelperTextRoot } }}
      {...props}
    />
  );
};

export default TextFieldInput;
