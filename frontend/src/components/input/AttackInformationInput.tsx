import React, { useCallback, useState, useRef } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DropdownInput from "./DropdownInput";
import AttackParametersInput from "./AttackParametersInput";
import { IndexRouteLocationState } from "../../utils/types";
import { ATTACK_OBJ, ATTACK } from "../../utils/data";

const useStyles = makeStyles({
  attackInput: {
    width: "33%",
    minWidth: 416,
  },
});

interface Props {
  indexRouteLocationState?: IndexRouteLocationState;
}

const AttackInformationInput: React.FC<Props> = ({
  indexRouteLocationState,
}) => {
  const { attackInput } = useStyles();

  const shouldUseLocationStateForAttackParameters = useRef(
    indexRouteLocationState != null
  );

  const [selectedAttack, setSelectedAttack] = useState(
    indexRouteLocationState?.Attack as ATTACK | undefined
  );

  const onAttackSelect = useCallback((value: string | null) => {
    shouldUseLocationStateForAttackParameters.current = false;
    // @ts-ignore
    setSelectedAttack(value ?? undefined);
  }, []);

  return (
    <>
      <div className={attackInput}>
        <DropdownInput
          label="Attack"
          fullWidth
          helperText="Choose the attack algorithm to run."
          options={Object.keys(ATTACK_OBJ)}
          onValueSelect={onAttackSelect}
          defaultValue={indexRouteLocationState?.Attack}
        />
      </div>
      {selectedAttack != null && (
        <AttackParametersInput
          attackInfo={ATTACK_OBJ[selectedAttack]}
          indexRouteLocationState={indexRouteLocationState}
          shouldUseLocationState={
            shouldUseLocationStateForAttackParameters.current
          }
        />
      )}
    </>
  );
};

export default AttackInformationInput;
