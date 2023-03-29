import * as api from "./helper";

const getAllActive = async () => {
  console.log(await api.post("Mst_Department/GetAllActive", {}));
  return await api.post("Mst_Department/GetAllActive", {});
};

const search = async (params: {
  Ft_PageIndex: any;
  Ft_PageSize: any;
  OrgId?: any;
  Keyword?: any;
  FlagActive?: any;
}) => {
  return await api.post("Mst_Department/Search", params);
};

const getByCode = async (code: string) => {
  return await api.post("Mst_Department/GetByDepartmentCode", {
    DepartmentCode: code,
  });
};

const update = async (data: any) => {
  //create
  if (!data.DepartmentCode || data.DepartmentCode === "") {
    data.isNew = true;
    let str = JSON.stringify(data);
    return await api.post("Mst_Department/create", { strJson: str });
  } else {
    //update
    let str = JSON.stringify(data);
    return await api.post("Mst_Department/update", { strJson: str });
  }
};

const remove = async (data: any) => {
  let str = JSON.stringify(data);
  return await api.post("Mst_Department/DeleteMultiple", { strJson: str });
};

export default { getAllActive, search, getByCode, update, remove };
