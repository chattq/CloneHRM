import * as api from './helper'

const search = async (params: {
    Ft_PageIndex: any,
    Ft_PageSize: any,
    OrgId?: any,
    Keyword?: any
    FlagActive?: any,

}) => {
    return await api.post('Mst_Position/search', params);
};

const getByCode = async (code: string) => {
    return await api.post('Mst_Position/GetByPositionCode', { PositionCode: code });
};

const update = async (data: any) => {
    //create
    if (!data.PositionCode || data.PositionCode == "") {
        data.isNew = true;
        let str = JSON.stringify(data);
        return await api.post('Mst_Position/create', { strJson: str });
    }
    else {
        //update
        let str = JSON.stringify(data);
        return await api.post('Mst_Position/update', { strJson: str });
    }
};

const remove = async (data: any) => {
    //return await api.post('Mst_Position/delete', data);
    let str = JSON.stringify(data);
    return await api.post('Mst_Position/DeleteMultiple', { strJson: str });
};


export default { search, getByCode, update, remove }