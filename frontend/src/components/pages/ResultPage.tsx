import React from "react";
import clsx from "clsx";
import ErrorPage from "./ErrorPage";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ImageResults from "../ImageResults";
import AttackEvaluationTable from "../tables/AttackEvaluationTable";
import GeneralInformationTable from "../tables/GeneralInformationTable";
import AppBarWithBackButton from "../AppBarWithBackButton";
import { ServerResponse, UserInput } from "../../utils/types";
import { DATASET, DATASET_OBJ } from "../../utils/data";
import { useHistory } from "react-router-dom";

interface Props {
  serverResponse: ServerResponse | null;
}

const useStyles = makeStyles({
  container: {
    padding: "32px 44px",
    backgroundColor: "#fafafa",
    marginTop: -14,
    marginBottom: -14,
  },
  columnFlex: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  item: {
    marginTop: 14,
    marginBottom: 14,
  },
});

const ResultPage: React.FC<Props> = ({ serverResponse }) => {
  const { container, item, columnFlex } = useStyles();
  const history = useHistory<UserInput>();

  if (serverResponse == null || !serverResponse.success) {
    return <ErrorPage />;
  }

  const { results, user_input } = serverResponse;
  const labels = DATASET_OBJ[user_input.dataset as DATASET].labels;
  const allEvaluations = results.map((_) => _.evaluation);
  const allImages = results.map((_) => _.images);

  return (
    <div className={columnFlex}>
      <AppBarWithBackButton
        onClick={() => void history.push("/", user_input)}
      />
      <div className={clsx(container, columnFlex)}>
        <GeneralInformationTable
          className={item}
          dataset={user_input.dataset}
          model={user_input.model}
          labelAttacked={user_input.classLabel}
          numberAttacked={user_input.number}
          randomSelection={user_input.random}
        />
        <AttackEvaluationTable
          className={item}
          userInputAttacks={user_input.attacks}
          allEvaluations={allEvaluations}
        />
        <ImageResults
          className={item}
          allImages={allImages}
          originalImageLabel={user_input.classLabel}
          allAdversarialImageLabels={allEvaluations.map((ev) =>
            ev.prediction_after_attack.map((p) => labels[p])
          )}
          allConfidenceScores={allEvaluations.map((_) => _.confidence_scores)}
        />
      </div>
    </div>
  );
};

export default ResultPage;
