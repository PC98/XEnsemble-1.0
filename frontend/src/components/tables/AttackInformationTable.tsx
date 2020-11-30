import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import { ATTACK_OBJ, ATTACK } from "../../utils/data";
import { TableData, UserInput } from "../../utils/types";

interface Props {
  userInputAttack: UserInput["attacks"][number];
  position: number;
}

const useStyles = makeStyles({
  unsetBottomBorder: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

const AttackInformationTable: React.FC<Props> = ({
  userInputAttack,
  position,
}) => {
  const { unsetBottomBorder } = useStyles();

  const attackInfo = ATTACK_OBJ[userInputAttack.algorithm as ATTACK];

  const dropdownParameters: TableData[] = [];
  const booleanParameters: TableData[] = [];
  const numberParameters: TableData[] = [];

  Object.entries(attackInfo.parameters).forEach(([label, parameter]) => {
    switch (parameter.type) {
      case "dropdown":
        dropdownParameters.push({
          head: label,
          body: userInputAttack.parameters[label] as string,
        });
        break;
      case "boolean":
        booleanParameters.push({
          head: label,
          body: (userInputAttack.parameters[label] as boolean)
            ? "True"
            : "False",
        });
        break;
      case "number":
        numberParameters.push({
          head: label,
          body: userInputAttack.parameters[label] as string,
        });
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
        body: userInputAttack.target!,
      };
      break;
    case "BOTH":
      targetedParameter = {
        head: "Targeted",
        body: userInputAttack.target ?? "No",
      };
      break;
    default: {
      const _exhaustiveCheck: never = attackInfo.targeted;
      return _exhaustiveCheck;
    }
  }

  const createTableCells = (key: keyof TableData) =>
    [
      ...numberParameters,
      ...dropdownParameters,
      ...booleanParameters,
      targetedParameter,
    ].map(
      (param, index) =>
        param && (
          <TableCell
            key={`${index}_${param[key]}_${position}`}
            align={index < numberParameters.length ? "right" : "left"}
          >
            {param[key]}
          </TableCell>
        )
    );

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Algorithm</TableCell>
          {createTableCells("head")}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow className={unsetBottomBorder}>
          <TableCell>{userInputAttack.algorithm}</TableCell>
          {createTableCells("body")}
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default AttackInformationTable;
