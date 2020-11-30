import React, { useCallback, useState, useRef } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DropdownInput from "./DropdownInput";
import AttackParametersInput from "./AttackParametersInput";
import { UserInput } from "../../utils/types";
import { ATTACK_OBJ, ATTACK } from "../../utils/data";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  algorithmDropdown: {
    display: "flex",
  },
});

interface Props {
  indexRouteAttack?: UserInput["attacks"][number];
}

const AttackInformationInput: React.FC<Props> = ({ indexRouteAttack }) => {
  const { container, algorithmDropdown } = useStyles();

  const shouldUseLocationStateForAttackParameters = useRef(
    indexRouteAttack != null
  );

  const [selectedAttack, setSelectedAttack] = useState(
    indexRouteAttack?.algorithm as ATTACK | undefined
  );

  const onAttackSelect = useCallback((value: string | null) => {
    shouldUseLocationStateForAttackParameters.current = false;
    // @ts-ignore
    setSelectedAttack(value ?? undefined);
  }, []);

  return (
    <div className={container}>
      <div className={algorithmDropdown}>
        <DropdownInput
          label="Attack"
          helperText={`Choose the attack algorithm to run.${"\u00a0".repeat(
            30
          )}`}
          options={Object.keys(ATTACK_OBJ)}
          onValueSelect={onAttackSelect}
          defaultValue={indexRouteAttack?.algorithm}
        />
      </div>
      {selectedAttack != null && (
        <AttackParametersInput
          attackInfo={ATTACK_OBJ[selectedAttack]}
          indexRouteAttack={indexRouteAttack}
          shouldUseLocationState={
            shouldUseLocationStateForAttackParameters.current
          }
        />
      )}
    </div>
  );
};

export default AttackInformationInput;
