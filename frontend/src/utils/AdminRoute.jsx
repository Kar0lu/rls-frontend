import { Navigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import AuthContext from '../context/AuthContext'

const AdminRoute = ({children, ...rest}) => {
    let { user } = useContext(AuthContext)

    return user!='admin' ? <Navigate to='/'/> : children;
}

export default AdminRoute;