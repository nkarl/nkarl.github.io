import "./ProfilePage.css"

function ProfilePage() {
  /*
    This is the Profile Page. It will be the page that the user sees when they log in.
    This will be a practice of Grid Layout.
    */
  return (
    <>
      {/* header */}
      <div className="header min-w-[100%]">
        Header
      </div>

      {/* Body */}
      <div className="min-w-[100%] bg-gray-400">
        <div className="row w-screen min-h-screen bg-gray-400">
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
