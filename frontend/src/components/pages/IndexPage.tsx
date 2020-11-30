import React, { useRef, useCallback, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import InputForm from "../input/InputForm";
import NavigationTabBar from "../NavigationTabBar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import usePostRequest from "../../utils/usePostRequest";
import { useHistory } from "react-router-dom";
import {
  ServerResponse,
  UserInput,
  UserInputAttackParameters,
} from "../../utils/types";
import {
  DATASET_OBJ,
  DATASET,
  MODEL_OBJ,
  ATTACK_OBJ,
  ATTACK,
  MODEL,
  TARGETED_TYPES,
  TARGET_TYPE,
} from "../../utils/data";
import { processBooleanInputValues, formDataSetArray } from "../../utils/util";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
});

export type RouteProps = RouteComponentProps<
  {},
  StaticContext,
  UserInput | undefined
>;

interface Props extends RouteProps {
  serverResponseCallback: (response: ServerResponse | null) => void;
}

const IndexPage: React.FC<Props> = ({
  serverResponseCallback,
  ...routeProps
}) => {
  const history = useHistory();
  const formRef = useRef<HTMLFormElement>(null);
  const indexRouteLocationState = routeProps.location.state;
  const [tabValue, setTabValue] = useState<DATASET>(
    (indexRouteLocationState?.dataset ?? "MNIST") as DATASET
  );
  const { container } = useStyles();

  const { isLoading, makeRequest } = usePostRequest();

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData(formRef.current ?? undefined);
      let userInput = {} as UserInput;

      userInput["dataset"] = tabValue;

      const modelStr = data.get("Model") as MODEL;
      userInput["model"] = modelStr;
      userInput["modelValue"] = MODEL_OBJ[modelStr];

      const labelStr = data.get("Label") as string;
      userInput["classLabel"] = labelStr;
      userInput["classLabelValue"] = DATASET_OBJ[tabValue].labels.indexOf(
        labelStr
      ); // To make things easier for the back-end

      const randomVal = data.getAll("Random") as string[];
      userInput["random"] = processBooleanInputValues(randomVal);

      const numberStr = data.get("Number") as string;
      userInput["number"] = parseInt(numberStr);

      const attackAlgos = data.getAll("Attack") as ATTACK[];
      userInput["attacks"] = [];
      const attackStringArr: string[] = [];

      attackAlgos.forEach((algo) => {
        const userInputAttackParams: UserInputAttackParameters = {};
        const attackParameters: string[] = [];
        const { value: attackKey, parameters, targeted } = ATTACK_OBJ[algo];

        Object.entries(parameters).forEach(([label, parameter]) => {
          const key = parameter.value; // key: "eps_iter"
          const inputValues = data.getAll(label) as string[]; // label: "Epsilon iteration"
          const curValue = inputValues.splice(0, 1)[0];

          let parsedValue;
          switch (parameter.type) {
            case "dropdown":
              parsedValue = parameter.options.find((_) => _.name === curValue)!
                .value;
              userInputAttackParams[label] = curValue;
              break;
            case "boolean":
              parsedValue = processBooleanInputValues([
                curValue,
                inputValues[0],
              ]);
              if (parsedValue) {
                inputValues.splice(0, 1);
              }
              userInputAttackParams[label] = parsedValue;
              break;
            case "number":
              parsedValue = curValue;
              userInputAttackParams[label] = curValue;
              break;
            default: {
              const _exhaustiveCheck: never = parameter;
              return _exhaustiveCheck;
            }
          }

          attackParameters.push(`${key}=${parsedValue}`);
          formDataSetArray(data, label, inputValues);
        });

        let userInputTarget = null;
        if (targeted === "YES" || targeted === "BOTH") {
          const tagetValues = data.getAll("Target") as string[];
          const curTarget = tagetValues.splice(0, 1)[0];

          if (curTarget in TARGETED_TYPES) {
            attackParameters.push(
              `targeted=${TARGETED_TYPES[curTarget as TARGET_TYPE]}`
            );
            userInputTarget = curTarget;
          }

          formDataSetArray(data, "Target", tagetValues);
        }

        userInput["attacks"].push({
          algorithm: algo,
          parameters: userInputAttackParams,
          target: userInputTarget,
        });

        if (attackParameters.length > 0) {
          attackStringArr.push(`${attackKey}?${attackParameters.join("&")}`);
        } else {
          attackStringArr.push(`${attackKey}`);
        }
      });
      userInput["attackStr"] = attackStringArr.join(";");

      serverResponseCallback(await makeRequest(userInput));
    },
    [makeRequest, serverResponseCallback, tabValue]
  );

  return (
    <div className={container}>
      <NavigationTabBar
        labels={Object.keys(DATASET_OBJ)}
        value={tabValue}
        onChangeValue={(newValue) => {
          setTabValue(newValue as DATASET);
          history.replace("/");
        }}
        isLoading={isLoading}
      />
      <InputForm
        ref={formRef}
        onSubmit={onSubmit}
        isLoading={isLoading}
        key={tabValue}
        indexRouteLocationState={indexRouteLocationState}
        {...DATASET_OBJ[tabValue]}
      />
    </div>
  );
};

export default IndexPage;
