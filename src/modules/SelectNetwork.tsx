import React, { useState } from "react";
import queryString from "query-string";

import * as AuthService from "services/auth_service";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Panel } from "rsuite";

const SelectNetwork = () => {
  const defaultList: any[] = [];

  const [list, setList] = useState([]);

  useEffect(() => {
    AuthService.getMyNetworkList().then((resp) => {
      //console.log(resp);

      if (resp.Success) {
        setList(resp.Data);
      } else {
        toast.error(resp.ErrorMessage);
      }
    });
  }, []);

  return (
    <>
      <section className="content">
        <div className="sidebar-page">
          <section className="content">
            <Container>
              <Panel
                header="Select network"
                shaded
                className="m-5 text-lg-left">
                {list.map((i: any) => (
                  <h6 key={i.Id} className="p-2">
                    <Link to={`/${i.Id}`}>{i.Name}</Link>
                  </h6>
                ))}
              </Panel>
              <Panel>
                <h1></h1>
              </Panel>
            </Container>
          </section>
        </div>
      </section>
    </>
  );
};

export default SelectNetwork;
