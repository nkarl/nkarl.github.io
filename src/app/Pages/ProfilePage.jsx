import "./ProfilePage.css"

function ProfilePage() {
  /*
    This is the Profile Page. It will be the page that the user sees when they log in.
    This will be a practice of Grid Layout.
    */
  return (
    <>
      {/* header */}
      <div className="header min-w-[100%] text-3xl grid place-items-center">
        <div className="grid-cols-2">
          <label className="border-gray-100 border-2 p-2" style={{ "border-radius": "4px 0 0 4px" }}>Search
          </label><input className="border-gray-100 border-2 p-2" style={{ "border-radius": "0 4px 4px 0" }}></input>
        </div>
      </div>

      {/* Body */}
      <div className="min-w-[100%] bg-gray-400">
        <div className="text-black w-screen bg-gray-300 p-2 grid grid-cols-12 gap-2">
          <div className="min-h-screen bg-gray-200 col-start-3 col-end-11 grid grid-cols-12 grid-rows-6 gap-2">
            <div className="bg-gray-100">buffer</div>
            <div className="bg-gray-100 col-start-2 col-end-5 row-start-1 row-end-3">Photo</div>
            <div className="bg-gray-100">buffer</div>
            <div className="bg-gray-100 col-start-5 col-span-7 row-span-6">Body</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        Resize the browser window to see how the content respond to the
        resizing.
      </div>
    </>
  )
}

export default ProfilePage
