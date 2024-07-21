

const Explore = () => {

  //const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();

  //console.log(posts);

  //const shouldShowPosts = posts.pages.every((item) => item.documents.length === 0);

  return (
    <div className="explore-container">

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>

        
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {true ? (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) : (
          // posts.pages.map((item, index) => (
          //   <GridPostList key={`page-${index}`} posts={item.documents} />
          // ))

          <></>
        )}
      </div>

      {/* infinite scrolling */}
      {/* {hasNextPage  && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )} */}
    </div>
  );
};

export default Explore;
