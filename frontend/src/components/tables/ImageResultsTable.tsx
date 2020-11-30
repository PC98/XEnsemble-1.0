import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ImageElement from "../ImageElement";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { toDecimalPlacesOrNaN } from "../../utils/util";
import { AttackResult } from "../../utils/types";

interface Props {
  images: AttackResult["images"];
  originalImageLabel: string;
  adversarialImageLabels: string[];
  confidenceScores: AttackResult["evaluation"]["confidence_scores"];
}

const useStyles = makeStyles({
  tableContainer: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  successIcon: {
    color: "#4caf50",
  },
});

const withModelPredictionPrefix = (str: string) => `Model prediction: ${str}`;

const ImageResultsTable: React.FC<Props> = ({
  images,
  originalImageLabel,
  adversarialImageLabels,
  confidenceScores,
}) => {
  const { tableContainer, successIcon } = useStyles();

  return (
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
  );
};

export default ImageResultsTable;
