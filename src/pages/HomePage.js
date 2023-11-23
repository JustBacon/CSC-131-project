import React, { useState } from 'react';
import '../styles/App.css';
import { Button, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext } from "react";
import { vendiaClient } from '../vendiaClient';
import { DataContext } from '../context/dataContext';
import { Link } from 'react-router-dom';
import { DeviceNameInput } from '../component/deviceNameInput';
import { PopupForm } from '../component/PopupForm';

export const { client } = vendiaClient();

export const HomePage = () => {

  const [deviceList, setDeviceList] = useContext(DataContext).deviceList
  const [device, setDevice] = useContext(DataContext).device
  const [searchDeviceInput, setSearchDeviceInput] = useState("")
  const [popupButton, setPopupButton] = useState(false)
  const [tempDevice, setTempDevice] = useState("")
  const [newDevice, setNewDevice] = useContext(DataContext).newDevice
  

  const addDevice = async () => {
    const checkDeviceName = await client.entities.device.list({
      filter: {
        Device: {
          eq: newDevice
        }
      }
    },
    {readMode:'NODE_LEDGERED',})

    if (checkDeviceName.items.length === 0) {
      const addDeviceResponse = await client.entities.device.add({
        Device: newDevice,
        Status: "active",
        Progress: 0
      })
      console.log(addDeviceResponse)
    }
    setNewDevice("")
    refreshList()
    console.log(newDevice)
  }

  const refreshList = async () => {
    const listDeviceResponse = await client.entities.device.list({readMode:'NODE_LEDGERED'});
    setDeviceList(listDeviceResponse?.items);
  }

  const handleDelete = async () => {
    console.log(tempDevice)
    deleteAllTest(tempDevice)// Device
    await deleteDevice(tempDevice)
    refreshList()
  }

  const deleteDevice = async (value) => {
    const checkResponse = await client.entities.device.list({
      filter: {
        Device: {
          eq: value,
        },
      },
    },
    {readMode:'NODE_LEDGERED',})

    const deleteDevice = await client.entities.device.remove(checkResponse.items[0]._id)
    console.log(deleteDevice)
  }

  const deleteAllTest = async (value) => {
    const checkResponseTest = await client.entities.test.list({
      filter: {
        Device: {
          eq: value,
        },
      },
    },
    {readMode:'NODE_LEDGERED',})

    for (let i = 0; i < checkResponseTest.items.length; i++) {
      const deleteTest = await client.entities.test.remove(checkResponseTest.items[i]._id)
      console.log(deleteTest)
    }

  }

  const searchDevice = async (value) => {
    const checkDeviceName = await client.entities.device.list({
      filter: {
        Device: {
          contains: value
        }
      }
    },
    {readMode:'NODE_LEDGERED',})
    console.log(checkDeviceName.items)
    setDeviceList(checkDeviceName.items)
  }

  const handleSearchChange = (event) => {
    setSearchDeviceInput(event.target.value);
    event.target.value ? searchDevice(event.target.value) : refreshList();
  }

  const renameDevice = async () => {
    console.log(tempDevice)
    console.log(newDevice)
    setPopupButton(false)
    const checkResponseTest = await client.entities.test.list({
      filter: {
        Device: {
          eq: tempDevice,
        },
      },
    },
    {readMode:'NODE_LEDGERED',})
    if (newDevice !== "") {
      for (let i = 0; i < checkResponseTest.items.length; i++) {
        const updateTestResponse = await client.entities.test.update({
          _id: checkResponseTest.items[i]._id,
          Device: newDevice
        })
        console.log(updateTestResponse)
      }
    }
    const checkResponse = await client.entities.device.list({
      filter: {
        Device: {
          eq: tempDevice,
        },
      },
    },
    {readMode:'NODE_LEDGERED',})

    if (newDevice !== "") {
      const updateDeviceResponse = await client.entities.device.update({
        _id: checkResponse.items[0]._id,
        Device: newDevice
      })
      console.log(updateDeviceResponse)
    }
    setNewDevice("")
    refreshList()
  }

  const handleEditButton = (event) => {
    setTempDevice(event.target.id)
    setPopupButton(true)
  }


  const updateDeviceProgress = async (device) => {
    const response = await client.entities.device.list({
        filter:{
            Device:{
                eq: device
            }
        }
    },
    {readMode:'NODE_LEDGERED',})

    const totalDeviceResponse = await client.entities.test.list({
        filter: {
            Device: {
                eq: device
            }
        }
    },
    {readMode:'NODE_LEDGERED',})

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
        }
    },
    {readMode:'NODE_LEDGERED',})

    const updateProgressResponse = await client.entities.device.update({
        _id: response.items[0]._id,
        Progress: parseInt((totalCompletedResponse.items.length / totalDeviceResponse.items.length) * 100) || 0
    })
    console.log(updateProgressResponse)
}

  return (
    <div>
      <div><h2 id="subtitle-name">Device List:</h2></div>
      <div id="search-for-device">
        <form autoComplete="off">

          <input id="search-for-device-input"
            type="text"
            name="deviceName"
            placeholder="Device Name"
            onChange={handleSearchChange}
            value={searchDeviceInput}
          />
          <Button id="search-for-device-button" variant="primary">Search</Button>
        </form>
      </div>

      <div className="container">
        <div className="add-device-button-div">
          <DeviceNameInput id="add-device-input" />
          <Button id="add-device-button" variant="primary" onClick={addDevice}>New Device</Button>
        </div>
        {deviceList?.map((item, index) => (
          <div key={index} className="item-box">
            <div className="item-device-homepage">
              {item.Device}
            </div>
            <br />
            <div className="progress-bar-container">
              <ProgressBar now={item.Progress} label={`${item.Progress}%`} />
            </div>
            <br />
            <Link to={`/testlist/${item.Device}`} className="custom-link">
              <Button className="button-shadow-effects" variant="secondary">View Test</Button>
            </Link>
            <Button className="delete-device-button" id={item.Device} onClick={handleEditButton}>Edit</Button>
            {/* <Button className="delete-device-button" variant="secondary" id={item.Device} onClick={handleDelete}>Delete</Button> */}
          </div>
        ))}
        <PopupForm trigger={popupButton} setTrigger={setPopupButton}>
          <form>
            <DeviceNameInput id="add-device-input" />
            <Button onClick={renameDevice}>update</Button>
            <Button className="delete-device-button" variant="secondary" onClick={handleDelete}>Delete All</Button>
          </form>
        </PopupForm>
      </div>
    </div>
  )
};
