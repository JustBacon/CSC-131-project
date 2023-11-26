import React, { useContext, useEffect, useState } from 'react';
import { vendiaClient } from '../vendiaClient';
import { DataContext } from '../context/dataContext';
import '../styles/App.css';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from 'react-router-dom';

const { client } = vendiaClient();

export const FormPage = () => {

    // data for both test and device
    
    const [deviceList, setDeviceList] = useContext(DataContext).deviceList

    // data for test
    const [testID, setTestID] = useContext(DataContext).testID
    const [testList, setTestList] = useContext(DataContext).testList
    const [orgAssignment, setOrgAssignment] = useContext(DataContext).orgAssignment
    const [testName, setTestName] = useContext(DataContext).testName
    const [testMethod, setTestMethod] = useContext(DataContext).testMethod
    const [notes, setNotes] = useContext(DataContext).notes
    const [completed, setCompleted] = useContext(DataContext).completed
    const [updatedBy, setUpdatedBy] = useContext(DataContext).updatedBy
    const data = useLocation();
    const [numberCompleted, setNumberCompleted] = useState(data.state.numCompleted)
    const [total, setTotal] = useState(data.state.total)

    // function to add device based on schema
    // need Device, TestID, OrgAssignment, TestName, Notes, Completed, UpdatedBy
    const addTest = async () => {

        let progress = 0
        // add test
        const addTestResponse = await client.entities.test.add({
            Device: data.state.name, // grabbed from Testlistpage when you click addtest button
            TestID: testID,
            OrgAssignment: orgAssignment,
            TestName: testName,
            TestMethod: testMethod,
            Notes: notes,
            Completed: completed,
            UpdatedBy: updatedBy
        })
        setTotal(total+1)
        console.log(completed)
        if (completed) {
            setNumberCompleted(numberCompleted + 1)
            progress = parseInt(((numberCompleted + 1) / (total + 1)) * 100)
        } else {
            setNumberCompleted(numberCompleted)
            progress = parseInt(((numberCompleted) / (total + 1)) * 100)
        }

        const response = await client.entities.device.list({
            filter: {
                Device: {
                    eq: data.state.name
                }
            }, readMode: 'NODE_LEDGERED'
        })

        const updateProgressResponse = await client.entities.device.update({
            _id: response.items[0]._id,
            Progress: progress
        })
        console.log(updateProgressResponse)
        var index = deviceList.findIndex(item => item._id === response.items[0]._id)
        deviceList[index].Progress = progress

        console.log(addTestResponse)
        setCompleted(false)
        // updateDeviceProgress()
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

    return (
        <div>
            <div><h2 id="subtitle-name">Form Page: add a Test</h2></div>
            <div>
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <div className="general-div">
                        {/* <h5>Choose a device: </h5>
                        <DeviceNameDropDown data={data} /> */}
                        <p>{data.state.numCompleted}</p>
                        <p>{JSON.stringify(data.state)}</p>
                    </div>
                    <div className="general-div">
                        <h5>Test number: </h5>
                        <input
                            type="number"
                            pattern="[0-9]*"
                            name="testID"
                            value={testID}
                            onChange={handletestIDChange}
                        />
                    </div>
                    <div className="general-div">
                        <h5>Organization name: </h5>
                        <input
                            type="text"
                            name="orgAssignment"
                            placeholder="Org Assignment"
                            value={orgAssignment}
                            onChange={handleOrgAssignmentChange}
                            required
                        />
                    </div>
                    <div className="general-div">
                        <h5>Test name:</h5>
                        <input
                            type="text"
                            name="testName"
                            placeholder="Test Name"
                            value={testName}
                            onChange={handleTestNameChange}
                            required
                        />
                    </div>
                    <div className="general-div">
                        <h5>Test Method: </h5>
                        <input
                            type="text"
                            name="testMethod"
                            placeholder="Test Method"
                            value={testMethod}
                            onChange={handleTestMethod}
                            required
                        />
                    </div>
                    <div className="general-div">
                        <h5>Testing notes: </h5>
                        <input
                            type="text"
                            name="testNotes"
                            placeholder="Test Notes"
                            value={notes}
                            onChange={handleNotes}
                        />
                    </div>
                    <div className="general-div">
                        <h5>Mark: </h5>
                        <input
                            type="checkbox"
                            value={completed}
                            onChange={handleCompleted}
                        />
                        <span>Completed</span>
                    </div>
                    <div className="general-div">
                        <h5>Your name: </h5>
                        <input
                            type="text"
                            name="testupdatedBy"
                            placeholder="Updated by"
                            value={updatedBy}
                            onChange={handleUpdatedBy}
                            required
                        />
                    </div>

                    <input type="submit" />
                </form>

            </div>
        </div>
    )
};