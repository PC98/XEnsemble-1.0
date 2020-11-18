import React, { useRef, useCallback, useState } from "react";
import InputForm from "../input/InputForm";
import NavigationTabBar from "../NavigationTabBar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import usePostRequest from "../../utils/usePostRequest";
import { ServerResponse, DATA, DATASET, MODEL_OBJ } from "../../utils/types";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
});

interface Props {
  serverResponseCallback: (response: ServerResponse | null) => void;
}

const IndexPage: React.FC<Props> = ({ serverResponseCallback }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [tabValue, setTabValue] = useState<DATASET>("MNIST");
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

      data.set("Label", String(DATA[tabValue].labels.indexOf(labelStr))); // To make things easier for the back-end
      // @ts-ignore
      data.set("Model", MODEL_OBJ[modelStr]);
      data.set("Dataset", tabValue);
      data.set("Random", String(randomVal == null ? 0 : 1));

      // TODO: Check if success parameter in server response is false.
      serverResponseCallback(await makeRequest(data));
    },
    [makeRequest, serverResponseCallback, tabValue]
  );

  return (
    <div className={container}>
      <NavigationTabBar
        labels={Object.keys(DATA)}
        value={tabValue}
        onChangeValue={(newValue) => void setTabValue(newValue as DATASET)}
        isLoading={isLoading}
      />
      <InputForm
        ref={formRef}
        onSubmit={onSubmit}
        isLoading={isLoading}
        {...DATA[tabValue]}
        key={tabValue}
      />
    </div>
  );
};

export default IndexPage;
