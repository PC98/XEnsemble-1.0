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

interface Props {
  dataset: string;
  model: string;
  labelAttacked: string;
  numberAttacked: number;
  randomSelection: boolean;
  className: string;
}

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  tableContainer: {
    marginTop: 16,
    width: "62%",
    minWidth: 740,
  },
});

const GeneralInformationTable: React.FC<Props> = ({
  dataset,
  model,
  labelAttacked,
  numberAttacked,
  randomSelection,
  className,
}) => {
  const { container, tableContainer } = useStyles();

  return (
    <div className={clsx(container, className)}>
      <Typography variant="h5">General Information</Typography>
      <TableContainer classes={{ root: tableContainer }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Dataset</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Attacked label</TableCell>
              <TableCell align="right">Num. of images attacked</TableCell>
              <TableCell>Randomly selected images</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                {dataset}
              </TableCell>
              <TableCell>{model}</TableCell>
              <TableCell>{labelAttacked}</TableCell>
              <TableCell align="right">{numberAttacked}</TableCell>
              <TableCell>{randomSelection ? "True" : "False"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default GeneralInformationTable;
