import { v4 as uuid } from "uuid";
import React, { useState, useEffect, useMemo, useRef } from "react";

import { Table, Pagination, Checkbox, Row, Col, Grid, IconButton, Stack, Divider, Dropdown, ColumnProps, TableProps, Panel, Container, Loader, Whisper, Popover, Button, SelectPicker, Input } from "rsuite";
import Icon from "@rsuite/icons/lib/Icon";

import { FaAngleDown, FaCheck } from 'react-icons/fa';

import { useLocalization } from "hooks/useLocalization";
import { Block } from "@rsuite/icons";
import { BsThreeDotsVertical } from "react-icons/bs";
import { ColumnSizer } from "react-virtualized";
import ShowError from 'components/Dialogs/Error'
import FilterDropdown from "./FilterDropdown";

function TableRows({rowsData, deleteTableRows, handleChange} : {rowsData : any, deleteTableRows : any, handleChange : any}) {
debugger;
const _l = useLocalization('HolidaysTable');
console.log('rows-Data', rowsData);

    return(
        rowsData.map((data: any, index: any)=>{
            debugger;
            return(
                <tr key={index}>
                    <td>
                        <a className="btn btn-outline-danger" onClick={()=>(deleteTableRows(index))}>x</a>
                    </td>
                    <td>
                        {`${data.DayValue} - ${data.MonthValue}`}
                    </td>
                    <td>
                        {`${data.HolidayName}`}
                    </td>
                    
                </tr>
            );
        })
    );
    
}


function RenderHolidaysTable(data: any){
    const _l = useLocalization('HolidaysTable');
    const dataInit = data as [];
    const [rowsData, setRowsData] = React.useState([] as any);
    const lstMonths = [{'MonthCode':'01', 'MonthName':'01'},
        {'MonthCode':'02', 'MonthName':'02'},
        {'MonthCode':'03', 'MonthName':'03'},
        {'MonthCode':'04', 'MonthName':'04'},
        {'MonthCode':'05', 'MonthName':'05'},
        {'MonthCode':'06', 'MonthName':'06'},
        {'MonthCode':'07', 'MonthName':'07'},
        {'MonthCode':'08', 'MonthName':'08'},
        {'MonthCode':'09', 'MonthName':'09'},
        {'MonthCode':'10', 'MonthName':'10'}, 
        {'MonthCode':'11', 'MonthName':'11'}, 
        {'MonthCode':'12', 'MonthName':'12'}
    ];
    const [lstDays, setLstDays] = React.useState([] as any);
    const [holidayValue, setHolidayValue]= React.useState({} as any);
    //const [monthValue, setMonthValue] = React.useState('');
    //const [dayValue, setDayValue] = React.useState('');
    //const [holidayNameValue, setHolidayNameValue] = React.useState('');
    const addTableRows = ()=>{
        const rowsInput={
            'MonthValue':holidayValue.MonthValue,
            'DayValue':holidayValue.DayValue,
            'HolidayName':holidayValue.HolidayName
        };
        setRowsData([...rowsData, rowsInput]);
      
    }
   const deleteTableRows = (index: any)=>{
        const rows = [...rowsData];
        rows.splice(index, 1);
        setRowsData(rows);
   }
 
   const handleChange = (index : any, evnt: any)=>{
        const { name, value } = evnt.target;
        const rowsInput = [...rowsData];
        rowsInput[index][name] = value;
        setRowsData(rowsInput);
    }
    const getDaysOfMonth = (holidayValue : any)=>{
        debugger;
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        if(holidayValue.MonthValue !== undefined && holidayValue.MonthValue !== null && holidayValue.MonthValue.length > 0){
            month = parseInt(holidayValue.MonthValue);
        }
        let iCount = new Date(year, month, 0).getDate() as number;
        if(holidayValue.DayValue !== undefined && holidayValue.DayValue !== null && holidayValue.DayValue.length > 0){
            if(parseInt(holidayValue.DayValue) > iCount){
                holidayValue.DayValue = `${iCount}`;
                setHolidayValue(holidayValue);
                //setDayValue(`${iCount}`);
            }
        }
        let _lstDays = [];
        let i:number;
        for(let i = 1; i <= iCount; i++) {
            let _value = i<10 ? `0${i}` : `${i}`;
            _lstDays.push({
                'DayCode': _value,
                'DayName': _value,
            });
        }
        debugger;
        setLstDays(_lstDays);
    };
    useEffect(() => {
        debugger;
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        setHolidayValue({
            'MonthValue': month < 10 ? `0${month}` : `${month}`,
            'DayValue': day < 10 ? `0${day}` : `${day}`,
            'HolidayName': '',
        });
        //setMonthValue(month < 10 ? `0${month}` : `${month}`);
        //setDayValue(day < 10 ? `0${day}` : `${day}`);
        getDaysOfMonth(holidayValue);
    }, []);

    const handleOnChangeMonth = (currentValue: any) =>{
        debugger;
        let value = currentValue;
        let month = holidayValue.MonthValue;
        if(value!=month)
        {
            //setMonthValue(value);
            //getDaysOfMonth(value, dayValue);
            holidayValue.MonthValue = value;
            setHolidayValue(holidayValue);
            getDaysOfMonth(holidayValue);
        }
    };

    const handleOnChangeDate = (currentValue: any) =>{
        debugger;
        let value = currentValue;
        let date = holidayValue.DayValue;
        if(value!=date)
        {
            //setDayValue(value);
            //getDaysOfMonth(monthValue, value);
            holidayValue.DayValue = value;
            setHolidayValue(holidayValue);
            getDaysOfMonth(holidayValue);
            
        }
    };


    return(
        


        <div className="container">
            <div className="row">
                <div className="col-sm-1">
                    <SelectPicker 
                        name="MonthCode"
                        style={{ width: '100%' }}
                        labelKey='MonthName'
                        valueKey='MonthCode'
                        value={holidayValue.MonthValue}
                        data={lstMonths}//lstDays
                        onChange={handleOnChangeMonth}
                    />
                    
                </div>
                <div className="col-sm-1">
                    <SelectPicker 
                        name="DayCode"
                        style={{ width: '100%' }}
                        labelKey='DayName'
                        valueKey='DayCode'
                        value={holidayValue.DayValue}
                        data={lstDays}
                        onChange={handleOnChangeDate}
                    />
                    
                </div>
                <div className="col-sm-3">
                    <Input 
                        name="HolidayName"
                        style={{ width: '100%' }}
                        //value={holidayValue.HolidayName}
                        onChange={(currentValue: any)=>{
                            debugger;
                            let value = currentValue;
                            let holidayName = holidayValue.HolidayName;
                            if(value!=holidayName)
                            {
                                holidayValue.HolidayName = value;
                                setHolidayValue(holidayValue);
                            }
                        }}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-sm-8">
                
                <table className="table">
                    <thead>
                      <tr>
                            <th><a className="btn btn-outline-success" onClick={addTableRows} >+</a></th>
                          <th>{_l('Day')}</th>
                          <th>{_l('HolidayName')}</th>
                          
                      </tr>

                    </thead>
                    <tbody>
                        <TableRows rowsData={rowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} />
                   </tbody> 
                </table>

                </div>
                <div className="col-sm-4">

                </div>
            </div>
        </div>
    )

}
export default RenderHolidaysTable