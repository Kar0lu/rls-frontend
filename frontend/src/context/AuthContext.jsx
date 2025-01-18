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

    useEffect(() => {
        console.log(user)
    }, [user]);

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
                const isAdmin = jwtDecode(data.access).is_staff;
                setUser(isAdmin ? 'admin' : 'user');
                navigate(isAdmin ? '/admin' : '/user');
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

    let logoutUser = (e) => {
        e.preventDefault()
        localStorage.removeItem('authTokens')
        setAuthTokens(null)
        setUser(null)
        navigate('/admin')
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
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens',JSON.stringify(data))
        } else {
            logoutUser()
        }

        if(loading){
            setLoading(false)
        }
    }

    let contextData = {
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser,
    }

    useEffect(()=>{
        const REFRESH_INTERVAL = 1000 * 60 * 4 // 4 minutes
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