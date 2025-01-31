import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { useOverlay } from '../context/OverlayContext';

const AdminRoute = ({ children, ...rest }) => {
    const { showSnackbar, showLoading, hideLoading } = useOverlay();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        showLoading();
        if (user !== 'admin') {
            if(user) {
                navigate('/harmonogram');
            } else {
                navigate('/');
            }
            showSnackbar('Wymagany status administratora', 'error');
        }
        hideLoading()
    }, []);

    if (user === 'admin') {
        return children
    } else {
        return null;
    }
};

export default AdminRoute;
