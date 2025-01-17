import { Navigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import AuthContext from '../context/AuthContext'

const UserRoute = ({children, ...rest}) => {
    let { user } = useContext(AuthContext)

    return !user ? <Navigate to='/'/> : children;
}

export default UserRoute;