import { useEffect, useState } from 'react'
import { redirectToSpotifyAuth, getAccessToken } from "./SpotifyAuth"
import html2canvas from 'html2canvas-pro';
import './App.css'

function msToTime(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

const printDocument = (domElement) => {
  html2canvas(domElement).then(canvas => {
    document.body.appendChild(canvas);
  });
};

function App() {
  const [token, setToken] = useState("")
  const [user, setUser] = useState(null)
  const [tracks, setTracks] = useState([])

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

  // Fetch username and profile picture
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

  // fetch top tracks when token is present
  useEffect(() => {
    if (!token) return
    fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch top tracks")
        return r.json()
      })
      .then((data) => setTracks(data.items || []))
      .catch((err) => {
        console.error(err)
        // optional: if 401, remove token to force re-login
        if (err.message.includes("401")) {
          localStorage.removeItem("token")
          setToken("")
        }
      })
  }, [token])

  // Log out
  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  const canvasRef = useRef()

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
            <li><button onClick={redirectToSpotifyAuth} className="btn btn-primary">Log in with Spotify</button></li>
            : <li><button onClick={logout} class="btn btn-outline btn-primary">Log out</button></li>
            }
          </ul>
        </div>
      </div>

      <div className='py-16'>
        <h1 className='flex items-center justify-center uppercase tracking-wide font-bold px-16'>Wrap<span className='text-primary'>tify</span></h1>
        <div className='flex items-center justify-center px-16 tracking-wide font-semibold'>Track your last 30 days most played songs and artists.</div>
      </div>
          
      {token && user && (
        <div className="md:flex justify-center min-h-screen">
          <div className="sm:flex justify-center max-w-4xl">
            {/* Card */}
              <div ref={canvasRef} className='sm:w-lg p-4'>
                <ul className="list bg-base-100 shadow-md">
                  <div className='flex justify-between'>
                    {/* Username */}
                    <div className='flex p-4 items-center'>
                      <div className="avatar">
                        <div className="size-8 rounded-full ring-1 ring-base-content/60">
                          <img src={user.images?.[0]?.url} />
                        </div>
                      </div>
                      <li className="pl-2 pt-2 pb-2 text-sm opacity-60 tracking-wide">{user.display_name}</li>
                    </div>
                    <div className='p-6 text-xl uppercase font-semibold tracking-wide'>Wrap<span className='text-primary'>tify</span></div>
                    <div className='p-6 opacity-60'>Oct 2025</div>
                  </div>
                  <div className='px-4 font-bold text-2xl'>My Top 10 Songs</div>
                  {tracks.length === 0 && token && <li className="opacity-60">Loading...</li>}
                  {tracks.map((track, i) => (
                    <li className="list-row">
                      <div className="text-4xl font-thin opacity-30 tabular-nums">{String(i + 1).padStart(2, "0")}</div>
                      <div><img className="size-10 rounded-sm" src={track.album.images?.[2]?.url || track.album.images?.[0]?.url}/></div>
                      <div className="list-col-grow">
                        <div className='font-semibold'>{track.name}</div>
                        <div className="text-xs opacity-60">{track.artists.map(a => a.name).join(", ")}</div>
                      </div>
                      <div>{msToTime(track.duration_ms)}</div>
                    </li>
                  ))}

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
            <button onClick={()=>printDocument(canvasRef.current)} className="btn btn-primary w-full">Save as Image</button>
          </div>
        </div>
      )}
    </>
  )
}

export default App
