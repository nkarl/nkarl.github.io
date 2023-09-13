import "./ProfilePage.css";
import Resume from "./Resume";

function ProfilePage() {
  /*
    This is the Profile Page. It will be the page that the user sees when they log in.
    This will be a practice of Grid Layout.
    */
  return (
    <>
      {/* header */}
      <div className="header min-w-[100%] grid place-items-center">
        <div className="grid-cols-2 border-2 rounded-md text-xl">
          <label
            className="border-gray-100 px-4"
            style={{ borderRadius: "4px 0 0 4px" }}
          >
            Search
          </label>
          <input
            className="border-gray-100"
            style={{ borderRadius: "0 4px 4px 0" }}
          ></input>
        </div>
      </div>

      {/* Body */}
      <div className="body bg-gray-300 min-h-screen grid place-items-center p-2">
        {/* TODO: set transform for different screen sizes */}
        <div className="content bg-gray-100 min-h-screen w-full xl:w-[90vw] p-2">
          <div className="bg-gray-200">Card 1</div>
          <div className="bg-gray-200">Card 2</div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer min-h-[15vh] grid place-items-center">
        © 2023 Charles L. Nguyen. All Rights Reserved.
      </div>
    </>
  );
}

export default ProfilePage;
