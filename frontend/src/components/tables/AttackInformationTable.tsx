import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { ATTACK_OBJ, ATTACK } from "../../utils/data";
import { TableData, IndexRouteLocationState } from "../../utils/types";
import {
  getBoolValueFromIndexRouteLocationState,
  getOptionalValueFromIndexRouteLocationState,
} from "../../utils/util";

interface Props {
  user_input: IndexRouteLocationState;
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
});

const AttackInformationTable: React.FC<Props> = ({ user_input }) => {
  const { container, tableContainer } = useStyles();
  const attackAlgo = user_input.Attack as ATTACK;
  const attackInfo = ATTACK_OBJ[attackAlgo];

  const dropdownParameters: TableData[] = [];
  const booleanParameters: TableData[] = [];
  const numberParameters: TableData[] = [];

  Object.entries(attackInfo.parameters).forEach(([label, parameter]) => {
    switch (parameter.type) {
      case "dropdown":
        dropdownParameters.push({ head: label, body: user_input[label] });
        break;
      case "boolean":
        booleanParameters.push({
          head: label,
          body: getBoolValueFromIndexRouteLocationState(user_input, label)!
            ? "True"
            : "False",
        });
        break;
      case "number":
        numberParameters.push({ head: label, body: user_input[label] });
        break;
      default: {
        const _exhaustiveCheck: never = parameter;
        return _exhaustiveCheck;
      }
    }
  });

  let targetedParameter: TableData | null;
  switch (attackInfo.targeted) {
    case "NO":
      targetedParameter = null;
      break;
    case "YES":
      targetedParameter = {
        head: "Targeted",
        body: getOptionalValueFromIndexRouteLocationState(
          user_input,
          "Target"
        )!,
      };
      break;
    case "BOTH":
      targetedParameter = {
        head: "Targeted",
        body:
          getOptionalValueFromIndexRouteLocationState(user_input, "Target") ??
          "No",
      };
      break;
    default: {
      const _exhaustiveCheck: never = attackInfo.targeted;
      return _exhaustiveCheck;
    }
  }

  return (
    <div className={container}>
      <Typography variant="h5">Attack Information</Typography>
      <TableContainer classes={{ root: tableContainer }} component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell variant="head">Algorithm</TableCell>
              <TableCell>{attackAlgo}</TableCell>
            </TableRow>
            {[
              ...numberParameters,
              ...dropdownParameters,
              ...booleanParameters,
              targetedParameter,
            ].map(
              (param) =>
                param && (
                  <TableRow key={param.head}>
                    <TableCell variant="head">{param.head}</TableCell>
                    <TableCell>{param.body}</TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AttackInformationTable;
