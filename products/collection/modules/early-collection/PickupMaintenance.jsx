import React from "react";
import { useIntl } from "react-intl";
import FunctionLayout from "./FunctionLayout";
import PickupMaintenanceDetails from "./pickup-maintenance/PickupMaintenanceDetails";
import { HBox } from "@helix/component-library";

/**
 * Route: /homelayout/scheduleReminder (Pickup Maintenance in function bar).
 * Account header + function groups are rendered by EarlyCollectionAccountWorkspaceLayout.
 */
const PickupMaintenance = () => {
  const intl = useIntl();

  return (
    <FunctionLayout title={intl.formatMessage({ id: "label.pickupMaintenance.title" })}>
      <HBox
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          position: "relative",
        }}
      >
      <PickupMaintenanceDetails />
      </HBox>
    </FunctionLayout>
  );
};

export default PickupMaintenance;
