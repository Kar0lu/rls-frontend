import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from '../context/SnackbarContext';

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {

    let [user, setUser] = useState(() => (localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null))
    let [authTokens, setAuthTokens] = useState(() => (localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null))
    let [loading, setLoading] = useState(true)

    const { showSnackbar } = useSnackbar();

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

        const response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: username, password: password})
        });

        let data = await response.json();

        switch (response.status) {
            case 400:
                showSnackbar('Wpisano niepoprawne wartości', 'error');
                return;
        
            case 401:
                showSnackbar('Nieprawidłowe dane logowania', 'error');
                return;
        
            case 200:
                localStorage.setItem('authTokens', JSON.stringify(data));
                setAuthTokens(data)
                // setUserId(jwtDecode(data.access).id)
                // setUsername(jwtDecode(data.access).username)
                if(jwtDecode(data.access).is_staff){
                    setUser('admin')
                    navigate('/admin')
                    showSnackbar(`Witaj ${jwtDecode(data.access).username}!`, 'success');
                    return;
                } else {
                    setUser('user')
                    navigate('/user')
                    showSnackbar(`Witaj ${jwtDecode(data.access).username}!`, 'success');
                    return;
                }
        
            default:
                showSnackbar('Wystąpił nieoczekiwany błąd 123', 'error');
                return;
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
        const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
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