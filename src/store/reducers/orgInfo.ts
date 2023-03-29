import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type } from 'os';


type OrgInfo = {
  NetworkId: string;
  OrgId: string;
  OrgData?: any;
};

// interface Test {
//   NetworkId: string;
//   OrgId: string;
//   OrgData?: any;
//   get: () => {
// 
//   }
// }
// 
// const rest: Test = {
//     NetworkId: '43',
//     OrgId: 'fkjds',
//     // OrgData: 43,
//     get: () => 4,
// }

// type Test2 = {
//     name: string,
//     age: number
// }
// 
// type Test3 = {
//     address: string,
// }
// 
// const hello: Test3  = {
//     // name: 'hello',
//     // age: 34,
//     address: 'hanam'
// }




const initialState: OrgInfo = { NetworkId: "0", OrgId: "0" };


export const orgInfoSlice = createSlice({
    name: 'orgInfo',
    initialState,
    reducers: {
        setOrgInfo: (state, { payload }) => {
            state.NetworkId = payload.NetworkId;
            state.OrgId = payload.OrgId;
            state.OrgData= payload.OrgData;

        },
    }
});

export const { setOrgInfo } = orgInfoSlice.actions;

export default orgInfoSlice.reducer;
