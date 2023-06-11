import React, { useState, useRef, useContext } from "react"
import "./TimelineShare.css"
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { AppContext } from "../../Context";
import { toast } from "react-toastify";
import axios from 'axios'
import { domain } from "../../constants/constants";

const CommentShare = ({ postId, visible }) => {
  const { appInfo, setAppInfo } = useContext(AppContext)
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false)
  const desc = useRef();
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
  var user = firebase.auth().currentUser


  // handle comment upload
  const handleUpload = async (e) => {


    let data = JSON.stringify({
      "userId": appInfo.userInfo.id,
      "postId": postId,
      "username": appInfo.userInfo.id,
      "profilePicture": appInfo.userInfo.id,
      "comment": desc.current.value
    })

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${domain}/posts/comment`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    }

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data))
        toast.success('commented sucessfully')
        visible(false)
      })
      .catch((error) => {
        console.log(error.toString())
      })



  }


  // Reset Comment Share
  const resetShare = () => {
    desc.current.value = "";
  };


  return (
    <div className="PostShare">
      <img
        src={
          user.profilePicture
            ? serverPublic + user.profilePicture
            : serverPublic + "defaultProfile.png"
        }
        alt="Profile"
      />
      <div className="commentOptions">
        <input
          type="text"
          placeholder="What's happening ?"
          required
          ref={desc}
        />

        <button
          className="button ps-button"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "uploading" : "Share"}
        </button>

      </div>
    </div>
  );
};

export default CommentShare;
