import { useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import AuthContext from '../context/AuthContext'
import { useOverlay } from '../context/OverlayContext';

const UserRoute = ({children, ...rest}) => {
    const { showSnackbar, showLoading, hideLoading } = useOverlay();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        showLoading();
        if (!user) {
            navigate('/');
            showSnackbar('Wymagane zalogowanie', 'error');
        }
        hideLoading()
    }, []);

    if (!user) {
        return null
    } else {
        return children;
    }
};

export default UserRoute;