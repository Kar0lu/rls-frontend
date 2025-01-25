import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'
import { useOverlay } from './OverlayContext';

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {

    let [user, setUser] = useState(() => (localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')).is_staff ? 'admin' : 'user' : null))
    let [authTokens, setAuthTokens] = useState(() => (localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null))

    const { showSnackbar, showLoading, hideLoading } = useOverlay();

    const navigate = useNavigate()

    let loginUser = async (username, password) => {
        if(username=='') {
            showSnackbar('Nazwa użytkownika nie może być pusta', 'warning')
            return;
        }

        if(password=='') {
            showSnackbar('Hasło nie może być puste', 'warning')
            return;
        }

        showLoading();

        try{
            const response = await fetch('http://127.0.0.1:8000/auth/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: username, password: password})
            });

            const data = await response.json();

            if (response.status === 200) {
                localStorage.setItem('authTokens', JSON.stringify(data));
                setAuthTokens(data);
                setUser(jwtDecode(data.access).is_staff ? 'admin' : 'user');
                navigate('/harmonogram');
                showSnackbar(`Witaj ${jwtDecode(data.access).username}!`, 'success');
            } else {
                if (response.status === 400){
                    showSnackbar('Wpisano nieprawidłowe wartości', 'error');
                } else if (response.status === 401){
                    showSnackbar('Nieprawidłowe dane logowania', 'error');
                } else {
                    showSnackbar('Wystąpił nieoczekiwany błąd', 'error');
                }
            }
        } catch (error) {
            showSnackbar('Wystąpił nieoczekiwany błąd', 'error');
        } finally {
            hideLoading();
        }
    }

    let logoutUser = () => {
        localStorage.removeItem('authTokens')
        setAuthTokens(null)
        setUser(null)
        navigate('/')
    }

    const updateToken = async () => {
        const response = await fetch('http://127.0.0.1:8000/auth/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({refresh:authTokens?.refresh})
        })

        const data = await response.json()
        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access).is_staff ? 'admin' : 'user')
            localStorage.setItem('authTokens',JSON.stringify(data))
        } else {
            logoutUser()
        }
    }

    let contextData = {
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser,
    }

    useEffect(()=>{
        const REFRESH_INTERVAL = 1000 * 60 * 2 // 15 minutes
        let interval = setInterval(()=>{
            if(authTokens){
                updateToken()
            }
        }, REFRESH_INTERVAL)
        return () => clearInterval(interval)

    },[authTokens])

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}