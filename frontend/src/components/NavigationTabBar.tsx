import React from "react";
import AppBar from "@material-ui/core/AppBar";
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
    <AppBar color="inherit" position="relative" elevation={1}>
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
    </AppBar>
  );
};

export default NavigationTabBar;
