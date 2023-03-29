import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "modules/main/Main";
import Login from "modules/login/Login_sso";
import { useWindowSize } from "hooks/useWindowSize";
import { calculateWindowSize } from "utils/common";
import { useDispatch, useSelector } from "react-redux";
import { setWindowSize } from "store/reducers/ui";
import PublicRoute from "routes/PublicRoute";
import PrivateRoute from "routes/PrivateRoute";
import Page404 from "pages/Page404";
import LoginIgoss from "modules/login/Login_igoss";
import { RouteList } from "routes/RouteConfig";
import { v4 as uuid } from "uuid";
import PageOutlet from "modules/main/PageOutlet";
import SelectNetwork from "modules/SelectNetwork";
const App = () => {
  const windowSize = useWindowSize();
  const screenSize = useSelector((state: any) => state.ui.screenSize);
  const dispatch = useDispatch();

  useEffect(() => {
    const size = calculateWindowSize(windowSize.width);
    if (screenSize !== size) {
      dispatch(setWindowSize(size));
    }
  }, [windowSize]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/loginigoss" element={<LoginIgoss />} />
        </Route>

        <Route path="/loginigoss" element={<LoginIgoss />}></Route>

        <Route path="/selectnetwork" element={<SelectNetwork />} />

        <Route path="/notfound" element={<Page404 />} />

        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Main />}>
            <Route path="*" element={<Page404 />} />
            {RouteList.map((item) => {
              let page: any =
                item != null ? (
                  <PageOutlet>{item.getPageElement()}</PageOutlet>
                ) : null;

              return (
                <Route
                  path={`/:networkId${item.path}`}
                  element={page != null ? page : <Page404 />}
                  key={uuid()}
                />
              );
            })}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
