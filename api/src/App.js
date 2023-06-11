import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppContext } from './Context'
import { useEffect, useState } from 'react'
import { config } from './config'
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css'
import Home from './pages/Home'
import Auth from './pages/Auth/Auth'
import Profile from './pages/Profile/Profile'
import Chat from './pages/Chat/Chat'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { webAuth } from './firebase/firebaseAuth'
import axios from 'axios'
import { domain } from './constants/constants'
import GlobalSocketListener from './listener/globalSocketListener'
import { ToastContainer, toast, useToast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loading from './components/Loading/Loading'
const fireAuth = new webAuth()

function App() {

    const [appData, setAppData] = useState({
        userInfo: {},
        profileUser: {},
        chatHistory: [],
        selectedChatRoom: {},
        messages: [],
        online: true,

        postsForPage: 'home',
        myPostsCount: 0,
        postsByFollowedCount: 0,

        chat: true,
        call: false,
        callType: 'recieving',
        buttonsClicked: false,
        listenToMongo: false,
        listening: false
    })
    const [loading, setLoading] = useState(true)

    if (!firebase.apps.length) firebase.initializeApp(config)
    // var user = firebase.auth().currentUser

    const getUserInfoFromMongoDb = (user) => {

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${domain}/user/${user.uid}`,
            headers: {}
        }

        // alert(`get : ${config.url}`)

        axios.request(config)
            .then((response) => {
                //  alert(JSON.stringify(response.data))
                if (response.data.user) {
                    appData.userInfo = response.data.user
                    setAppData({ ...appData })
                    setLoading(false)
                    // alert(`app data : userInfo : ${JSON.stringify(appData)}`)
                }
            })
            .catch((error) => {
                alert(`user auth error : ${error}`)
            })
    }


    const init = async () => {
        // get login session 
        const user = await fireAuth.getLoginSession()
        // alert(`user from login session : ${JSON.stringify(user)}`)
        if (user.uid) getUserInfoFromMongoDb(user)
        if (!user.uid) setLoading(false)
    }


    const effect = () => {
        init()
    }

    useEffect(effect, [])


    return (
        <AppContext.Provider value={{ appInfo: appData, setAppInfo: setAppData }}>
            <ToastContainer />
            <BrowserRouter>
                <Routes>

                    <Route
                        path="/"
                        element={loading ? <Loading /> : (appData.userInfo.id ? <Home /> : <Auth />)}
                    />

                    <Route
                        path="/home"
                        element={<Home />}
                    />

                    <Route
                        path="/auth"
                        element={<Auth />}
                    />

                    <Route
                        path="/profile/:id"
                        element={<Profile />}
                    />

                    <Route
                        path="/chat"
                        element={<Chat />}
                    />

                </Routes>
            </BrowserRouter>

        </AppContext.Provider>
    )
}

export default App

