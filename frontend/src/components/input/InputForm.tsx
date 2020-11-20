import React, { forwardRef } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DropdownInput from "./DropdownInput";
import TextFieldInput from "./TextFieldInput";
import BooleanInput from "./BooleanInput";
import { IndexRouteLocationState } from "../../utils/types";

interface Props {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  models: string[];
  labels: string[];
  indexRouteLocationState?: IndexRouteLocationState;
}

const useStyles = makeStyles({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
  },
  form: {
    display: "flex",
    flex: 0.25,
    minWidth: 280,
    flexDirection: "column",
    justifyContent: "center",
    marginTop: -8,
    marginBottom: -8,
  },
  button: {
    marginTop: 8,
    marginBottom: 8,
  },
  spinner: {
    padding: 4,
  },
});

const InputForm = forwardRef<HTMLFormElement, Props>(
  ({ onSubmit, isLoading, models, labels, indexRouteLocationState }, ref) => {
    const { container, form, button, spinner } = useStyles();

    return (
      <div className={container}>
        <form className={form} ref={ref} onSubmit={onSubmit}>
          <DropdownInput
            label="Model"
            helperText="Trained model on which the attack will run."
            defaultValue={indexRouteLocationState?.selectedModel}
            options={models}
            shouldSortOptions
          />
          <DropdownInput
            label="Label"
            helperText="Class label of the image to attack."
            defaultValue={indexRouteLocationState?.selectedLabel}
            options={labels}
          />
          <BooleanInput label="Random" helperText="Select image randomly" />
          <TextFieldInput
            label="Attack"
            helperText="Attack string, with parameters. Specify exactly one."
            inputProps={{ pattern: "[^;]*;?[^;]*$" }} // Regex such that only at-most one semi-colon is allowed.
            defaultValue={indexRouteLocationState?.selectedAttack}
          />
          <Button
            className={button}
            variant="contained"
            type="submit"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress className={spinner} color="inherit" size={16} />
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </div>
    );
  }
);

export default InputForm;
