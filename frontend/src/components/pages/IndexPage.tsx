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
  DATA,
  DATASET,
  MODEL_OBJ,
  IndexRouteLocationState,
} from "../../utils/types";

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
    indexRouteLocationState?.selectedDataset ?? "MNIST"
  );
  const { container } = useStyles();

  const { isLoading, makeRequest } = usePostRequest();

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData(formRef.current ?? undefined);
      // Use labels from InputForm.tsx
      const labelStr = data.get("Label") as string;
      const modelStr = data.get("Model") as string;
      const randomVal = data.get("Random") as string | null;
      const attackStr = data.get("Attack") as string;

      data.set("Label", String(DATA[tabValue].labels.indexOf(labelStr))); // To make things easier for the back-end
      // @ts-ignore
      data.set("Model", MODEL_OBJ[modelStr]);
      data.set("Dataset", tabValue);
      data.set("Random", String(randomVal == null ? 0 : 1));
      data.set("Attack", attackStr.trim()); // just in case

      serverResponseCallback(await makeRequest(data));
    },
    [makeRequest, serverResponseCallback, tabValue]
  );

  return (
    <div className={container}>
      <NavigationTabBar
        labels={Object.keys(DATA)}
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
        {...DATA[tabValue]}
        key={tabValue}
        indexRouteLocationState={indexRouteLocationState}
      />
    </div>
  );
};

export default IndexPage;
