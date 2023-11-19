import React from 'react';
import { useEffect, useState } from "react";
import { vendiaClient } from '../vendiaClient';

export const { client } = vendiaClient();

export const DataContext = React.createContext()

export const DataProvider = ({ children }) => {

  // data for both test and device
  const [device, setDevice] = useState('');

  // test data
  const [testID, setTestID] = useState(0);
  const [testList, setTestList] = useState();
  const [orgAssignment, setOrgAssignment] = useState('');
  const [testName, setTestName] = useState('');
  const [testMethod, setTestMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [completed, setCompleted] = useState(false);
  const [updatedBy, setUpdatedBy] = useState('');

  // device data
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [deviceList, setDeviceList] = useState();
  const [newDevice, setNewDevice] = useState('')

  useEffect(() => {
    const listTests = async () => {
      const listTestsResponse = await client.entities.test.list({readMode:'NODE_LEDGERED',});
      setTestList(listTestsResponse?.items);
    }
    const listDevice = async () => {
      const listDeviceResponse = await client.entities.device.list({readMode:'NODE_LEDGERED',});
      setDeviceList(listDeviceResponse?.items)
    }
    listTests();
    listDevice();
  }, [deviceList])

  const dataValue = {
    device: [device, setDevice], 
    testID: [testID, setTestID], 
    testList: [testList, setTestList],
    orgAssignment: [orgAssignment, setOrgAssignment],
    testName: [testName, setTestName],
    testMethod: [testMethod, setTestMethod],
    notes: [notes, setNotes],
    completed: [completed, setCompleted],
    updatedBy: [updatedBy, setUpdatedBy],
    status: [status, setStatus],
    progress: [progress, setProgress],
    deviceList: [deviceList, setDeviceList],
    newDevice: [newDevice, setNewDevice]
  }

  return (
    <div>
      <DataContext.Provider value={dataValue}>
        {children}
      </DataContext.Provider>
    </div>
  )
};

