import React, { forwardRef, useCallback, useState } from "react";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DropdownInput from "./DropdownInput";
import AttackParametersInput from "./AttackParametersInput";
import BooleanInput from "./BooleanInput";
import TextFieldInput from "./TextFieldInput";
import { IndexRouteLocationState } from "../../utils/types";
import { ATTACK_OBJ, ATTACK } from "../../utils/data";

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
    padding: 32,
    flexDirection: "column",
  },
  spinner: {
    padding: 5,
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
  attackInput: {
    width: "33%",
    minWidth: 416,
  },
});

const InputForm = forwardRef<HTMLFormElement, Props>(
  ({ onSubmit, isLoading, models, labels, indexRouteLocationState }, ref) => {
    const {
      container,
      spinner,
      inputContainer,
      bottomCentered,
      rightMargin,
      attackInput,
    } = useStyles();

    const [selectedAttack, setSelectedAttack] = useState<ATTACK | null>(null);

    const onAttackSelect = useCallback((value: string | null) => {
      setSelectedAttack(value as ATTACK | null);
    }, []);

    return (
      <form className={container} ref={ref} onSubmit={onSubmit}>
        <div className={inputContainer}>
          <DropdownInput
            label="Model"
            helperText="Trained model on which the attack will run."
            defaultValue={indexRouteLocationState?.selectedModel}
            options={models}
            shouldSortOptions
          />
        </div>
        <div className={inputContainer}>
          <div className={rightMargin}>
            <DropdownInput
              label="Label"
              helperText="Class label of the images to attack."
              options={labels}
            />
          </div>
          <TextFieldInput
            label="Number"
            helperText="Number of images to attack."
            defaultValue={1}
            inputProps={{ min: 1, max: 5 }}
            type="number"
          />
        </div>
        <div className={inputContainer}>
          <BooleanInput label="Random" helperText="Select images randomly" />
        </div>
        <div className={attackInput}>
          <DropdownInput
            label="Attack"
            fullWidth
            helperText="Choose the attack algorithm to run."
            options={Object.keys(ATTACK_OBJ)}
            onValueSelect={onAttackSelect}
          />
        </div>
        {selectedAttack != null && (
          <AttackParametersInput attackInfo={ATTACK_OBJ[selectedAttack]} />
        )}
        <div className={clsx(inputContainer, bottomCentered)}>
          <Button
            size="large"
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
        </div>
      </form>
    );
  }
);

export default InputForm;
