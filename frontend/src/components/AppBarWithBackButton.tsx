import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

interface Props {
  onClick: () => void;
}

const AppBarWithBackButton: React.FC<Props> = ({ onClick }) => {
  return (
    <AppBar color="inherit" position="relative" elevation={1}>
      <Toolbar variant="dense">
        <IconButton onClick={onClick} edge="start" color="inherit">
          <ArrowBackIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarWithBackButton;
