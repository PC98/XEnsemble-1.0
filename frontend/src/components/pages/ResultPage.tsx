import React from "react";
import ErrorPage from "./ErrorPage";
import { ServerResponse } from "../../utils/types";

interface Props {
  serverResponse: ServerResponse | null;
}

const ResultPage: React.FC<Props> = ({ serverResponse }) => {
  if (serverResponse == null) {
    return <ErrorPage />;
  }
  return <div>Test</div>;
};

export default ResultPage;
