import React, { useState } from "react";
import {
  Container,
  Header,
  Content,
  Stack,
  IconButton,
  Grid,
  Row,
  Col,
  Button,
  InputGroup,
  Input,
} from "rsuite";
import store from "store/store";

import { FiEdit2, FiTrash } from "react-icons/fi";

import TableStandard, { ColumDataProps } from "components/table/TableStandard";
import { Icon } from "@rsuite/icons";
import { useWindowSize } from "hooks/useWindowSize";
import { useLocalization } from "hooks/useLocalization";
import { BsPlusCircle, BsSearch } from "react-icons/bs";
import { v4 as uuid } from "uuid";
import { ShowError, Confirm } from "components/Dialogs/Dialogs";
import department_service from "services/department_service";
import { toast } from "react-toastify";
import DepEdit from "./DepEdit";

const DepList = () => {
  const _l = useLocalization("DeparmentList");

  const { OrgId, NetworkId } = store.getState().orgInfo;
  const windowSize = useWindowSize();
  const [loadDataKey, setLoadDataKey] = useState("0");
  const [keyword, setKeyword] = useState("");
  const [currentDetailCode, setCurrentDetailCode] = useState(<></>);

  //   call back để truyền data để thay đổi params + search
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
    const resp = await department_service.search({
      Ft_PageIndex: page,
      Ft_PageSize: limit,
      OrgId: OrgId.toString(),
      Keyword: keyword,
    });

    if (resp.Success) {
      let data = resp.Data;
      let idx = data.PageIndex * data.PageSize;
      //tạo id riêng, bắt đầu từ idx
      for (var item of data.DataList) {
        item.__idx = ++idx;
      }
    }

    return resp;
  };
  const StatusCell = ({ status }: { status: any }) => {
    if (status == "0")
      //trạng thái 0: ko active, trạng thái 1 là active
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
          background: "#9c440d",
          color: "#fff",
          padding: "3px 10px 3px 10px",
        }}
        className="text-sm">
        {_l("Active")}
      </span>
    );
  };

  // tạo ra các cột, có thể thêm sửa xóa cột

  const columnList: ColumDataProps[] = [
    {
      key: "__idx",
      label: _l("Idx"),
      width: 60,
    },
    {
      key: "DepartmentCode",
      label: _l("DepartmentCode"),
      width: 150,
      cansort: true,
      fixed: true,
      alwayShow: true,
    },
    {
      key: "DepartmentName",
      label: _l("DepartmentName"),
      cansort: false,
      width: 250,
      resizable: true,
      alwayShow: true,
    },
    {
      key: "ss_QtyStaff",
      label: _l("Staff count"),
      width: 150,
      resizable: true,
    },
    {
      key: "md_DepartmentNameParent",
      label: _l("Parent"),
      width: 200,
      resizable: true,
      cansort: true,
    },
    {
      key: "DepartmentDesc",
      label: _l("DepartmentDesc"),
      width: 200,
    },
    {
      key: "FlagActive",
      label: _l("DepartmentDesc"),
      width: 100,
      flexGrow: 1,
      //   truyền vào trạng thái active
      cell: (rowData: any) => <StatusCell status={rowData.FlagActive} />,
    },
  ];

  const handleEdit = (checkedItems: any[]) => {
    let code = checkedItems[0].DepartmentCode;
    setCurrentDetailCode(
      <DepEdit code={code} uuid={uuid()} onSuccess={reloadList} />
    );
  };

  // thay đổi
  const handleAdd = () => {
    setCurrentDetailCode(
      <DepEdit code="" uuid={uuid()} onSuccess={reloadList} />
    );
  };

  const handleDelete = (checkedItems: any[]) => {
    Confirm({
      title: _l("Delete department"),
      message:
        _l("Bạn có muốn xóa phần tử:") +
        checkedItems.map((c) => c.DepartmentName).toString(),
      // đồng ý
      yes: () => {
        // push phần tử đó vào 1 danh sách và gửi lên API ở hàm dưới
        let listDepartment = checkedItems.reduce(
          (lstDepartment: any[], currentValue: any) => {
            lstDepartment.push({
              NetworkId: NetworkId,
              OrgId: OrgId,
              DepartmentCode: currentValue.DepartmentCode,
            });
            return lstDepartment;
          },
          []
        );
        department_service.remove(listDepartment).then((resp) => {
          if (resp.Success) {
            toast.success("Đã xóa thành công");
            reloadList();
          } else {
            ShowError(resp.ErrorData);
          }
        });
      },
    });
  };

  // thay đổi khi click vào check
  const genButtonsWhenChecked = (checkedKeys: any[]) => {
    if (checkedKeys.length === 1) {
      return (
        <Stack spacing={6}>
          <IconButton
            size="xs"
            // chỉnh màu sắc
            style={{ backgroundColor: "black" }}
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
    // nếu nhiều quá thì là xóa
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
                <span className="page-title">{_l("Department List")}</span>
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
                  <Button
                    size="sm"
                    appearance="primary"
                    style={{ background: "#fb9768" }}
                    onClick={handleAdd}>
                    <Icon as={BsPlusCircle} className="mr-1" />
                    <span>{_l("Add new")}</span>
                  </Button>
                </Stack>
              </Col>
              <Col md={8}></Col>
            </Row>
          </Grid>
        </Header>

        {/* phần nội dung bên dưới */}
        <Content>
          <TableStandard
            columns={columnList}
            reloadKey={loadDataKey}
            dataKey="DepartmentCode"
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

export default DepList;
