import React, { useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import TableCell from "@material-ui/core/TableCell";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import TableRow from "@material-ui/core/TableRow";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import IconButton from "@material-ui/core/IconButton";
import AttackInformationTable from "./AttackInformationTable";
import { UserInput, AttackResult } from "../../utils/types";
import { toDecimalPlacesOrNaN, getAttackAlgoStr } from "../../utils/util";
import { ATTACK } from "../../utils/data";

interface Props {
  userInputAttack: UserInput["attacks"][number];
  attackEvaluation: AttackResult["evaluation"];
  position: number;
}

const useStyles = makeStyles({
  unsetBottomBorder: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

const AttackEvaluationTableRow: React.FC<Props> = ({
  userInputAttack,
  attackEvaluation: {
    duration_per_sample,
    success_rate,
    mean_confidence,
    mean_l0_dist_pixel,
    mean_l0_dist_value,
    mean_li_dist,
    mean_l2_dist,
  },
  position,
}) => {
  const { unsetBottomBorder } = useStyles();
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow className={unsetBottomBorder}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen((s) => !s)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {`Attack ${position}: ${getAttackAlgoStr(
            userInputAttack.algorithm as ATTACK
          )}`}
        </TableCell>
        <TableCell align="right">
          {toDecimalPlacesOrNaN(success_rate, true)}
        </TableCell>
        <TableCell align="right">
          {toDecimalPlacesOrNaN(duration_per_sample)}
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
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="body2">Details</Typography>
              <AttackInformationTable
                userInputAttack={userInputAttack}
                position={position}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default AttackEvaluationTableRow;
