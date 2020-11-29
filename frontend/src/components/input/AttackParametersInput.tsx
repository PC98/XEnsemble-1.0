import React, { useState, useCallback, useRef } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DropdownInput from "./DropdownInput";
import TextFieldInput from "./TextFieldInput";
import BooleanInput from "./BooleanInput";
import { AttackInformation } from "../../utils/types";
import { TARGETED_TYPES } from "../../utils/data";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { IndexRouteLocationState } from "../../utils/types";
import {
  getBoolValueFromIndexRouteLocationState,
  getOptionalValueFromIndexRouteLocationState,
} from "../../utils/util";

const useStyles = makeStyles({
  columnContainer: {
    display: "flex",
    flexDirection: "column",
  },
  text: {
    marginTop: 8,
    marginBottom: 4,
  },
  bottomMargin: {
    marginBottom: 8,
  },
  rowContainer: {
    display: "flex",
    flexWrap: "wrap",
    marginLeft: -10,
    marginRight: -10,
  },
  item: {
    marginLeft: 10,
    marginRight: 10,
  },
  targetInputContainer: {
    width: "15%",
    minWidth: 180,
  },
  buttonContainer: {
    display: "flex",
    marginTop: 8,
    marginBottom: 20,
  },
});

interface Props {
  attackInfo: AttackInformation;
  shouldUseLocationState: boolean;
  indexRouteLocationState?: IndexRouteLocationState;
}

const AttackTargetInput: React.FC<{
  required?: boolean;
  defaultValue?: string;
}> = ({ defaultValue, required = false }) => {
  const { targetInputContainer, bottomMargin, columnContainer } = useStyles();

  return (
    <div className={columnContainer}>
      <Typography classes={{ root: bottomMargin }}>
        {required
          ? "This is a targeted attack, please choose a targeting stratergy:"
          : "You may choose to run a targeted version of this attack:"}
      </Typography>
      <DropdownInput
        classes={{ root: targetInputContainer }}
        label="Target"
        helperText="Targeting strategy"
        options={Object.keys(TARGETED_TYPES)}
        required={required}
        defaultValue={defaultValue}
      />
    </div>
  );
};

const AttackParametersInput: React.FC<Props> = ({
  attackInfo,
  shouldUseLocationState: parentValue,
  indexRouteLocationState,
}) => {
  const {
    columnContainer,
    rowContainer,
    text,
    item,
    buttonContainer,
  } = useStyles();
  const userHasClickedButton = useRef(false);
  const [binaryValue, setBinaryValue] = useState(true);
  const forceUpdate = useCallback(() => {
    userHasClickedButton.current = true;
    setBinaryValue((s) => !s);
  }, []);
  const shouldUseLocationState = parentValue && !userHasClickedButton.current;

  const dropdownInputs: JSX.Element[] = [];
  const booleanInputs: JSX.Element[] = [];
  const numberInputs: JSX.Element[] = [];

  Object.entries(attackInfo.parameters).forEach(([label, parameter]) => {
    let defaultValue;
    if (shouldUseLocationState) {
      if (parameter.type === "boolean") {
        defaultValue = getBoolValueFromIndexRouteLocationState(
          indexRouteLocationState!,
          label
        )!;
      } else {
        defaultValue = indexRouteLocationState![label];
      }
    } else {
      defaultValue = parameter.defaultValue;
    }
    switch (parameter.type) {
      case "dropdown":
        dropdownInputs.push(
          <div className={item} key={label}>
            <DropdownInput
              label={label}
              helperText={parameter.helperText}
              options={parameter.options.map((_) => _.name)}
              defaultValue={defaultValue}
              disableClearable
            />
          </div>
        );
        break;
      case "boolean":
        booleanInputs.push(
          <div className={item} key={label}>
            <BooleanInput
              label={label}
              helperText={parameter.helperText}
              defaultChecked={defaultValue as boolean}
            />
          </div>
        );
        break;
      case "number":
        numberInputs.push(
          <div className={item} key={label}>
            <TextFieldInput
              label={label}
              helperText={parameter.helperText}
              defaultValue={defaultValue}
              inputProps={parameter.inputProps}
              type="number"
            />
          </div>
        );
        break;
      default: {
        const _exhaustiveCheck: never = parameter;
        return _exhaustiveCheck;
      }
    }
  });

  let defaultTargetedValue;
  if (shouldUseLocationState) {
    defaultTargetedValue = getOptionalValueFromIndexRouteLocationState(
      indexRouteLocationState!,
      "Target"
    );
  } else {
    defaultTargetedValue = undefined;
  }
  let targetedInput;
  switch (attackInfo.targeted) {
    case "NO":
      targetedInput = null;
      break;
    case "YES":
      targetedInput = (
        <AttackTargetInput required defaultValue={defaultTargetedValue} />
      );
      break;
    case "BOTH":
      targetedInput = <AttackTargetInput defaultValue={defaultTargetedValue} />;
      break;
    default: {
      const _exhaustiveCheck: never = attackInfo.targeted;
      return _exhaustiveCheck;
    }
  }

  return (
    <div className={columnContainer}>
      <Typography classes={{ root: text }}>Modify attack parameters</Typography>
      <div key={`${attackInfo.value}_${binaryValue}`}>
        <div className={rowContainer}>{numberInputs}</div>
        <div className={rowContainer}>{dropdownInputs}</div>
        <div className={columnContainer}>{booleanInputs}</div>
        {targetedInput}
      </div>
      <div className={buttonContainer}>
        <Button variant="outlined" color="primary" onClick={forceUpdate}>
          Restore default values
        </Button>
      </div>
    </div>
  );
};

export default AttackParametersInput;
