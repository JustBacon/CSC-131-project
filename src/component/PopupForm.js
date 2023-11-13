import React from 'react'
import { Button } from 'react-bootstrap'
import '../styles/Popup.css'

export const PopupForm = (props) => {
  return (props.trigger) ? (
    <div className="popup">
        <div className="popup-inner">
            <Button className="close-btn" onClick={() => props.setTrigger(false)}>Close</Button>
            {props.children}
        </div>
    </div>
  ) : "";
}
