import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { useOverlay } from '../context/OverlayContext';

const LandingRoute = ({ children, ...rest }) => {
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
        return null
    } else {
        return children;
    }
};

export default LandingRoute;
