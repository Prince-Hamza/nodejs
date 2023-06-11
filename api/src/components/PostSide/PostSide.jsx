import React, { useContext } from "react";
import Posts from "../PostsHomePage/PostsHomePage";
import PostsProfilePage from "../PostsProfilePage/PostsProfilePage";

import PostShare from "../PostShare/PostShare";
import "./PostSide.css";
import CommentSide from "../CommentSide/CommentSide";
import { AppContext } from "../../Context";

const PostSide = () => {
  
  const { appInfo, setAppInfo } = useContext(AppContext)

  return (
    <div className="PostSide">
      <PostShare />
      {appInfo.postsForPage === 'home' && <Posts />}
      {appInfo.postsForPage === 'profile' && <PostsProfilePage />}
      {/* <CommentSide /> */}
    </div>
  );
};

export default PostSide
