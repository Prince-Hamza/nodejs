import React from "react"
import PostSide from "../../components/PostSide/PostSide"
import ProfileCard from "../../components/ProfileCard/ProfileCard"
import ProfileLeft from "../../components/ProfileLeft/ProfileLeft"
import RightSide from "../../components/RightSide/RightSide"
import { Row,Col,Container } from "react-bootstrap"
import ProfileCardUser from "../../components/ProfileCardUser/ProfileCardUser"
import "./Profile.css"
import CustomNavbar from "../../components/Navbar/Navbar"


const Profile = () => {
  return (
    <div className="Profile">



      {/* <ProfileLeft />
      <div className="Profile-center">
        {window.location.href.includes('user') ? <ProfileCardUser /> : <ProfileCard location='profilePage' />}
        <PostSide />
      </div>
      <RightSide /> */}


      <CustomNavbar/>
      <Container fluid >
        <Row>
          <Col> <ProfileLeft /> </Col>
          <Col>  <div className="Profile-center">
          {window.location.href.includes('user') ? <ProfileCardUser /> : <ProfileCard location='profilePage' />}
            <PostSide/>
            </div>
          </Col>
          <Col>
          <RightSide/>
          </Col>
        </Row>
      </Container>
      
    
     
    </div>
  );
};

export default Profile;
