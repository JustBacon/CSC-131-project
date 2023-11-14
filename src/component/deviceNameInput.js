import { useState, useContext } from "react"
import { DataContext } from "../context/dataContext"

export const DeviceNameInput = () => {
    const [device, setDevice] = useContext(DataContext).device
    const [newDevice, setNewDevice] = useContext(DataContext).newDevice

    const handleDeviceChange = (event) => {
        // setDevice(event.target.value);
        setNewDevice(event.target.value);
    }

    return (
        <input
            type="text"
            name="device"
            placeholder="Device Name..."
            value={newDevice}
            onChange={handleDeviceChange}
        />
    )

}