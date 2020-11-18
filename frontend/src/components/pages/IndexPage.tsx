import React, { useRef, useCallback, useState } from "react";
import InputForm from "../input/InputForm";
import NavigationTabBar from "../NavigationTabBar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import usePostRequest from "../../utils/usePostRequest";
import { ServerResponse, DATA, DATASET } from "../../utils/types";

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

      serverResponseCallback(await makeRequest(data));
    },
    [makeRequest, serverResponseCallback]
  );

  return (
    <div className={container}>
      <NavigationTabBar
        labels={Object.keys(DATA)}
        value={tabValue}
        onChangeValue={(newValue) => void setTabValue(newValue as DATASET)}
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
