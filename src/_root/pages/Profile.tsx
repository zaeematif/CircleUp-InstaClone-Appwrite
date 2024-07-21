import { useGetAllUserPosts } from "@/components/lib/react-query/queriesAndMutation";
import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useUserContext();

  const { data: userPosts, isPending: isPostLoading } = useGetAllUserPosts(
    user.id
  );

  return (
    <div className="explore-container">
      <div className="post_details-card p-8 my-6">
        {isPostLoading ? (
          <Loader />
        ) : (
          <>
            <Link to={`/profile/${user.id}`} className="flex-center gap-3">
              <img
                src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                alt="profile"
                className="h-20 w-20 rounded-full"
              />
            </Link>

            <div className="flex flex-col gap-3 p-5 mx-4">
              <h1 className="text-4xl">{user.name}</h1>
              <h2 className="text-light-3">@{user.username}</h2>

              <h2> <p className="text-light-4 inline mr-2 font-bold text-lg">{userPosts?.length}</p>Posts</h2>
            </div>

          </>
        )}
      </div>

      {isPostLoading ? (
        <Loader />
      ) : (
        <GridPostList posts={userPosts ? userPosts : []} showUser={false} />
      )}
    </div>
  );
};

export default Profile;
