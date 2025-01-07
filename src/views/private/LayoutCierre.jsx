import React from "react";
import { Outlet } from "react-router-dom";
import HeaderCierre from "./HeaderCierre";

function LayoutCierre() {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <HeaderCierre />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutCierre;
