import React from "react";
import clsx from "clsx";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { SuccessfulServerResponse } from "../utils/types";

type Props = { className: string } & Pick<
  SuccessfulServerResponse["evaluation"],
  | "duration_per_sample"
  | "mean_confidence"
  | "mean_l2_dist"
  | "mean_li_dist"
  | "mean_l0_dist_value"
  | "mean_l0_dist_pixel"
>;

const useStyles = makeStyles({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
  tableContainer: {
    marginTop: 16,
    width: "68%",
  },
});

const toDecimalPlacesOrNaN = (num: number | null, isPercent = false) => {
  if (num == null) {
    return "NaN";
  }

  return isPercent ? `${(100 * num).toFixed(2)}%` : num.toFixed(3);
};

const AttackEvaluationTable: React.FC<Props> = ({
  duration_per_sample,
  mean_confidence,
  mean_l0_dist_pixel,
  mean_l0_dist_value,
  mean_li_dist,
  mean_l2_dist,
  className,
}) => {
  const { container, tableContainer } = useStyles();

  return (
    <div className={clsx(container, className)}>
      <Typography variant="h5">Attack Evaluation</Typography>
      <TableContainer classes={{ root: tableContainer }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right">Time taken&nbsp;(s)</TableCell>
              <TableCell align="right">Mean confidence</TableCell>
              <TableCell align="right">
                Mean L<sub>2</sub> dist.
              </TableCell>
              <TableCell align="right">
                Mean L<sub>i</sub> dist.
              </TableCell>
              <TableCell align="right">
                Mean L<sub>0</sub> dist. value
              </TableCell>
              <TableCell align="right">
                Mean L<sub>0</sub> dist. pixel
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row" align="right">
                {duration_per_sample.toFixed(3)}
              </TableCell>
              <TableCell align="right">
                {toDecimalPlacesOrNaN(mean_confidence, true)}
              </TableCell>
              <TableCell align="right">
                {toDecimalPlacesOrNaN(mean_l2_dist)}
              </TableCell>
              <TableCell align="right">
                {toDecimalPlacesOrNaN(mean_li_dist)}
              </TableCell>
              <TableCell align="right">
                {toDecimalPlacesOrNaN(mean_l0_dist_value, true)}
              </TableCell>
              <TableCell align="right">
                {toDecimalPlacesOrNaN(mean_l0_dist_pixel, true)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AttackEvaluationTable;
