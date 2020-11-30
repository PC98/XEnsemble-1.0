import React from "react";
import clsx from "clsx";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableHead from "@material-ui/core/TableHead";
import AttackEvaluationTableRow from "./AttackEvaluationTableRow";

import { AttackResult, UserInput } from "../../utils/types";

interface Props {
  userInputAttacks: UserInput["attacks"];
  allEvaluations: AttackResult["evaluation"][];
  className: string;
}

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  tableContainer: {
    marginTop: 16,
  },
});

const AttackEvaluationTable: React.FC<Props> = ({
  userInputAttacks,
  allEvaluations,
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
              <TableCell />
              <TableCell>Attack ID</TableCell>
              <TableCell align="right">Success rate</TableCell>
              <TableCell align="right">Duration per sample&nbsp;(s)</TableCell>
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
            {userInputAttacks.map((inputAttack, index) => (
              <AttackEvaluationTableRow
                key={index}
                position={index + 1}
                userInputAttack={inputAttack}
                attackEvaluation={allEvaluations[index]}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AttackEvaluationTable;
