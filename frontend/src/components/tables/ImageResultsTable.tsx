import React from "react";
import clsx from "clsx";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ImageElement from "../ImageElement";
import { SuccessfulServerResponse } from "../../utils/types";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { toDecimalPlacesOrNaN } from "../../utils/util";

interface Props {
  images: SuccessfulServerResponse["images"];
  originalImageLabel: string;
  adversarialImageLabels: string[];
  className: string;
  confidenceScores: SuccessfulServerResponse["evaluation"]["confidence_scores"];
}

const useStyles = makeStyles({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
  tableContainer: {
    marginTop: 16,
  },
  successIcon: {
    color: "#4caf50",
  },
});

const withModelPredictionPrefix = (str: string) => `Model prediction: ${str}`;

const ImageResultsTable: React.FC<Props> = ({
  images,
  className,
  originalImageLabel,
  adversarialImageLabels,
  confidenceScores,
}) => {
  const { container, tableContainer, successIcon } = useStyles();

  return (
    <div className={clsx(container, className)}>
      <Typography variant="h5">Image Results</Typography>
      <TableContainer classes={{ root: tableContainer }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Original</TableCell>
              <TableCell align="center">Adversarial</TableCell>
              <TableCell align="center">Pixel difference</TableCell>
              <TableCell align="right">Confidence Score</TableCell>
              <TableCell align="center">Success</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {images.map(({ original, adversarial, difference }, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row" align="center">
                  <ImageElement
                    encodedImage={original}
                    altText="before attack"
                    caption={withModelPredictionPrefix(originalImageLabel)}
                  />
                </TableCell>
                <TableCell align="center">
                  <ImageElement
                    encodedImage={adversarial}
                    altText="after attack"
                    caption={withModelPredictionPrefix(
                      adversarialImageLabels[index]
                    )}
                  />
                </TableCell>
                <TableCell align="center">
                  <ImageElement
                    encodedImage={difference}
                    altText="pixel difference"
                  />
                </TableCell>
                <TableCell align="right">
                  {toDecimalPlacesOrNaN(confidenceScores[index])}
                </TableCell>
                <TableCell align="center">
                  {originalImageLabel === adversarialImageLabels[index] ? (
                    <CancelIcon color="error" fontSize="large" />
                  ) : (
                    <CheckCircleIcon
                      classes={{ root: successIcon }}
                      fontSize="large"
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ImageResultsTable;
