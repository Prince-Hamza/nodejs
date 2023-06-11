import React, { useContext, useEffect } from "react"
import PostSide from "../components/PostSide/PostSide"
import ProfileSide from "../components/profileSide/ProfileSide"
import RightSide from "../components/RightSide/RightSide"
import "./Home.css"
import { AppContext } from "../Context"
import { io } from "socket.io-client"
import { Row, Col, Container } from "react-bootstrap"
import CustomNavbar from "../components/Navbar/Navbar"
import GlobalSocketListener from "../listener/globalSocketListener"
import { domain } from "../constants/constants"
const ENDPOINT = domain
const socket = io(ENDPOINT);

const Home = () => {

  const { appInfo, setAppInfo } = useContext(AppContext)

  useEffect(() => {
    socket.on("connect", () => {
      console.log(`client connected to socket.io`)
    })

    socket.on("disconnect", () => {
      console.log(socket.id)
    })
  }, [])


  return (
    <Container fluid>
      <CustomNavbar />
      <Row className="Home flex-sm-col flex-md-row flex-lg-row  flex-column">
        <Col><ProfileSide /></Col>
        <Col><PostSide /></Col>
        <Col><RightSide /></Col>
      </Row>
        <GlobalSocketListener /> 
    </Container>
  )
}

export default Home
