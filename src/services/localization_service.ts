
import * as api from './helper'

const ccsDomain: string = `${process.env.REACT_APP_CCS_BASE_URL}`;
const solutionCode: string = `${process.env.REACT_APP_SOLUTION_CODE}`;

export const loadData: any = async () => {
    var resp = await api.post(`${ccsDomain}/api/localization/GetData`, { solutionCode: solutionCode });

    if (resp.Success) {
        return resp.Data;
    }

};

export const addData = async (values: any) => {
    var resp = await api.post(`${ccsDomain}/api/localization/AddData`, { solutionCode: solutionCode, values: values });

    if (resp.Success) {
        return resp.Data;
    }

};