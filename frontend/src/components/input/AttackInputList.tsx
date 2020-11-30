import React, { useCallback, useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Fab from "@material-ui/core/Fab";
import AttackInputListItem from "./AttackInputListItem";
import { UserInput } from "../../utils/types";
import AddIcon from "@material-ui/icons/Add";

const ATTACK_LIMIT = 4;

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  iconContainer: {
    marginTop: 8,
  },
});

interface Props {
  indexRouteLocationState?: UserInput;
}

const AttackInputList: React.FC<Props> = ({ indexRouteLocationState }) => {
  const { container, iconContainer } = useStyles();
  // const [numAttacks, setNumOfAttacks] = useState(1);
  const [items, setItems] = useState(
    Array.from(Array(indexRouteLocationState?.attacks.length ?? 1).keys())
  );

  const addAttack = useCallback(() => {
    setItems((curItems) => [...curItems, curItems[curItems.length - 1] + 1]);
  }, []);

  const removeAttack = useCallback(
    (itemToDelete: number) => {
      if (items.length === 1) {
        alert("You must run atleast one attack.");
      } else {
        setItems((curItems) =>
          curItems.filter((item) => item !== itemToDelete)
        );
      }
    },
    [items]
  );

  return (
    <div className={container}>
      {items.map((item, index) => (
        <AttackInputListItem
          key={item}
          // You don't have to worry about index-out-of-bounds exception in JavaScript
          indexRouteAttack={indexRouteLocationState?.attacks[item]}
          title={`Attack ${index + 1}`}
          onDelete={() => void removeAttack(item)}
        />
      ))}
      <div className={iconContainer}>
        <Fab
          color="primary"
          size="medium"
          onClick={addAttack}
          disabled={items.length === ATTACK_LIMIT}
        >
          <AddIcon />
        </Fab>
      </div>
    </div>
  );
};

export default AttackInputList;
