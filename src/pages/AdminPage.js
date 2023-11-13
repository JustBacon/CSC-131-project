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
import { doc, updateDoc, getDoc, getDocs, arrayUnion, collection } from 'firebase/firestore';


export const { client } = vendiaClient();

export const AdminPage = () => {
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [isAdmin, setIsAdmin] = useContext(AuthContext).isAdmin;
    const [orgName, setOrgName] = useState("");

    //creating an organization
    const handleCreateOrg = async () => {
        //get the last element
        let lastOrgAddedName = "";
        try {
            const docRef = doc(db, "organization", "orgList");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const orgsArray = docSnap.data().orgs;    
                //check if array is empty
                if(orgsArray.length > 0) {
                    lastOrgAddedName = orgsArray[orgsArray.length-1];
                    //compare the data
                    if(lastOrgAddedName === orgName){
                        setOrgName("");
                        alert("Failed to add: " + orgName + ".\n\nOrg already created");
                    }
                    else {//if the org is not the last element in the database, try adding it
                        try{
                            const docRef = doc(db, "organization", "orgList");
                            await updateDoc(docRef, {
                            orgs: arrayUnion(orgName)
                            });  
                            //show message if org was added to the orgs database
                            const orgSuccessfullyAdded = await compareLastOrgAdded();
                            if(orgSuccessfullyAdded) {
                                alert("Successfully added: " + orgName);
                            } else {
                                alert("Failed to add: " + orgName + ".\n\nOrg already created");
                            }
                            showOrgNames();
                        } catch(error){
                            alert("Failed to add: " + orgName + ".\n\nOrg already created");
                        }
                    }
                }
            }
        } catch (error){
            console.log(error);
        }
    };

    //console.logs all the org names in the array orgs
    const showOrgNames = async () => {
        try {
          const docRef = doc(db, "organization", "orgList");
          const docSnap = await getDoc(docRef);
      
          if (docSnap.exists()) {
            // Log the entire array of organization names
            const orgsArray = docSnap.data().orgs;
            console.log("Organization Names:", orgsArray);
          } else {
            console.log("Document 'orgList' not found");
          }
        } catch (error) {
          console.error("Error fetching orgList:", error);
        }
    };

    //after button is clicked, check if the orgName is already in the list, then perform actions of adding
    //if the orgName is already in the list then, show the alert, otherwise tell user they have added the org

    //get the last org added. this will be used to alert the user if their org was added
    const compareLastOrgAdded = async () => {
        try {
            const docRef = doc(db, "organization", "orgList");
            const docSnap = await getDoc(docRef);
        
            if (docSnap.exists()) {
                const orgsArray = docSnap.data().orgs;    
                //check if array is empty
                if(orgsArray.length > 0) {
                    const lastOrgAddedName = orgsArray[orgsArray.length-1];
                    if(lastOrgAddedName === orgName){
                        setOrgName("");
                        return true;
                    } else {
                        setOrgName("");
                        return false;
                    }
                }
            }
        } catch (error){
            console.error(error);
            return false;
        }
    };

    //checks if the database contains the value
    const checkOrgListContains = async () => {
        const orgNameString = String(orgName);
        const docRef = doc(db, "organization", "orgList", orgNameString);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log(orgName + " exists");
        } else {
            console.log(orgName + " does not exist");
        }
    };



    //get the orgList and if orgName is in orgList then tell the user their org wasnt made

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