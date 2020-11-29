import React, { forwardRef } from "react";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DropdownInput from "./DropdownInput";
import AttackInformationInput from "./AttackInformationInput";
import BooleanInput from "./BooleanInput";
import TextFieldInput from "./TextFieldInput";
import { IndexRouteLocationState } from "../../utils/types";
import { getBoolValueFromIndexRouteLocationState } from "../../utils/util";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flex: 1,
    padding: "32px 44px",
    flexDirection: "column",
  },
  spinner: {
    marginLeft: 6,
  },
  inputContainer: {
    display: "flex",
  },
  bottomCentered: {
    justifyContent: "center",
    marginTop: "auto",
  },
  rightMargin: {
    marginRight: 20,
  },
});

interface Props {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  models: string[];
  labels: string[];
  indexRouteLocationState?: IndexRouteLocationState;
}

const InputForm = forwardRef<HTMLFormElement, Props>(
  ({ onSubmit, isLoading, models, labels, indexRouteLocationState }, ref) => {
    const {
      container,
      spinner,
      inputContainer,
      bottomCentered,
      rightMargin,
    } = useStyles();

    return (
      <form className={container} ref={ref} onSubmit={onSubmit}>
        <div className={inputContainer}>
          <DropdownInput
            label="Model"
            helperText="Trained model on which the attack will run."
            defaultValue={indexRouteLocationState?.Model}
            options={models}
            shouldSortOptions
          />
        </div>
        <div className={inputContainer}>
          <div className={rightMargin}>
            <DropdownInput
              label="Label"
              helperText="Class label of the images to attack."
              defaultValue={indexRouteLocationState?.Label}
              options={labels}
            />
          </div>
          <TextFieldInput
            label="Number"
            helperText="Number of images to attack."
            defaultValue={indexRouteLocationState?.Number ?? 1}
            inputProps={{ min: 1, max: 5 }}
            type="number"
          />
        </div>
        <div className={inputContainer}>
          <BooleanInput
            label="Random"
            helperText="Select images randomly"
            defaultChecked={
              getBoolValueFromIndexRouteLocationState(
                indexRouteLocationState,
                "Random"
              ) ?? true
            }
          />
        </div>
        <AttackInformationInput
          indexRouteLocationState={indexRouteLocationState}
        />
        <div className={clsx(inputContainer, bottomCentered)}>
          <Button
            size="large"
            variant="contained"
            type="submit"
            color="primary"
            disabled={isLoading}
          >
            Submit
            {isLoading && (
              <CircularProgress className={spinner} color="inherit" size={16} />
            )}
          </Button>
        </div>
      </form>
    );
  }
);

export default InputForm;
