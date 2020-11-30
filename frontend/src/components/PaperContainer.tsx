import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  container: {
    padding: "16px 20px",
    marginTop: 12,
    marginBottom: 12,
    display: "flex",
    flexDirection: "column",
  },
});

const PaperContainer: React.FC = ({ children }) => {
  const { container } = useStyles();
  return <Paper className={container}>{children}</Paper>;
};

export default PaperContainer;
