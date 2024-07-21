import { useParams, Link, useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { useState } from "react";
import {
  useCreateComment,
  useDeleteComment,
  useGetComments,
} from "@/components/lib/react-query/queriesAndMutation";

import {
  useGetPostById,
  useDeletePost,
} from "@/components/lib/react-query/queriesAndMutation";
import { multiFormatDateString } from "@/components/lib/utils";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const commentSchema = z.object({
  comment: z.string().min(1, {
    message: "Minimum 1 Character",
  }),
});

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();

  const { data: post, isLoading } = useGetPostById(id);

  const { mutate: deletePost } = useDeletePost();

  const handleDeletePost = () => {
    deletePost({ postId: id, imageId: post?.imageId });
    navigate(-1);
  };
  const [openComment, setOpenComment] = useState(false);

  const { mutateAsync: createNewComment, isPending: isCreatingComment } =
    useCreateComment();

  const { mutateAsync: deleteComment, } =
    useDeleteComment();

  let postId = id?.toString() || "";

  const { data: allComments, isPending: isCommentingLoading } =
    useGetComments(postId);

  console.log(allComments);

  const handleDeleteComment = (commentId: string) => {
    deleteComment(commentId);

    return toast({
      variant: "destructive",
      title: "Comment Deleted",
    });
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof commentSchema>) {
    if (values) {
      createNewComment({
        value: values.comment,
        userId: user.id,
        postId: id?.toString(),
      });

      values = {
        comment: "",
      };

      //close comment box
      setOpenComment(false);
    }
  }

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost"
        >
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <Loader />
      ) : (
        <>
          <div className="post_details-card">
            <img
              src={post?.imageUrl}
              alt="creator"
              className="post_details-img"
            />

            <div className="post_details-info">
              <div className="flex-between w-full">
                <Link
                  to={`/profile/${post?.creator.$id}`}
                  className="flex items-center gap-3"
                >
                  <img
                    src={
                      post?.creator.imageUrl ||
                      "/assets/icons/profile-placeholder.svg"
                    }
                    alt="creator"
                    className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                  />
                  <div className="flex gap-1 flex-col">
                    <p className="base-medium lg:body-bold text-light-1">
                      {post?.creator.name}
                    </p>
                    <div className="flex-center gap-2 text-light-3">
                      <p className="subtle-semibold lg:small-regular ">
                        {multiFormatDateString(post?.$createdAt)}
                      </p>
                      •
                      <p className="subtle-semibold lg:small-regular">
                        {post?.location}
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="flex-center gap-4">
                  <Link
                    to={`/update-post/${post?.$id}`}
                    className={`${user.id !== post?.creator.$id && "hidden"}`}
                  >
                    <img
                      src={"/assets/icons/edit.svg"}
                      alt="edit"
                      width={24}
                      height={24}
                    />
                  </Link>

                  <Button
                    onClick={handleDeletePost}
                    variant="ghost"
                    className={`ost_details-delete_btn ${
                      user.id !== post?.creator.$id && "hidden"
                    }`}
                  >
                    <img
                      src={"/assets/icons/delete.svg"}
                      alt="delete"
                      width={24}
                      height={24}
                    />
                  </Button>
                </div>
              </div>

              <hr className="border w-full border-dark-4/80" />

              <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
                <p>{post?.caption}</p>
                <ul className="flex gap-1 mt-2">
                  {post?.tags.map((tag: string, index: string) => (
                    <li
                      key={`${tag}${index}`}
                      className="text-light-3 small-regular"
                    >
                      #{tag}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full">
                <PostStats post={post} userId={user.id} openComment={openComment} setOpenComment={setOpenComment}/>
              </div>
            </div>
          </div>

          {!openComment ? (
            ""
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-9 w-full max-w-5xl"
              >
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="shad-form_label">Comment</FormLabel>
                      <FormControl>
                        <Textarea
                          className="shad-textarea custom-scrollbar"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="shad-form_message" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="shad-button_primary whitespace-nowrap"
                >
                  {isCreatingComment ? <Loader /> : "Add Comment"}
                </Button>
              </form>
            </Form>
          )}

          <div className="post_details-card p-8">
            <div className="flex flex-col gap-5 w-full">
              <h2 className="text-light-2">Comments: </h2>

              {isCommentingLoading ? (
                <div className="flex flex-center py-4">
                  <Loader />
                </div>
              ) : (
                allComments?.map((comment) => {
                  return (
                    <div key={comment.$id}>
                      <div className="my-2 flex justify-between">
                        <div className="content">
                          <h2 className="text-light-3">
                            @{comment.user[0].username}
                          </h2>
                          <p>{comment.content}</p>
                        </div>

                        <div
                          className={`${
                            user.id !== comment.user[0].$id && "hidden"
                          }`}
                        >
                          <Button
                            onClick={() => handleDeleteComment(comment.$id)}
                            variant="ghost"
                          >
                            
                              <img
                                src={"/assets/icons/delete.svg"}
                                alt="delete"
                                width={24}
                                height={24}
                              />
                            
                          </Button>
                        </div>
                      </div>

                      <hr className="border w-full border-dark-4/80" />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PostDetails;
