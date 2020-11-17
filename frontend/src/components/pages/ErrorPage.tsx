import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});

const ErrorPage: React.FC = () => {
  const { container } = useStyles();

  return (
    <div className={container}>
      <ErrorOutlineIcon fontSize="large" color="error" />
      <Typography>
        We encountered an error while processing your request. Please try again
        later.
      </Typography>
    </div>
  );
};

export default ErrorPage;
