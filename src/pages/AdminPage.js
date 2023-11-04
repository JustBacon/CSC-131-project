import React from 'react';
import { useContext } from "react";
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
    const [isAdmin, setIsAdmin] = useContext(AuthContext).isAdmin;

    //creating an organization
    const createOrganization = async() => {
        const docRef = doc(db, "organization", "orgList");
        await updateDoc(docRef, {
            orgs: arrayUnion('orgC')
        })
    }
    createOrganization();

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
                    <Form>
                        
                    </Form>
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