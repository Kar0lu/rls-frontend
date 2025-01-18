import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { useOverlay } from '../context/OverlayContext';

const LoggedRoute = ({ children, ...rest }) => {
    const { showLoading, hideLoading } = useOverlay();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        showLoading();
        if (user) {
            navigate('/harmonogram');
        } else {
            navigate('/');
        }
        hideLoading()
    }, []);

    if (user) {
        return children
    } else {
        return null;
    }
};

export default LoggedRoute;
