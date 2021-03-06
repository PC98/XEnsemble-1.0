import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles({
  container: {
    marginTop: 4,
    marginBottom: 4,
  },
});

interface Props {
  label: string;
  helperText: string;
  defaultChecked: boolean;
}

const BooleanInput: React.FC<Props> = ({
  label,
  helperText,
  defaultChecked,
}) => {
  const { container } = useStyles();

  return (
    <FormControlLabel
      classes={{ root: container }}
      control={
        <>
          <Switch
            defaultChecked={defaultChecked}
            name={label}
            color="primary"
            value="true"
          />
          <input name={label} type="hidden" value="false"></input>
        </>
      }
      label={helperText}
    />
  );
};

export default BooleanInput;
