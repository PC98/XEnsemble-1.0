import React from "react";
import clsx from "clsx";
import ErrorPage from "./ErrorPage";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ImageRow from "../ImageRow";
import AttackEvaluationTable from "../AttackEvaluationTable";
import AttackInformationTable from "../AttackInformationTable";
import AppBarWithBackButton from "../AppBarWithBackButton";
import {
  ServerResponse,
  DATA,
  IndexRouteLocationState,
  FLIPPED_MODEL_OBJ,
} from "../../utils/types";
import { useHistory } from "react-router-dom";

interface Props {
  serverResponse: ServerResponse | null;
}

const useStyles = makeStyles({
  container: {
    padding: 32,
    backgroundColor: "#fafafa",
    marginTop: -5,
    marginBottom: -5,
  },
  columnFlex: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  item: {
    marginTop: 5,
    marginBottom: 5,
  },
});

const ResultPage: React.FC<Props> = ({ serverResponse }) => {
  const { container, item, columnFlex } = useStyles();
  const history = useHistory<IndexRouteLocationState>();

  if (serverResponse == null || !serverResponse.success) {
    return <ErrorPage />;
  }

  const { evaluation, images } = serverResponse;
  const labels = DATA[evaluation.dataset_name].labels;
  const originalImageLabel = labels[evaluation.original_label_index];
  const attackedImageLabel = labels[evaluation.prediction_after_attack];
  const model = FLIPPED_MODEL_OBJ[evaluation.model_name];

  return (
    <div className={columnFlex}>
      <AppBarWithBackButton
        onClick={() =>
          void history.push("/", {
            selectedModel: model,
            selectedDataset: evaluation.dataset_name,
            selectedAttack: evaluation.attack_string,
            selectedLabel: originalImageLabel,
            selectedRandom: evaluation.random,
          })
        }
      />
      <div className={clsx(container, columnFlex)}>
        <AttackInformationTable
          className={item}
          model={model}
          {...evaluation}
        />
        <AttackEvaluationTable className={item} {...evaluation} />
        <ImageRow
          className={item}
          images={images}
          originalImageLabel={originalImageLabel}
          attackedImageLabel={attackedImageLabel}
        />
      </div>
    </div>
  );
};

export default ResultPage;
