import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const isAuthenticated = false;

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <div className="flex w-full h-full">
          <section 
          className="flex flex-1 justify-center items-center self-center flex-col p-8 h-full">
            <Outlet />
          </section>

          <img
            className="hidden lg:block object-cover h-full w-1/2 bg-no-repeat"
            src="/assets/images/insta.png"
          ></img>
        </div>
      )}
    </>
  );
};

export default AuthLayout;
