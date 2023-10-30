import React from 'react';
import '../styles/App.css';
import { Button, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext } from "react";
import { vendiaClient } from '../vendiaClient';
import { DataContext } from '../context/dataContext';
import { Link, Navigate } from 'react-router-dom';
import { DeviceNameInput } from '../component/deviceNameInput';
import { getAuth, signOut } from 'firebase/auth';
import { auth } from '../configuration/firebase';
import { useNavigate } from 'react-router-dom';


export const { client } = vendiaClient();

export const HomePage = () => {

  const [deviceList, setDeviceList] = useContext(DataContext).deviceList
  const [device, setDevice] = useContext(DataContext).device
  const user = auth.currentUser;
  const navigate = useNavigate();

  //show the user signed in as
  if(user){
    console.log('Signed in as: ', user.displayName);
  } else {
    console.log('No user signed in');
  }

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

  //function to sign out
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log('User signed out');
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        //sends them to login page
        navigate('/login');
      })
      .catch((error) => {
        // An error happened.
        console.error(error);
      });
  };

  return (
    <div>
      <div>
        <h1 className="title-header">
          <img src="AlgorithmAlliesLogo.png"/>
          Algorithm Allies Team 6
          <div className="sign-out-button-header-div">
            <Button id="sign-out-button" variant="danger" onClick={handleSignOut}>Sign out</Button>
            {user ? (<p className='user-signed-in-email'>Signed in as : {user.email}</p>) : <p className='user-signed-in-email'>Not signed in</p>}
          </div>
          <div className='show-user-email-before-hovering'><p>See who is signed in</p></div>
        </h1>
      </div>
      <div><h2 id="subtitle-name">Device List:</h2></div>
      <div id="search-for-device">
        <input id="search-for-device-input"
          type="text"
          name="deviceName"
          placeholder="Device Name"
        />
        <Button id="search-for-device-button" variant="primary">Search</Button>
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
        )
        )}
        <div className="item-box">
          <DeviceNameInput id="add-device-input"/>
          <Button id="add-device-button" variant="primary" onClick={addDevice}>+</Button>
        </div>
      </div>
    </div>
  )
};
