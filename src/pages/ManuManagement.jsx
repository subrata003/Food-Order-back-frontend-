import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AddFood from "../components/AddFood";
import ViewFoods from "../components/ViewFoods";
import { useFood } from "../storeContext/ContextApi";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

// Accessibility Props Function
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ManuManagement() {
  const [value, setValue] = React.useState(0);
  const { fetchFoods, userData ,fetchProfile} = useFood();

  // fetchProfile();
  
  // Ensure userData is available before proceeding
  if (!userData) return <p>Loading...</p>;

  // Define Tabs Based on Role
  const tabs = [{ label: "View Manu", component: <ViewFoods /> }];
  
  if (userData.role == "admin" || userData.role == "manager") {
    tabs.unshift({ label: "Add Manu", component: <AddFood /> });
  }

  // Handle Tab Change
  const handleChange = async (event, newValue) => {
    setValue(newValue);
    if (tabs[newValue].label === "View Manu") {
      await fetchFoods();
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>

      {/* Render Tab Panels */}
      {tabs.map((tab, index) => (
        <CustomTabPanel key={index} value={value} index={index}>
          {tab.component}
        </CustomTabPanel>
      ))}
    </Box>
  );
}
