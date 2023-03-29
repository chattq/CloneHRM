import { useLocalization } from "hooks/useLocalization";
import React, { useEffect, useState } from "react";
import Link from "components/NetworkLink";
import { IMenuItem } from "utils/themes";

const SideMenuItem = ({
  menuItem,
  isActive,
}: {
  menuItem: IMenuItem;
  isActive?: boolean;
}) => {
  const _t = useLocalization("SideMenu");

  return (
    <li className="nav-item">
      <Link
        to={menuItem.path || ""}
        className={`nav-link ${isActive ? "active1" : ""}`}>
        {_t(menuItem.name)}
      </Link>
    </li>
  );
};

export default SideMenuItem;
