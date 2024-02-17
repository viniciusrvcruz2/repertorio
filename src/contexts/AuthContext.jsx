import { createContext, useEffect, useState } from "react";
import { auth } from "../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [tokenApiSpotify, setTokenApiSpotify] = useState('')

    const getTokenApiSpotify = async () => {
        const clientId = "691c10007d1541cea6786e3d0b214b7e";
        const clientSecret = "5117f73779664a24b0b1949b98ac027e";

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
        };

        const tokenUrl = 'https://accounts.spotify.com/api/token';

        // Send the API token request
         await fetch(tokenUrl, requestOptions)
            .then(response => response.json())
            .then((token) => {
                setTokenApiSpotify(token)
            })
            .catch(error => {
                console.error('Erro ao solicitar token de acesso:', error);
            });
    }

    useEffect(() => {
        onAuthStateChanged(auth, (userAuth) => {
            if (userAuth) {
                setUser(userAuth)
                getTokenApiSpotify()
            } else {
                setUser(false)
            }
        });
    }, [])

    return (
        <AuthContext.Provider value={{ user, tokenApiSpotify, getTokenApiSpotify }} >{children}</AuthContext.Provider>
    )
}