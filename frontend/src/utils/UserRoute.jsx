import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { useOverlay } from '../context/OverlayContext';

const UserRoute = ({ children, ...rest }) => {
    const { showSnackbar, showLoading, hideLoading } = useOverlay();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        showLoading();
        if (user !== 'user') {
            if(user) {
                navigate('/harmonogram');
            } else {
                navigate('/');
            }
            showSnackbar('Wymagany status użytkownika', 'error');
        }
        hideLoading()
    }, []);

    if (user === 'user') {
        return children
    } else {
        return null;
    }
};

export default UserRoute;