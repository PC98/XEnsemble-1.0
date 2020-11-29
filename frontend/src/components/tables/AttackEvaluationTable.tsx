import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { SuccessfulServerResponse } from "../../utils/types";
import { toDecimalPlacesOrNaN } from "../../utils/util";

type Props = Pick<
  SuccessfulServerResponse["evaluation"],
  | "duration_per_sample"
  | "mean_confidence"
  | "mean_l2_dist"
  | "mean_li_dist"
  | "mean_l0_dist_value"
  | "mean_l0_dist_pixel"
  | "success_rate"
>;

const useStyles = makeStyles({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
  tableContainer: {
    marginTop: 16,
  },
});

const AttackEvaluationTable: React.FC<Props> = ({
  duration_per_sample,
  success_rate,
  mean_confidence,
  mean_l0_dist_pixel,
  mean_l0_dist_value,
  mean_li_dist,
  mean_l2_dist,
}) => {
  const { container, tableContainer } = useStyles();

  return (
    <div className={container}>
      <Typography variant="h5">Attack Evaluation</Typography>
      <TableContainer classes={{ root: tableContainer }} component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell variant="head">Success rate</TableCell>
              <TableCell>{toDecimalPlacesOrNaN(success_rate, true)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">Duration per sample&nbsp;(s)</TableCell>
              <TableCell>{toDecimalPlacesOrNaN(duration_per_sample)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">Mean confidence</TableCell>
              <TableCell>
                {toDecimalPlacesOrNaN(mean_confidence, true)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">
                Mean L<sub>2</sub> dist.
              </TableCell>
              <TableCell>{toDecimalPlacesOrNaN(mean_l2_dist)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">
                Mean L<sub>i</sub> dist.
              </TableCell>
              <TableCell>{toDecimalPlacesOrNaN(mean_li_dist)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">
                Mean L<sub>0</sub> dist. value
              </TableCell>
              <TableCell>
                {toDecimalPlacesOrNaN(mean_l0_dist_value, true)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">
                Mean L<sub>0</sub> dist. pixel
              </TableCell>
              <TableCell>
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
