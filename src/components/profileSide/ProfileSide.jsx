import React from "react";
import FollowersCard from '../FollowersCard/FollowersCard'
import LogoSearch from '../LogoSearch/LogoSearch'
import ProfileCard from '../ProfileCard/ProfileCard'
import './ProfileSide.css'
import ProfileCardUser from "../ProfileCardUser/ProfileCardUser";
import CustomNavbar from "../Navbar/Navbar";

const ProfileSide = () => {

  return (
    <div className="ProfileSide">
      <LogoSearch />
      <ProfileCard />
    </div>
  )
}

export default ProfileSide


