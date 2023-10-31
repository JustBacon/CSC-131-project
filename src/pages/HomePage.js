import React, { useState } from 'react';
import '../styles/App.css';
import { Button, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext } from "react";
import { vendiaClient } from '../vendiaClient';
import { DataContext } from '../context/dataContext';
import { Link } from 'react-router-dom';
import { DeviceNameInput } from '../component/deviceNameInput';


export const { client } = vendiaClient();

export const HomePage = () => {

  const [deviceList, setDeviceList] = useContext(DataContext).deviceList
  const [device, setDevice] = useContext(DataContext).device
  const [searchDeviceInput, setSearchDeviceInput] = useState("")

  const addDevice = async () => {
    const checkDeviceName = await client.entities.device.list({
      filter: {
        Device: {
          contains: device
        }
      }
    })

    if (checkDeviceName.items.length === 0) {
      const addDeviceResponse = await client.entities.device.add({
        Device: device,
        Status: "active",
        Progress: 0
      })
      console.log(addDeviceResponse)
    }
    setDevice("")
    refreshList()
  }

  const refreshList = async () => {
    const listDeviceResponse = await client.entities.device.list();
    setDeviceList(listDeviceResponse?.items);
  }

  const searchDevice = async (value) => {
    const checkDeviceName = await client.entities.device.list({
      filter: {
        Device: {
          contains: value
        }
      }
    })
    console.log(checkDeviceName.items)
    setDeviceList(checkDeviceName.items)
  }

  const handleSearchChange = (event) => {
    setSearchDeviceInput(event.target.value);
    searchDevice(event.target.value);
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
          </div>
        ))}
        <div className="item-box">
          <DeviceNameInput id="add-device-input" />
          <Button id="add-device-button" variant="primary" onClick={addDevice}>+</Button>
        </div>
      </div>
    </div>
  )
};
