import "./ProfilePage.css";

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
            style={{ "border-radius": "4px 0 0 4px" }}
          >
            Search
          </label>
          <input
            className="border-gray-100"
            style={{ "border-radius": "0 4px 4px 0" }}
          ></input>
        </div>
      </div>

      {/* Body */}
      <div className="min-w-full bg-gray-400">
        {/* TODO: set transform for different screen sizes */}
        <div className="text-black w-screen bg-gray-300 p-2 grid grid-cols-12 gap-4">
          <div className="min-h-screen bg-gray-200 col-start-3 col-end-11 grid grid-cols-12 grid-rows-6 gap-2 grid-flow-col auto-cols-max">
            <div className="bg-gray-100 col-start-2 col-span-3 row-start-1 row-span-2 hover:scale-110 transform ease-in-out duration-200">
              Photo
            </div>
            <div className="bg-gray-100 col-start-5 col-span-7 row-start-2 row-span-full hover:scale-[102%] transform ease-in-out duration-200">
              Body
            </div>
          </div>
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
