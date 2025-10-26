import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const CLIENT_ID = "d6398aae662347e2b1854d7985ba6eb4"
  const REDIRECT_URI = "https://182.8.178.92:5173/callback"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken] = useState("")

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", token)
    }

    setToken(token)

  }, [])

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
            <li><a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}><button class="btn btn-primary">Log in with Spotify</button></a></li>
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
                <div className='flex p-4 items-center'>
                  <div className="avatar">
                    <div className="size-8 rounded-full ring-1 ring-base-content/60">
                      <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                    </div>
                  </div>
                  <li className="pl-2 pt-2 pb-2 text-sm opacity-60 tracking-wide">Piyoo</li>
                </div>
                <div className='p-6 text-xl'>Wraptify</div>
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
