import React from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from '../context/AuthContext';
import { useContext } from "react";

export const Protected = () => {
    const [isAdmin, setIsAdmin] = useContext(AuthContext).isAdmin;
   

    return (
        isAdmin ? <Outlet /> : <Navigate to="/" />
    )
}