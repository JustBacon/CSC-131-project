import { useContext, useEffect } from "react"
import { DataContext } from "../context/dataContext"

export const DeviceNameDropDown = () => {
    const [device, setDevice] = useContext(DataContext).device
    // eslint-disable-next-line
    const [deviceList, setDeviceList] = useContext(DataContext).deviceList

    useEffect(() => {
        setDevice("device1")
    }, [])

    const handleDeviceChange = (event) => {
        setDevice(event.target.value);
    }

    return (

        <div>
            <select name="device" value={device} onChange={handleDeviceChange}>
                {deviceList?.map((item, index) => (
                    <option key={index} value={item.Device}>{item.Device}</option>
                )
                )}
            </select>
        </div>
    )

}