import React, { useState, useEffect, useCallback } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadUser, logoutUser, loadPermissions } from "store/reducers/auth";
import { addWindowClass, removeWindowClass } from "utils/common";
import { setOrgInfo } from "store/reducers/orgInfo";
import Header from "modules/main/header/Header";
import * as AuthService from "services/auth_service";
import * as localization_service from "services/localization_service";
import { Container } from "rsuite";
import { RouteList } from "routes/RouteConfig";
import { setActiveMainMenu } from "utils/common";
import { useNetworkLocaltion } from "hooks/useNetworkLocation";
import { useNetworkNavigate } from "hooks/useNetworkNavigate";
import general_master_service from "services/general_master_service";
import { usePermission } from "hooks/usePermission";

import { loadData, clearSavingData } from "store/reducers/localization";
import { toast } from "react-toastify";
import store from "store/store";
const Main = () => {
  const { networkId } = useParams();

  const dispatch = useDispatch();

  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [mainMenuKey, setMainMenuKey] = useState("");

  const [systemTitle, setSystemTitle] = useState(
    `${process.env.REACT_APP_TITLE}`
  );

  const initLocalizationData = async () => {
    let resp = await localization_service.loadData();

    if (resp.Success) dispatch(loadData(resp.Data));
    else toast.error(resp.ErrorMessage);
  };

  const updateLocalizationData = async () => {
    const { saving } = store.getState().localizationData;

    if (saving && saving.length > 0) {
      localization_service.addData(saving).then((resp) => {
        if (resp.Success) {
          initLocalizationData();
        }
      });
      dispatch(clearSavingData());
    }
  };

  const login = async () => {
    try {
      let resp = await AuthService.getSessionInfo(
        localStorage.getItem("token"),
        0
      );

      if (resp.Success) {
        dispatch(loadUser(resp.Data.CurrentUser));
        setIsAppLoaded(true);
        return true;
      } else {
        dispatch(logoutUser());
        //await sleep(10000);
        setIsAppLoaded(true);

        return false;
      }
    } catch (error) {
      //dispatch(logoutUser());
      //await sleep(1000);
      //setIsAppLoaded(true);

      return false;
    }
  };

  const fetchProfile = async () => {
    try {
      let resp = await AuthService.getSessionInfo(
        localStorage.getItem("token"),
        networkId
      );

      if (resp.Success) {
        dispatch(loadUser(resp.Data.CurrentUser));
        dispatch(
          setOrgInfo({
            OrgId: resp.Data.OrgId,
            NetworkId: resp.Data.NetworkId,
            OrgData: resp.Data.OrgData,
          })
        );
        await initLocalizationData();
        var rpdata = await general_master_service.getCurrentUserPermissions();

        //var permissions= pda
        if (rpdata.Success && rpdata.Data) {
          var listAccess = rpdata.Data.Lst_Sys_Access;
          if (listAccess)
            var permissions = listAccess.map((i: any) => i.ObjectCode);

          dispatch(loadPermissions(permissions));
        }

        //await sleep(1000);
        setIsAppLoaded(true);
      } else {
        dispatch(logoutUser());
        //await sleep(10000);
        setIsAppLoaded(true);
      }
    } catch (error) {
      //dispatch(logoutUser());
      //await sleep(1000);
      //setIsAppLoaded(true);
    }
  };

  let curLoc = useNetworkLocaltion();
  const hasPermission = usePermission();
  const navigate = useNetworkNavigate();
  const navigateOriginal = useNavigate();

  useEffect(() => {
    if (!networkId) {
      login().then((ret) => {
        if (ret) navigateOriginal("/selectnetwork");
      });
    } else if (!Number.parseFloat(networkId)) {
      navigateOriginal("/notfound");
    } else {
      removeWindowClass("register-page");
      removeWindowClass("login-page");
      removeWindowClass("hold-transition");

      //addWindowClass('sidebar-mini');

      addWindowClass("layout-top-nav");

      fetchProfile();
    }
    return () => {
      //removeWindowClass('sidebar-mini');
    };
  }, []);

  useEffect(() => {
    let currentRoute = RouteList.find((r) => curLoc.equalPath(r.path));
    if (currentRoute) {
      setMainMenuKey(currentRoute.mainMenuKey);
      setTimeout(() => {
        if (currentRoute) setActiveMainMenu(currentRoute.mainMenuKey);
      }, 10);

      if (currentRoute.pageTitle) {
        document.title = `${currentRoute.pageTitle} - ${systemTitle}`;
      } else document.title = systemTitle;

      if (!hasPermission(currentRoute.persmissions)) {
        navigate("/notfound");
      }
    }

    updateLocalizationData();
  }, [curLoc.fullLocation]);

  const getAppTemplate = useCallback(() => {
    if (!isAppLoaded) {
      return (
        <div className="preloader flex-column justify-content-center align-items-center">
          <img
            className="animation__shake"
            src="/img/logo.png"
            alt="idocNetHRM logo"
            height="60"
            width="60"
          />
        </div>
      );
    }
    return (
      <>
        <Header mainMenuKey={mainMenuKey} />

        <section className="content">
          <div className="sidebar-page">
            <section className="content">
              <Container>
                <Outlet />
              </Container>
            </section>
          </div>
        </section>
      </>
    );
  }, [isAppLoaded]);

  return <div className="wrapper">{getAppTemplate()}</div>;
};

export default Main;
