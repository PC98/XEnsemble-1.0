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
import { MODEL } from "../utils/data";

type Props = { className: string; model: MODEL } & Pick<
  SuccessfulServerResponse["evaluation"],
  "dataset_name" | "attack_string"
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
  wordBreak: {
    wordBreak: "break-all",
  },
});

const AttackInformationTable: React.FC<Props> = ({
  dataset_name,
  model,
  attack_string,
  className,
}) => {
  const { container, tableContainer, wordBreak } = useStyles();

  return (
    <div className={clsx(container, className)}>
      <Typography variant="h5">Attack Information</Typography>
      <TableContainer classes={{ root: tableContainer }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Dataset</TableCell>
              <TableCell>Model</TableCell>
              <TableCell align="center">Attack string</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                {dataset_name}
              </TableCell>
              <TableCell>{model}</TableCell>
              <TableCell align="center" classes={{ root: wordBreak }}>
                {attack_string}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AttackInformationTable;
