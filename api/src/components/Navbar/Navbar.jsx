import React, { useContext, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link } from "react-router-dom"
import Logo from "../../img/logo_istic.jpg"
import { Image } from 'react-bootstrap'
import "./Navbar.css"
import Home from "../../img/home.png"
import Noti from "../../img/noti.png"
import Comment from "../../img/comment.png"
import Setting from "../../img/settings.png"
import user01 from '../../img/user01.png'
import inbox from '../../img/envelope.png'
import { webAuth } from '../../firebase/firebaseAuth'
import { AppContext } from '../../Context'
const fireAuth = new webAuth()

function CustomNavbar() {

  const { appInfo } = useContext(AppContext)

  const [notificationBarActive, setNotificationBarActive] = useState(false)
  const [settingsBarActive, setSettingsBarActive] = useState(false)


  function DropdownItem(props) {
    return (
      <li className='dropdownItem'>
        <img src={props.img} alt=""></img>
        <div> {props.text} </div>
      </li>
    )
  }


  const handleLogOut = async () => {
    console.log(`Logout :: email : ${appInfo.userInfo.email}, password : ${appInfo.userInfo.password}`)
    fireAuth.removeLoginSession(appInfo.userInfo.email, appInfo.userInfo.password)
    window.location.replace('/')
  }


  return (
    <Container fluid>
      <Navbar collapseOnSelect expand="lg" bg="light" variant="light" className='NavbarContainer'>

        <Navbar.Brand href="#home" className=''>
          <Link to="../">
            <Image src={Logo} alt="" fluid style={{ width: 100, height: 70 }} />
          </Link>
          <span className='logoSpan'>Social lstic</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">


          </Nav>
          <Nav className='gap-4'>

            <Nav.Link href="#deets">
              <Link to="../home">
                <Image src={Home} alt="" fluid style={{ width: 25, height: 25 }} />
              </Link>
            </Nav.Link>


            <Nav.Link eventKey={2} >
              <Image src={Noti} alt="" fluid style={{ width: 25, height: 25 }} onClick={() => { setNotificationBarActive(notificationBarActive ? false : true) }} />
            </Nav.Link>

            <Nav.Link eventKey={2} >
              <Link to="../chat" >
                <Image src={Comment} alt="" fluid style={{ width: 25, height: 25 }} />
              </Link>
            </Nav.Link>


            <Nav.Link eventKey={2} >
              <Image src={Setting} alt="" fluid style={{ width: 25, height: 25 }} onClick={() => { setSettingsBarActive(settingsBarActive ? false : true) }} />
            </Nav.Link>


          </Nav>
        </Navbar.Collapse>
      </Navbar>


      {settingsBarActive &&
        <div style={Styles.menuBar} >
          <h3> Social Istic </h3>
          <ul>
            <DropdownItem img={user01} text={"My Profile"} />
            <DropdownItem img={inbox} text={"Inbox"} />
            <hr style={{ marginRight: '40px', marginBottom: '15px' }}></hr>
            <button className="button logout-button" onClick={handleLogOut} style={{ marginTop: '-1px' }}>Log Out</button>
          </ul>
        </div>
      }


      {notificationBarActive &&
        <div style={Styles.menuBar} >
          <h3> Social Istic </h3>
          <ul>
            
          </ul>
        </div>
      }


    </Container>
  )
}

export default CustomNavbar




const Styles = ({
  menuBar: {
    position: 'absolute',
    top: '80px',
    right: '12px',
    backgroundColor: '#fff',
    padding: '10px 20px',
    width: '250px',
    border: '2px solid #f4cb35',
    color: '#222',
    zIndex: 1
  }
})



