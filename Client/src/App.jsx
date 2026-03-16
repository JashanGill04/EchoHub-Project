import { Routes,Route, Navigate} from 'react-router-dom';
import'./App.css';
import Navbar from './Pages/Navbar';
import HomePage from './Pages/HomePage';
import SignUpPage from './Pages/SignUpPage';
import LoginPage from './Pages/LoginPage';
import SettingsPage from './Pages/SettingsPage';
import ProfilePage from './Pages/ProfilePage';
import { Loader } from 'lucide-react';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';
import SessionList from './Pages/session/SessionList';
import SessionPage from './Pages/session/SessionPage';
import CreateSession from './Component/sessions/CreateSession';
import WaitingArea from './Component/sessions/Waitingarea';
import WaitingPage from './Pages/session/WaitingPage';
import { socket } from './lib/socket';
import Chatting from './Pages/Chating';

function App() {
 const {authUser,checkAuth,isCheckingAuth,onlineUsers}=useAuthStore();
 const {theme}=useThemeStore();
 
 console.log("onlineUsers",onlineUsers);
 useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect(); // only when app closes
    };
  }, []);

 useEffect(()=>{
  checkAuth();
 },[checkAuth]);
console.log({authUser});

if(isCheckingAuth && !authUser) return(
<div className='flex items-center justify-center h-screen'>
  <Loader className='size-10 animate-spin'></Loader>
</div>
)
 return (
<div data-theme={theme} >
<Navbar />
<Routes>
  <Route path="/" element={ authUser? <SessionList/>: <Navigate to="/login"/>}/>
  <Route path="/chat" element={ authUser? <Chatting/>: <Navigate to="/login"/>}/>
  <Route path="/signup" element={!authUser ? <SignUpPage/>: <Navigate to="/"/>}/>
  <Route path="/login" element={!authUser ? <LoginPage/>: <Navigate to="/"></Navigate>}/>
  <Route path="/settings" element={ <SettingsPage/>}/>
  <Route path="/profile" element={authUser? <ProfilePage/>: <Navigate to="/login"/> }/>
  <Route path="/sessions/:sessionId" element={authUser? <SessionPage/>: <Navigate to="/login"/> }/>
  <Route path="/sessions/:sessionId/waiting" element={authUser? <WaitingPage/>: <Navigate to="/login"/> }/>
  <Route path="/sessions/create" element={authUser? <CreateSession/>: <Navigate to="/login"/> }/>
  <Route path="/sessions/join/:sessionId" element={authUser? <WaitingArea/>: <Navigate to="/login"/> }/>
  
 


</Routes>

<Toaster/>
</div>
  )
}

export default App
