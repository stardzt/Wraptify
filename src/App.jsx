import { useEffect, useState } from 'react'
import { redirectToSpotifyAuth, getAccessToken } from "./SpotifyAuth"
import './App.css'

function App() {
  const [token, setToken] = useState("")

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get("code")

    // If user just came back from Spotify auth
    if (!storedToken && code) {
      getAccessToken(code).then((accessToken) => {
        setToken(accessToken)
        window.history.replaceState({}, document.title, "/") // Clean URL
      })
    } else if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  useEffect(() => {
  if (!token) return

  fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("User Profile:", data)
      setUser(data)
    })
    .catch((err) => console.error(err))
  }, [token])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }
  
  return (
    <>
    {/* Navbar */}
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl uppercase font-bold"><div>Wrap<span className='text-primary'>tify</span></div></a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            {!token ?
            <li><button onClick={redirectToSpotifyAuth} class="btn btn-primary">Log in with Spotify</button></li>
            : <li><button onClick={logout} class="btn btn-outline btn-primary">Log out</button></li>
            }
            <li>
              <details>
                <summary>Parent</summary>
                <ul className="bg-base-100 rounded-t-none p-2">
                  <li><a>Link 1</a></li>
                  <li><a>Link 2</a></li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>

      <div className='py-16'>
        <h1 className='flex items-center justify-center uppercase tracking-wide font-bold px-16'>Wrap<span className='text-primary'>tify</span></h1>
        <div className='flex items-center justify-center px-16 tracking-wide font-semibold'>Track your monthly most played songs.</div>
      </div>

      <div className="md:flex justify-center min-h-screen">
        <div className="sm:flex justify-center max-w-4xl">
          {/* Card */}
          <div className='sm:w-lg p-4'>
            <ul className="list bg-base-100 shadow-md">
              <div className='flex justify-between'>
                {/* Username */}
      {token && user ? (
        <div className="flex flex-col items-center mt-4">
          <img
            src={user.images?.[0]?.url || "https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"}
            alt="User Avatar"
            className="rounded-full size-16 ring-2 ring-primary"
          />
          <h2 className="font-semibold mt-2 text-lg">{user.display_name}</h2>
          <p className="text-sm opacity-60">@{user.id}</p>
        </div>
      ) : (
        <div className="text-center opacity-60 mt-4">Please log in to continue.</div>
      )}
                <div className='p-6 text-xl uppercase font-semibold tracking-wide'>Wrap<span className='text-primary'>tify</span></div>
                <div className='p-6 opacity-60'>Oct 2025</div>
              </div>
              <div className='px-4 font-bold text-2xl'>My Top 10 Songs</div>
              <li className="list-row">
                <div className="text-4xl font-thin opacity-30 tabular-nums">01</div>
                <div><img className="size-10 rounded-sm" src="https://img.daisyui.com/images/profile/demo/1@94.webp"/></div>
                <div className="list-col-grow">
                  <div>Heartache</div>
                  <div className="text-xs uppercase font-semibold opacity-60">ONE OK ROCK</div>
                </div>
                <div>3:14</div>
              </li>
              <li className="list-row">
                <div className="text-4xl font-thin opacity-30 tabular-nums">02</div>
                <div><img className="size-10 rounded-sm" src="https://img.daisyui.com/images/profile/demo/4@94.webp"/></div>
                <div className="list-col-grow">
                  <div>Innocence</div>
                  <div className="text-xs uppercase font-semibold opacity-60">Avril Lavigne</div>
                </div>
                <button className="btn btn-square btn-ghost">
                  <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
                </button>
              </li>
              <li className="list-row">
                <div className="text-4xl font-thin opacity-30 tabular-nums">03</div>
                <div><img className="size-10 rounded-sm" src="https://img.daisyui.com/images/profile/demo/3@94.webp"/></div>
                <div className="list-col-grow">
                  <div>Sabrino Gardener</div>
                  <div className="text-xs uppercase font-semibold opacity-60">Cappuccino</div>
                </div>
                <button className="btn btn-square btn-ghost">
                  <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
                </button>
              </li>
            </ul>
          </div>
        </div>
        {/* Options */}
        <div className='w-sm p-4' >
          <div className='text-2xl font-bold'>Options</div><br></br>
          <div className='flex gap-4 pb-4'>
            <div className='flex gap-2'>
              <input type="radio" name="radio-1" className="radio" defaultChecked /><div>Top Tracks</div>
            </div>
            <div className='flex gap-2'>
              <input type="radio" name="radio-1" className="radio" /><div>Top Artists</div>
            </div>
          </div>
          <button className="btn btn-primary w-full">Download</button>
        </div>
      </div>
    </>
  )
}

export default App
