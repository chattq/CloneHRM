import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import Link from "components/NetworkLink";
import {
  Container,
  Header,
  Content,
  Stack,
  IconButton,
  Panel,
  Grid,
  Row,
  Col,
  Badge,
  Form,
  Button,
  ButtonToolbar,
  TagPicker,
  InputGroup,
  Input,
  Modal,
} from "rsuite";
import store from "store/store";
import { FiEdit2, FiTrash } from "react-icons/fi";
import { AiFillEye } from "react-icons/ai";
import TableStandard, { ColumDataProps } from "components/table/TableStandard";
import { Icon } from "@rsuite/icons";
import { useWindowSize } from "hooks/useWindowSize";
import Avatar from "components/Avatar";
import { useLocalization } from "hooks/useLocalization";
import { BsDot, BsPlus, BsPlusCircle, BsSearch } from "react-icons/bs";

import { useNetworkNavigate } from "hooks/useNetworkNavigate";
import { v4 as uuid } from "uuid";

import { ShowError, Confirm } from "components/Dialogs/Dialogs";
import position_service from "services/position_service";
import { toast } from "react-toastify";
import PositionEdit from "./PositionEdit";

const PositionList = () => {
  const _l = useLocalization("PositionList");

  const { OrgId, NetworkId } = store.getState().orgInfo;
  const windowSize = useWindowSize();
  const [loadDataKey, setLoadDataKey] = useState("0");
  const [keyword, setKeyword] = useState("");
  const defautCheckedItems: string[] = [];
  const [checkedItems, setCheckedItems] = useState(defautCheckedItems);
  const [currentDetailCode, setCurrentDetailCode] = useState(<></>);
  const navigate = useNetworkNavigate();

  const fetchData = async ({
    page,
    limit,
    sortBy,
    sortDir,
  }: {
    page: number;
    limit: number;
    sortBy?: string;
    sortDir?: string;
  }) => {
    const resp = await position_service.search({
      Ft_PageIndex: page,
      Ft_PageSize: limit,
      OrgId: OrgId.toString(),
      Keyword: keyword,
    });

    if (resp.Success) {
      let data = resp.Data;
      let idx = data.PageIndex * data.PageSize;
      for (var item of data.DataList) {
        item.__idx = ++idx;
      }
    }

    return resp;
  };

  const StatusCell = ({ status }: { status: any }) => {
    if (status == "0")
      return (
        <span
          style={{
            background: "#aaa",
            color: "#333",
            padding: "3px 10px 3px 10px",
          }}
          className="text-sm">
          {_l("Inactive")}
        </span>
      );

    return (
      <span
        style={{
          background: "#4caf50",
          color: "#fff",
          padding: "3px 10px 3px 10px",
        }}
        className="text-sm">
        {_l("Active")}
      </span>
    );
  };

  const columnList: ColumDataProps[] = [
    {
      key: "__idx",
      label: _l("Idx"),
      width: 60,
    },
    {
      key: "mnnt_NNTFullName",
      label: _l("mnnt_NNTFullName"),
      cansort: false,
      width: 250,
      resizable: true,
    },
    {
      key: "PositionName",
      label: _l("PositionName"),
      width: 250,
      cansort: true,
      resizable: true,
      //fixed: true,
    },
    {
      key: "PositionDesc",
      label: _l("PositionDesc"),
      width: 200,
      resizable: true,
    },
    {
      key: "FlagActive",
      label: _l("FlagActive"),
      width: 100,
      flexGrow: 1,
      cell: (rowData: any) => <StatusCell status={rowData.FlagActive} />,
    },
  ];

  const handleEdit = (checkedItems: any[]) => {
    let code = checkedItems[0].PositionCode;
    setCurrentDetailCode(
      <PositionEdit code={code} uuid={uuid()} onSuccess={reloadList} />
    );
  };

  const handleAdd = () => {
    setCurrentDetailCode(
      <PositionEdit code="" uuid={uuid()} onSuccess={reloadList} />
    );
  };

  const handleDelete = (checkedItems: any[]) => {
    Confirm({
      title: _l("Delete position"),
      message:
        _l("Are you sure to delete position(s): ") +
        checkedItems.map((c) => c.PositionName).toString(),
      yes: () => {
        let listPosition = checkedItems.reduce(
          (lstPosition: any[], currentValue: any) => {
            lstPosition.push({
              NetworkId: NetworkId,
              OrgId: OrgId,
              PositionCode: currentValue.PositionCode,
            });
            return lstPosition;
          },
          []
        );
        position_service.remove(listPosition).then((resp) => {
          if (resp.Success) {
            toast.success(_l("Position data deleted"));
            reloadList();
          } else {
            ShowError(resp.ErrorData);
          }
        });
      },
    });
  };

  const genButtonsWhenChecked = (checkedKeys: string[]) => {
    if (checkedKeys.length == 1) {
      return (
        <Stack spacing={6}>
          <IconButton
            size="xs"
            appearance="primary"
            onClick={() => handleEdit(checkedKeys)}>
            <Icon as={FiEdit2}></Icon>
            {_l("Edit")}
          </IconButton>
          <IconButton
            size="xs"
            appearance="primary"
            color="orange"
            onClick={() => handleDelete(checkedKeys)}>
            <Icon as={FiTrash}></Icon>
            {_l("Delete")}
          </IconButton>
        </Stack>
      );
    }
    if (checkedKeys.length > 1) {
      return (
        <Stack spacing={6}>
          <IconButton
            size="xs"
            appearance="primary"
            color="orange"
            onClick={() => handleDelete(checkedKeys)}>
            <Icon as={FiTrash}></Icon>
            {_l("Delete")}
          </IconButton>
        </Stack>
      );
    }
  };

  //thay doi reload key de table load lai data
  const reloadList = () => {
    setLoadDataKey(uuid());
  };

  return (
    <>
      <Container>
        <Header className="page-header border-bottom">
          <Grid fluid>
            <Row>
              <Col md={8}>
                <span className="page-title">{_l("Position List")}</span>
              </Col>
              <Col md={8}>
                <Stack spacing={5} className="p-2">
                  <InputGroup inside style={{ width: "300px" }} size="sm">
                    <InputGroup.Button>
                      <Icon as={BsSearch}></Icon>
                    </InputGroup.Button>
                    <Input
                      placeholder={_l("Search")}
                      value={keyword}
                      onChange={(value) => {
                        setKeyword(value);
                        reloadList();
                      }}
                    />
                  </InputGroup>
                  <Button size="sm" appearance="primary" onClick={handleAdd}>
                    <Icon as={BsPlusCircle} className="mr-1" />
                    <span>{_l("Add new")}</span>
                  </Button>
                </Stack>
              </Col>
              <Col md={8}></Col>
            </Row>
          </Grid>
        </Header>
        <Content>
          <TableStandard
            columns={columnList}
            reloadKey={loadDataKey}
            dataKey="PositionCode"
            fetchData={fetchData}
            rowHeight={50}
            genButtonsWhenChecked={genButtonsWhenChecked}
            height={windowSize.height - 170}
          />
        </Content>
      </Container>

      {currentDetailCode}
    </>
  );
};

export default PositionList;
