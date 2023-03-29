import React, { useEffect, useMemo, useState } from "react";
import { IMenuItem } from "utils/themes";
import SideMenu from "./Shared/SideMenu";
import { RouteList } from "routes/RouteConfig";
import { useNetworkLocaltion } from "hooks/useNetworkLocation";
import { usePermission } from "hooks/usePermission";

const SideMenuGeneral = () => {
  let location = useNetworkLocaltion();
  const hasPermission = usePermission();
  const [ckey, setCkey] = useState("");
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    let menuList = [];

    // lấy dữ liệu từ RouteList để đổ ra
    let currentRoute = RouteList.find((r) => location.equalPath(r.path));

    if (currentRoute && currentRoute.subMenuKey && currentRoute.mainMenuKey) {
      setCkey(currentRoute.subMenuKey);
      var list = RouteList.filter(
        (ri) => ri.mainMenuKey === currentRoute.mainMenuKey
      );

      for (var item of list) {
        if (item.subMenuTitle && hasPermission(item.persmissions))
          menuList.push({
            path: item.path,
            name: item.subMenuTitle,
            key: item.subMenuKey,
          });
      }
    }

    setMenu(menuList);
    console.log("enter side menu");
  }, [location.pathname]);

  return <SideMenu menu={menu} activeKey={ckey} />;
};
export default SideMenuGeneral;
