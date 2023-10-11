import React, { useContext } from 'react';
import { useEffect, useState } from "react";
import { vendiaClient } from '../vendiaClient';
import { DataContext } from '../context/dataContext';
import { DeviceNameInput } from '../component/deviceNameInput';

const { client } = vendiaClient();

export const FormPage = () => {

    // data for both test and device
    const [device, setDevice] = useContext(DataContext).device

    // data for test
    const [testID, setTestID] = useContext(DataContext).testID
    const [testList, setTestList] = useContext(DataContext).testList
    const [orgAssignment, setOrgAssignment] = useContext(DataContext).orgAssignment
    const [testName, setTestName] = useContext(DataContext).testName
    const [testMethod, setTestMethod] = useContext(DataContext).testMethod
    const [notes, setNotes] = useContext(DataContext).notes
    const [completed, setCompleted] = useContext(DataContext).completed
    const [updatedBy, setUpdatedBy] = useContext(DataContext).updatedBy

    // data for device
    const [status, setStatus] = useContext(DataContext).status;
    const [progress, setProgress] = useContext(DataContext).progress;
    const [deviceList, setDeviceList] = useContext(DataContext).deviceList;

    // function to add device based on schema
    // need Device, TestID, OrgAssignment, TestName, Notes, Completed, UpdatedBy
    const addTest = async () => {
        const addTestResponse = await client.entities.test.add({
            Device: device,
            TestID: testID,
            OrgAssignment: orgAssignment,
            TestName: testName,
            TestMethod: testMethod,
            Notes: notes,
            Completed: completed,
            UpdatedBy: updatedBy
        })

        const checkDeviceName = await client.entities.device.list({
            filter: {
                Device: {
                    contains: device
                }
            }
        })

        if(checkDeviceName.items.length == 0){
            const addDeviceResponse = await client.entities.device.add({
                Device: device,
                Status: "active",
                Progress: 0
            })
        }
        refreshList()
    }

    const updateTest = async (event) => {
        if (device !== "") {
            const updateDeviceResponse = await client.entities.test.update({
                _id: event.target.id,
                Device: device,
                TestID: testID,
                OrgAssignment: orgAssignment,
                TestName: testName,
                TestMethod: testMethod,
                Notes: notes,
                Completed: completed,
                UpdatedBy: updatedBy
            })
            console.log(updateDeviceResponse)
            refreshList()
        }
    }

    const handletestIDChange = (event) => {
        setTestID(parseInt(event.target.value));
    }

    const handleOrgAssignmentChange = (event) => {
        setOrgAssignment(event.target.value);
    }

    const handleTestNameChange = (event) => {
        setTestName(event.target.value);
    }

    const handleTestMethod = (event) => {
        setTestMethod(event.target.value);
    }

    const handleNotes = (event) => {
        setNotes(event.target.value);
    }

    const handleCompleted = (event) => {
        setCompleted(event.target.checked);
    }

    const handleUpdatedBy = (event) => {
        setUpdatedBy(event.target.value);
    }

    // when user clicks on submit call addDevice
    const handleSubmit = (event) => {
        event.preventDefault();
        addTest();
    }


    // refreshList (i think there is a better way, idk how)
    // regrab the list from client and setTestList
    const refreshList = async () => {
        const listTestsResponse = await client.entities.test.list();
        setTestList(listTestsResponse?.items);
    }

    // When button is clicked remove the test
    // function to remove a device
    const deleteTest = async (event) => {
        const removeDeviceResponse = await client.entities.test.remove(event.target.id)
        refreshList()
    }

    return (
        <div>
            Algorithm Allies Team 6
            <div>
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="number"
                            pattern="[0-9]*"
                            name="testID"
                            value={testID}
                            onChange={handletestIDChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="orgAssignment"
                            placeholder="Org Assignment"
                            value={orgAssignment}
                            onChange={handleOrgAssignmentChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="testName"
                            placeholder="Test Name"
                            value={testName}
                            onChange={handleTestNameChange}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="testMethod"
                            placeholder="Test Method"
                            value={testMethod}
                            onChange={handleTestMethod}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="testNotes"
                            placeholder="Test Notes"
                            value={notes}
                            onChange={handleNotes}
                        />
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            value={completed}
                            onChange={handleCompleted}
                        />
                        <span>Completed</span>
                    </div>
                    <div>
                        <input
                            type="text"
                            name="testupdatedBy"
                            placeholder="Updated by"
                            value={updatedBy}
                            onChange={handleUpdatedBy}
                        />
                    </div>

                    <input type="submit" />
                </form>
                <div>
                    {testList?.map((item, index) => (
                        <div key={index}>
                            {item.Device}
                            <button id={item._id} onClick={deleteTest}>x</button>
                            <button id={item._id} onClick={updateTest}>update</button>
                        </div>
                    )
                    )}
                </div>
            </div>
        </div>
    )
};