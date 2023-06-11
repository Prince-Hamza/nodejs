import React, { useState, useEffect, useRef, useContext } from "react";
import moment from "moment";
import "./Post.css";
import Com from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import { likePost } from "../../api/PostsRequests";
import { useNavigate } from "react-router-dom";
import edit from '../../img/edit.png';
import ShareModal from "../ShareModal/ShareModal";
import { deletePost, updatePost } from "../../api/PostsRequests";
import { getUserById } from "../../api/UserRequests";
import CommentShare from '../CommentShare/CommentShare.jsx';
import Comment from "../Comment/Comment";
import { createComment } from "../../api/CommentsRequests";
import axios from 'axios'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { AppContext } from "../../Context";
import { domain } from "../../constants/constants";



const Post = ({ data, posts, setPosts }) => {
  const { appInfo, setAppInfo } = useContext(AppContext)

  var user = firebase.auth().currentUser

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(data.likes.length);
  // const { auth, theme, socket } = useSelector(state => state);
  const [showdrop, setshowdrop] = useState(false);

  const navigate = useNavigate();

  const [comments, setComments] = useState([]);

  const [isShare, setIsShare] = useState(false);
  const [isCommentInputVisible, setIsCommentInputVisible] = useState(false); // Nouvel état pour suivre la visibilité de l'entrée de commentaire

  const [postUser, setPostUser] = useState({});


  // alert(`post data : ${data._id}`)

  const handleUpload = async () => {
    alert('upload')
    // try {
    //   // Envoyer le commentaire au serveur
    //   const response = await createComment(data._id, { content: comment });
    //   const newComment = response.data;

    //   // Mettre à jour l'état des commentaires
    //   setComments((prevComments) => [...prevComments, newComment]);

    //   // Réinitialiser le commentaire et masquer l'entrée de commentaire
    //   setComment("");
    //   setIsCommentInputVisible(false);
    // } catch (error) {
    //   console.log(error);
    // }
  };


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(data.userId);
        console.log(`post user : ${response.data}`);
        setPostUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser()

  }, [data.userId, user.id]);



  // Récupérer les informations de l'utilisateur réel à partir des données du post
  //const postUser = data.user;

  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

  const [comment, setComment] = useState("");

  const handleToggleCommentInput = () => {
    setIsCommentInputVisible((prev) => !prev);
    setComment(""); // Réinitialiser le commentaire lors du basculement de l'entrée de commentaire
  };
  //const handleCommentSubmit = () => {
  /* const handleUpload = () => {
     // Envoyer le commentaire au serveur ou effectuer le traitement local
     console.log("Comment submitted:", post);
 
     // Réinitialiser le commentaire et masquer l'entrée de commentaire
     setPost("");
     setIsCommentInputVisible(false);
   };*/


  const handleLike = () => {

    let postData = JSON.stringify({
      "userId": appInfo.userInfo.id,
      "postId": data._id
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${domain}/posts/like`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: postData
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data))
        posts.forEach((post) => {
          if (post._id === data._id) {
            if (!liked) post.likes.push(appInfo.userInfo.id)
            if (liked) post.likes.splice(0, 1)
          }
        })
        setPosts([...posts])

      })
      .catch((error) => {
        console.log(error);
      })

    setLiked((prev) => !prev);
    liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1)

  };



  /*const handleEdit = (ed) =>{   
    dispatch({/*type: ALERT_TYPES.STATUS ,*/ /*payload:{...data, edit:true}})
setshowdrop(false)
}
 

const handleDeletePost = () =>{
dispatch(/*deletePost*//*({data, auth, socket}))
                                                            setshowdrop(false)
                                                            navigate('/')
                                                          }*/

  const handleDelete = () => {
    setshowdrop(false);
    navigate('/')
  };

  const handleUpdate = () => {
    const updatedPost = { ...data, edit: true, title: "Updated Title" };
    // dispatch(updatePost(data.id, updatedPost));
    setshowdrop(false);
  };


  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setshowdrop(false);
  }


  const [open, setOpen] = useState(false);
  let menuRef = useRef();

  // useEffect(() => {
  //   let handler = (e) => {
  //     if (!menuRef.current.contains(e.target)) {
  //       setOpen(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handler);
  //   return () => {
  //     document.removeEventListener("mousedown", handler);
  //   }
  // });

  const handleVideoEnd = (event) => {
    event.target.currentTime = 0
  }


  const media = (
    <div>
      {data.images &&
        <div>
          {data.images.map((image) => {
            return (
              <img
                style={{ width: '45%', height: '200px', margin: '1px', cursor: 'pointer' }}
                onClick={() => { window.open(image, '_blank') }}
                src={image}
                alt={image}
              />
            )
          })}
        </div>
      }

      {data.videos &&
        <div>
          {data.videos.map((video) => {
            return (
              <video style={{ width: '45%', height: '200px', margin: '1px', cursor: 'pointer' }} controls onEnded={handleVideoEnd} src={video} >

              </video>
            )
          })}
        </div>
      }
    </div>
  )


  return (
    <div className="Post">
      <div className="Postheader">
        <div className="PostInfo">
          {user.id === data?.userId ?
            <img
              src={data.profilePicture}
              alt="ProfileImage"
            /> :
            <img
              src={data.profilePicture}
              alt="ProfileImage"
            />}
          <div className="PostInfoUser">
            <span className="user">
              {data.username}
            </span>


            <span className="timeago">
              {moment.utc(data.createdAt).fromNow()}
            </span>
          </div>
        </div>
        <div className="postcardheaderdown">

          {window.location.href.includes('profile') && <div className='menu-trigger' onClick={() => { setOpen(!open) }}>
            <p onClick={() => setshowdrop(!showdrop)}>ooo</p>
            <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`} style={{ marginRight: '-12px' }} >
              <ul>
                <DropdownItem img={edit} text={"Edit"} onClick={() => handleUpdate(data)} />
                <DropdownItem img={edit} text={"Remove Post"} onClick={handleDelete} />
                <DropdownItem img={edit} text={"Download"} onClick={handleCopyLink} />
              </ul>
            </div>
          </div>}


        </div>
      </div>
      <div className="detail" style={{ alignSelf: "flex-start" }}>
        {/* <span>
          <b>{data.username} </b>
        </span> */}
        <span>{data.text}</span>
      </div>
      {media}
      <div className="postReact">

        <img
          src={liked ? Heart : NotLike}
          alt=""
          style={{ cursor: "pointer" }}
          onClick={handleLike}
        />

        <img src={Com} alt="" style={{ cursor: 'pointer' }} onClick={handleToggleCommentInput} />

        {/* <img src={Share} alt="" onClick={() => setIsShare(!isShare)} style={{ cursor: 'pointer' }} /> */}

      </div>

      <span style={{ color: "var(--gray)", fontSize: "12px", alignSelf: "flex-start" }}>
        {data.likes.length} likes
      </span>

      {isCommentInputVisible && (
        <>
          {<CommentShare postId={data._id} visible={setIsCommentInputVisible} />}
        </>
      )}


      {comments.map((comment) => (
        <Comment key={comment.id} data={comment} />
      ))}

      {/* 
      {isShare && <ShareModal url={`http://localhost:5000/post/${data._id}`} theme={theme} />}

      {isShare && <ShareModal url={`http://localhost:5000/post/comment/${data._id}`} theme={theme} />} */}

    </div>
  );
};

function DropdownItem(props) {
  return (
    <li className='dropdownItem'>
      <img src={props.img} alt=""></img>
      <span> {props.text} </span>
    </li>
  );
}

export default Post
