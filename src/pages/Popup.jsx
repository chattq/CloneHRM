import { wait } from "@testing-library/user-event/dist/utils";
import React, { useState } from "react";
import { useEffect } from "react";
import { Modal, Button } from 'rsuite';
import * as testservice from 'services/testdata_service';
import { sleep } from "utils/common";

const Popup = ({ itemIndex, uuid }) => {
    const [open, setOpen] = useState(false);
    const [detail, setDetail] = useState('Loading...');
    const handleClose = () => setOpen(false);


    const load = async () => {

        
        var data = await testservice.getTable({ pageIndex: itemIndex, pageSize: 1 });

        
        setDetail(JSON.stringify(data.data));


    };
    useEffect(() => {
        setOpen(true);
        setDetail('Loading...');
        
        load();

    }, [uuid]);

    return (
        <>
            {
                open ?

                    <Modal open={true} onClose={handleClose}>
                        <Modal.Header>
                            <Modal.Title>Modal Title</Modal.Title>

                        </Modal.Header>
                        <Modal.Body>
                            <p className="m-5">
                                {detail}
                            </p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={handleClose} appearance="primary">
                                Ok
                            </Button>
                            <Button onClick={handleClose} appearance="subtle">
                                Cancel
                            </Button>
                        </Modal.Footer>
                    </Modal> : <></>
            }

        </>
    )
};
export default Popup;