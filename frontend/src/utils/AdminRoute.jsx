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
            navigate('/');
            showSnackbar('Wymagane uprawnienia administratora', 'error');
        }
        hideLoading()
    }, []);

    if (user !== 'admin') {
        return null
    } else {
        return children;
    }
};

export default AdminRoute;
