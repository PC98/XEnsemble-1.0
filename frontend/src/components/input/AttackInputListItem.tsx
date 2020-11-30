import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import PaperContainer from "../PaperContainer";
import AttackInformationInput from "./AttackInformationInput";
import { UserInput } from "../../utils/types";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

interface Props {
  title: string;
  indexRouteAttack?: UserInput["attacks"][number];
  onDelete: () => void;
}

const AttackInputListItem: React.FC<Props> = ({
  indexRouteAttack,
  title,
  onDelete,
}) => {
  const { header } = useStyles();

  return (
    <PaperContainer>
      <div className={header}>
        <Typography variant="subtitle1">{title}</Typography>
        <IconButton edge="end" onClick={onDelete}>
          <CloseIcon />
        </IconButton>
      </div>
      <AttackInformationInput indexRouteAttack={indexRouteAttack} />
    </PaperContainer>
  );
};

export default AttackInputListItem;
