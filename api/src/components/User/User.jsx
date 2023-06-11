import React, { useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { followUser, unfollowUser } from "../../actions/UserAction";
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { AppContext } from "../../Context";

const User = ({ person }) => {
  const { appInfo, setAppInfo } = useContext(AppContext)
  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  const user = firebase.auth().currentUser

  const [following, setFollowing] = useState(person.followers.includes(appInfo.userInfo.id))


  const handleFollow = () => {
    setFollowing((prev) => !prev)
    if (!following) appInfo.userInfo.following.push(1)
    if (following && appInfo.userInfo.following) appInfo.userInfo.following.splice(0, 1)
    setAppInfo({ ...appInfo })
  }


  return (
    <div className="follower">
      <div >
        <img
          src={"https://e7.pngegg.com/pngimages/18/809/png-clipart-user-computer-icons-person-icon-cdr-logo-thumbnail.png"}
          className="followerImage"
        />
        <div className="name">
          <span>{person.firstname}</span>
          <span>@{person.username}</span>
        </div>
      </div>
      <button
        className={
          following ? "button fc-button UnfollowButton" : "button fc-button"
        }
        onClick={handleFollow}
      >
        {following ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default User;
