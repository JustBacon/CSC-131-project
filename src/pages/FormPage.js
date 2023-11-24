import React, { useContext } from 'react';
import { vendiaClient } from '../vendiaClient';
import { DataContext } from '../context/dataContext';
import { DeviceNameDropDown } from '../component/deviceNameDropDown';
import '../styles/App.css';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const { client } = vendiaClient();

export const FormPage = () => {

    // data for both test and device
    // eslint-disable-next-line
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
            Completed: false,
            UpdatedBy: updatedBy
        })
        console.log(addTestResponse)
        updateDeviceProgress()
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
        const listTestsResponse = await client.entities.test.list({readMode:'NODE_LEDGERED'});
        setTestList(listTestsResponse?.items);
    }

    // When button is clicked remove the test
    // function to remove a device
    const deleteTest = async (event) => {
        const removeDeviceResponse = await client.entities.test.remove(event.target.id)
        console.log(removeDeviceResponse)
        refreshList()
    }

    const updateDeviceProgress = async () => {
        const response = await client.entities.device.list({
            filter:{
                Device:{
                    eq: device
                }
            },readMode: 'NODE_LEDGERED'
        })

        const totalDeviceResponse = await client.entities.test.list({
            filter: {
                Device: {
                    eq: device
                }
            },readMode: 'NODE_LEDGERED'
        })

        const totalCompletedResponse = await client.entities.test.list({
            filter:{
                Device: {
                    eq: device
                },
                _and:{
                    Completed:{
                        eq: true
                    }
                }
            },readMode: 'NODE_LEDGERED'
        })

        const updateProgressResponse = await client.entities.device.update({
            _id: response.items[0]._id,
            Progress: parseInt((totalCompletedResponse.items.length / totalDeviceResponse.items.length) * 100) || 0
        })
        console.log(updateProgressResponse)
    }

    return (
        <div>
            <div><h2 id="subtitle-name">Form Page: add a Test</h2></div>
            <div>
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <div className="general-div">
                        <h5>Choose a device: </h5>
                        <DeviceNameDropDown />
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
                <div className="device-number-div">
                    {testList?.map((item) => (
                        <div key={item._id}>
                            {item.Device}:
                            <Button className="delete-device-button" variant="secondary" id={item._id} onClick={deleteTest}>x</Button>
                            <Button className="update-device-button" variant="secondary" id={item._id} onClick={updateTest}>update</Button>
                        </div>
                    )
                    )}
                </div>
            </div>
        </div>
    )
};