import React from "react";
import { withRoleProtection } from "../withRoleProtection";

const AdminPage = () => {
  return <div>AdminPage</div>;
};

export default withRoleProtection(AdminPage, ["ADMIN"]);
