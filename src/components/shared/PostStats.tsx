import { Models } from "appwrite";
import { useState } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "../lib/utils";
import { useLikePost } from "../lib/react-query/queriesAndMutation";

type PostStatsProps = {
  post?: Models.Document;
  userId: string;
  openComment: boolean;
  setOpenComment: (openComment: boolean) => void;
};

const PostStats = ({
  post,
  userId,
  openComment,
  setOpenComment
}: PostStatsProps) => {
  const location = useLocation();
  const likesList = post?.likes.map((user: Models.Document) => user.$id);
  const totalComment = post?.comment.map((it: Models.Document) => it.$id);

  const [likes, setLikes] = useState<string[]>(likesList);
  const [comment, setComment] = useState<string[]>(totalComment);

  const { mutate: likePost } = useLikePost();

  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let likesArray = [...likes];

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId);
    } else {
      likesArray.push(userId);
    }

    setLikes(likesArray);
    likePost({ postId: post?.$id || "", likesArray });
  };

  const handleCommentPost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    //open comment box
    setOpenComment(!openComment);

    setComment(totalComment);

  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}
    >
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium mr-5">{likes.length}</p>

        <img
          src="/assets/icons/comment.svg"
          alt="comment"
          width={22}
          height={26}
          onClick={(e) => handleCommentPost(e)}
          className="text-light-4 cursor-pointer"
        />
        <p className="small-medium lg:base-medium mr-5">
          {comment.length || 0}
        </p>
      </div>
    </div>
  );
};

export default PostStats;
