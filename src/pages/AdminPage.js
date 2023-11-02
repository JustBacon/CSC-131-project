import React from 'react';
import { useContext } from "react";
import { vendiaClient } from '../vendiaClient';
import { DataContext } from '../context/dataContext';
import { Link } from 'react-router-dom';
import { DeviceNameInput } from '../component/deviceNameInput';
import '../styles/App.css';


export const { client } = vendiaClient();

export const AdminPage = () => {

    return (
        <div className='error-page-style'>
            <h1>AdminPage</h1>
        </div>
    )
};