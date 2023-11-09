import React from 'react';
import { useContext, useState, useEffect, useRef } from "react";
import { vendiaClient } from '../vendiaClient';
import { DataContext } from '../context/dataContext';
import { Form, Link } from 'react-router-dom';
import { DeviceNameInput } from '../component/deviceNameInput';
import '../styles/App.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { db } from '../configuration/firebase'
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';


export const { client } = vendiaClient();

export const AdminPage = () => {
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [isAdmin, setIsAdmin] = useContext(AuthContext).isAdmin;
    const [orgName, setOrgName] = useState('');

    //creating an organization
    const handleCreateOrg = async () => {
        try{
            const docRef = doc(db, "organization", "orgList");
            await updateDoc(docRef, {
            orgs: arrayUnion(orgName)
        });
            console.log("button clicked");
            //reset input field value
            setOrgName("");
            alert("You have created a new organization");
        } catch(error){
            console.log("error, button not working");
        }
    };
    //get the orgList and if orgName is in orgList then tell the user their org wasnt made
    
    //show the user a message they created an org


    //also makes the text lowercase
    const handleInputChange = (event) => {
        setOrgName(event.target.value.toLowerCase());
    };

    /*
    //just for ref
    const checkIfAdmin = async() => {
        try {
          const docRef = doc(db, "organization", "orgList")
          const docSnap = await getDoc(docRef)
          console.log(docSnap.data().roles[0])
          console.log(isAdmin)
          docSnap.data().roles[0] === "admin" ? setIsAdmin(true) : setIsAdmin(false)
    
        }catch(e){
          // ignoring some errors
          // it will console log saying user is undefined
        }
    }

    //just for ref
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          console.log(userCredential);
          const user = userCredential.user;
          const addUser = await setDoc(doc(db, "users", auth.currentUser.uid), {
            roles: ["default"]
          })
          localStorage.setItem('token', user.accessToken);
          localStorage.setItem('user', JSON.stringify(user));
          // Clear the email and password fields
          setEmail('');
          setPassword('');
          navigate("/");
        } catch (error) {
          console.error(error);
        }
      };
      */


    return (
        <div>
            <div className='error-page-style'>
                {isAdmin ? 
                <>
                    <h1>AdminPage</h1>
                    <form onSubmit={handleCreateOrg}>                   
                        <input 
                            id="search-for-device-input"
                            type="text"
                            placeholder="Organization Name"
                            value={orgName}
                            onChange={handleInputChange}
                            autoComplete='off'
                            autoFocus
                            onKeyDown={(e) => {
                                if(e.key === "Enter"){
                                    e.preventDefault();
                                    handleCreateOrg();
                                }
                            }}
                        />
                        <Button onClick={() => handleCreateOrg()}>Create Organization</Button>
                    </form>
                </>
                 :
                <> 
                    <h1>You are not an admin</h1>
                    <h1>Cannot Access !!!!!!!!</h1>
                    <Button variant='secondary' onClick={ () => navigate('/') }>Go home</Button>
                </>
                }
            </div>
        </div>
        
    )
};