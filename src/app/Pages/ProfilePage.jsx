import "./ProfilePage.css";

function ProfilePage() {
  /*
    This is the Profile Page. It will be the page that the user sees when they log in.
    This will be a practice of Grid Layout.
    */
  return (
    <>
      {/* header */}
      <div className="min-h-screen flex flex-col">
        <div className="header min-w-[100%] grid place-items-center self-start bg-gray-700">
          <div className="grid-cols-2 border-2 rounded-md text-xl hover:scale-110 transform duration-200 ease-out shadow-lg">
            <label
              className="border-gray-100 px-4"
              style={{ borderRadius: "4px 0 0 4px" }}
              htmlFor="search"
            >
              Search
            </label>
            <input
              className="border-gray-100 text-black px-2"
              style={{ borderRadius: "0 4px 4px 0" }}
              type="text"
              name="search"
            ></input>
          </div>
        </div>

        {/* Body */}
        <div className="body bg-slate-400 grid place-items-stretch py-2 p-4 box-content">
          <div className="min-h-[75vh] bg-slate-300 rounded-sm flex flex-col items-center content-center shadow-lg">
            <div className="bg-[#ffb703] m-8 w-[22rem] sm:w-[36rem] md:w-[42rem] h-[8rem] p-10 px-4 sm:p-10 rounded-md text-black text-center sm:text-2xl md:text-4xl shadow-lg font-semibold mt-36 hover:scale-105 transform duration-300 ease-in-out hover:shadow-2xl hover:border-2 hover:border-slate-200">
              ⛔ Site Under Construction. ⛔
            </div>
            <div className="bg-slate-200 m-4 sm:w-[20rem] md:w-[32rem] h-[6rem] p-8 rounded-md text-black text-center sm:text-md md:text-xl shadow-lg hover:scale-105 transform duration-300 ease-in-out hover:shadow-xl hover:border-2 hover:border-slate-200">
              Please come back another time.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer min-w-full min-h-[15vh] grid place-items-center self-end bg-gray-800">
          <p className="hover:scale-110 transform duration-200 ease-in-out">
            © 2023 Charles L. Nguyen. All Rights Reserved.
          </p>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
