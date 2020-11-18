import React, { useCallback, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import ResultPage from "./pages/ResultPage";
import { ServerResponse } from "../utils/types";

const MainComponent: React.FC = () => {
  const history = useHistory();

  const [serverResponse, setServerResponse] = useState<ServerResponse | null>(
    null
  );

  const serverResponseCallback = useCallback(
    (response: ServerResponse | null) => {
      setServerResponse(response);
      history.push("/result");
    },
    [history]
  );

  return (
    <Switch>
      <Route exact path="/">
        <IndexPage serverResponseCallback={serverResponseCallback} />
      </Route>
      <Route path="/result">
        <ResultPage serverResponse={serverResponse} />
      </Route>
    </Switch>
  );
};

export default MainComponent;
