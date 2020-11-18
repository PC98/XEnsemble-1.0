import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

interface Props {
  labels: string[];
  value: string;
  onChangeValue: (newValue: string) => void;
  isLoading: boolean;
}

const NavigationTabBar: React.FC<Props> = ({
  labels,
  value,
  onChangeValue,
  isLoading,
}) => {
  return (
    <Paper>
      <Tabs
        value={value}
        onChange={(_, newValue) => {
          onChangeValue(newValue);
        }}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        {labels.map((label) => (
          <Tab
            label={label}
            key={label}
            value={label}
            disabled={isLoading && label !== value}
          />
        ))}
      </Tabs>
    </Paper>
  );
};

export default NavigationTabBar;
