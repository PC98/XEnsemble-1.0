import React, { useState } from "react";
import clsx from "clsx";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import ImageResultsTable from "./tables/ImageResultsTable";
import { AttackResult } from "../utils/types";

interface Props {
  allImages: AttackResult["images"][];
  originalImageLabel: string;
  allAdversarialImageLabels: string[][];
  className: string;
  allConfidenceScores: AttackResult["evaluation"]["confidence_scores"][];
}

const useStyles = makeStyles({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
  tabContainer: {
    marginTop: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});

const ImageResults: React.FC<Props> = ({
  allImages,
  className,
  originalImageLabel,
  allAdversarialImageLabels,
  allConfidenceScores,
}) => {
  const { container, tabContainer } = useStyles();
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div className={clsx(container, className)}>
      <Typography variant="h5">Image Results</Typography>
      <Paper classes={{ rounded: tabContainer }}>
        <Tabs
          centered
          value={tabIndex}
          indicatorColor="primary"
          textColor="primary"
          onChange={(_, newTabIndex) => void setTabIndex(newTabIndex)}
        >
          {allImages.map((_, index) => (
            <Tab label={`Attack ${index + 1}`} key={index} value={index} />
          ))}
        </Tabs>
      </Paper>
      <ImageResultsTable
        images={allImages[tabIndex]}
        originalImageLabel={originalImageLabel}
        adversarialImageLabels={allAdversarialImageLabels[tabIndex]}
        confidenceScores={allConfidenceScores[tabIndex]}
      />
    </div>
  );
};

export default ImageResults;