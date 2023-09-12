import "./ProfilePage.css"

function ProfilePage() {
  /*
    This is the Profile Page. It will be the page that the user sees when they log in.
    This will be a practice of Grid Layout.
    */
  return (
    <>
      {/* header */}
      <div className="header min-w-[100%] text-2xl grid place-items-center">
        <div className="grid-cols-2">
          <label className="border-gray-100 border-2 p-2" style={{ "border-radius": "4px 0 0 4px" }}>
            Search
          </label>
          <input className="border-gray-100 p-2" style={{ "border-radius": "0 4px 4px 0" }}></input>
        </div>
      </div>

      {/* Body */}
      <div className="min-w-full bg-gray-400">
        <div className="text-black w-screen bg-gray-300 p-2 grid grid-cols-12 gap-2">
          <div className="min-h-screen bg-gray-200 col-start-3 col-end-11 grid grid-cols-12 grid-rows-6 gap-2 grid-flow-col">
            <div className="bg-gray-100 col-start-2 col-span-3 row-start-1 row-span-2">Photo</div>
            <div className="bg-gray-100 col-start-5 col-span-7 row-start-2 row-span-full">Body</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer min-h-[15vh] grid place-items-center">
        © 2023 Charles L. Nguyen. All Rights Reserved.
      </div>
    </>
  )
}

export default ProfilePage
