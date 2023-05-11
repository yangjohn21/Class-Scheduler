import { useLocation, useRouteLoaderData } from 'react-router-dom'
import { UserContext } from "../../context/UserContext"
import { useContext, useEffect } from "react"


function Navbar() {
  const { userData, setUserData } = useContext(UserContext)
  
  

  useEffect(() => {
    // this happens when the component is changed
    // i.e page reloads, goes to a different page    
    const fromStorage = localStorage.getItem("userData")
    if (fromStorage !== null) {
      setUserData(JSON.parse(fromStorage));
    }
  }, []);

  useEffect(() => {
    if (userData !== null) {
      localStorage.setItem("userData", JSON.stringify(userData));
    }
  }, [userData]);



  console.log("nav", userData);

  const location = useLocation();
  const routes = [{ name: 'Home', path: '/' }, { name: 'Profile', path: '/Profile' }, { name: 'Track', path: '/Track' },];
  return (
    <div>
      <ul id="nav" className="py-4 shadow-md flex px-6 border-b-1 border-black">
        {routes.map((item) => {
          const active = location.pathname === item.path ? 'bg-black text-white rounded-lg' : ''
          return <li className={"px-6 py-2 mx-1 " + active}><a href={item.path}>{item.name}</a></li>
        })}
      </ul>
      <div>Hello {userData?.user?.name}</div>
    </div>
  );
}

export default Navbar