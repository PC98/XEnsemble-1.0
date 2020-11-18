import React, { forwardRef } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DropdownInput from "./DropdownInput";

interface Props {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  models: string[];
  labels: string[] | Promise<string[]>;
}

const useStyles = makeStyles({
  container: {
    padding: 20,
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
    marginTop: -12,
    marginBottom: -12,
  },
  button: {
    marginTop: 12,
    marginBottom: 12,
  },
  rightMargin: {
    marginRight: 8,
  },
});

const InputForm = forwardRef<HTMLFormElement, Props>(
  ({ onSubmit, isLoading, models, labels }, ref) => {
    const { container, form, button, rightMargin } = useStyles();

    return (
      <div className={container}>
        <form className={form} ref={ref} onSubmit={onSubmit}>
          <DropdownInput
            label="Model"
            helperText="Trained model on which the attack will run."
            options={models}
            shoulSortOptions
          />
          <DropdownInput
            label="Label"
            helperText="Class label of the random image to attack."
            options={labels}
          />
          <Button
            className={button}
            variant="contained"
            type="submit"
            color="primary"
            disabled={isLoading}
          >
            {isLoading && (
              <CircularProgress
                className={rightMargin}
                color="inherit"
                size={16}
              />
            )}
            Submit
          </Button>
        </form>
      </div>
    );
  }
);

export default InputForm;
