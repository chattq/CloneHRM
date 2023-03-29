import React from "react";
import Page404 from "pages/Page404";
import Dashboard from "pages/Dashboard";
import PageStaffList from "pages/Staff/StaffList";
import DepList from "pages/Department/DepList";
import PositionList from "pages/Position/PositionList";

export interface RouteItem {
  path: string;
  pageTitle?: string;
  mainMenuTitle?: string;
  subMenuTitle?: string;
  mainMenuKey: string;
  subMenuKey?: string;
  persmissions?: string;
  getPageElement: Function;
}

export const RouteList: RouteItem[] = [
  {
    path: "/",
    mainMenuKey: "",
    pageTitle: "Dashboard",

    getPageElement: () => {
      return <Dashboard />;
    },
  },

  //Employess

  {
    path: "/staff/list",
    pageTitle: "Staff List",
    mainMenuTitle: "Employees",
    subMenuTitle: "Staff List",
    mainMenuKey: "employees",
    subMenuKey: "staff_list",
    persmissions: "",

    getPageElement: () => {
      return <PageStaffList />;
    },
  },

  //Administrations
  {
    path: "/department/list",
    mainMenuTitle: "Administrations",
    mainMenuKey: "admin",
    subMenuKey: "dep_list",
    subMenuTitle: "Departments",
    persmissions: "",
    getPageElement: () => {
      return <DepList />;
    },
  },
  {
    path: "/position/list",
    mainMenuTitle: "",
    mainMenuKey: "admin",
    subMenuKey: "position_list",
    subMenuTitle: "Positions",
    persmissions: "",
    getPageElement: () => {
      return <PositionList />;
    },
  },
  //
];
