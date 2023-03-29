import React, { useEffect, useState } from "react";
import { Sidenav, Nav, Sidebar, Toggle, IconButton } from "rsuite";
import Icon from "@rsuite/icons/lib/Icon";
import { FiMenu } from "react-icons/fi";
import SideMenuItem from "./SideMenuItem";
import { addWindowClass, removeWindowClass } from "utils/common";
import { v4 as uuid } from "uuid";

const SideMenu = ({ menu, activeKey }) => {
  // đóng mở sideBar
  const [expanded, setExpanded] = React.useState(false);

  return (
    <>
      <Sidebar
        className="page-sidebar"
        style={{ zIndex: 1 }}
        width={expanded ? 260 : 0}
        collapsible>
        <IconButton
          icon={<Icon as={FiMenu} appearance="subtle" />}
          onClick={() => {
            if (expanded) {
              setExpanded(false);
              //  ẩn hết
              addWindowClass("side-min");
            } else {
              setExpanded(true);
              removeWindowClass("side-min");
            }
          }}
          appearance="subtle"
          className="toggle-btn mt-1"
        />

        <nav className="mt-3 p-2 side-nav" style={{ overflowY: "hidden" }}>
          <ul className={`nav nav-pills nav-sidebar flex-column`} role="menu">
            {menu.map((menuItem) => (
              <SideMenuItem
                key={uuid()}
                menuItem={menuItem}
                isActive={menuItem.key == activeKey ? true : false}
              />
            ))}
          </ul>
        </nav>
      </Sidebar>
    </>
  );
};
export default SideMenu;
