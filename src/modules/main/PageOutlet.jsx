import SideMenuGeneral from "components/SideMenu/SideMenuGeneral";
import { Outlet } from "react-router-dom";

export default function PageOutlet({ children }) {
    return <>
        <SideMenuGeneral />
        {children}

    </>
}