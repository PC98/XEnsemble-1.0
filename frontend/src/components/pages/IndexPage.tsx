import React, { useRef, useCallback, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import InputForm from "../input/InputForm";
import NavigationTabBar from "../NavigationTabBar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import usePostRequest from "../../utils/usePostRequest";
import { useHistory } from "react-router-dom";
import { ServerResponse, IndexRouteLocationState } from "../../utils/types";
import {
  DATASET_OBJ,
  DATASET,
  MODEL_OBJ,
  ATTACK_OBJ,
  ATTACK,
  MODEL,
  TARGETED_TYPES,
} from "../../utils/data";

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
  IndexRouteLocationState | undefined
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
    (indexRouteLocationState?.Dataset ?? "MNIST") as DATASET
  );
  const { container } = useStyles();

  const { isLoading, makeRequest } = usePostRequest();

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData(formRef.current ?? undefined);
      // Before processing anything, save user's input so that it can re-used later
      data.set("Dataset", tabValue);
      const userInput = Object.fromEntries(data.entries());
      data.set("user_input", JSON.stringify(userInput));

      // Use labels from InputForm.tsx
      const labelStr = data.get("Label") as string;
      const modelStr = data.get("Model") as MODEL;
      const randomVal = data.get("Random") as string | null;
      const attackType = data.get("Attack") as ATTACK;

      data.set("Label", String(DATASET_OBJ[tabValue].labels.indexOf(labelStr))); // To make things easier for the back-end
      data.set("Model", MODEL_OBJ[modelStr]);
      data.set("Random", String(randomVal == null ? 0 : 1)); // Random behaves a bit differently when compared to other boolean parameters
      // Now, build the attack string:
      const { value: attackKey, parameters } = ATTACK_OBJ[attackType];
      const attackParameters: string[] = [];
      Object.entries(parameters).forEach(([label, parameter]) => {
        const key = parameter.value; // like "eps_iter"
        const inputValue = data.get(label) as string | null;
        let parsedValue;
        switch (parameter.type) {
          case "dropdown":
            parsedValue = parameter.options.find((_) => _.name === inputValue)
              ?.value;
            break;
          case "boolean":
            parsedValue = inputValue == null ? "false" : "true";
            break;
          case "number":
            parsedValue = inputValue;
            break;
          default: {
            const _exhaustiveCheck: never = parameter;
            return _exhaustiveCheck;
          }
        }

        attackParameters.push(`${key}=${parsedValue}`);
        data.delete(label); // optional
      });

      const target = data.get("Target") as string | null;
      if (target != null && target in TARGETED_TYPES) {
        // @ts-ignore
        attackParameters.push(`targeted=${TARGETED_TYPES[target]}`);
        data.delete("Target");
      }

      if (attackParameters.length > 0) {
        data.set("Attack", `${attackKey}?${attackParameters.join("&")}`);
      } else {
        data.set("Attack", attackKey);
      }

      serverResponseCallback(await makeRequest(data));
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
