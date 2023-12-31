import { useLocation, useNavigate } from 'react-router-dom'

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  let routes = [{ name: 'Home', path: '/' }, { name: 'Profile', path: '/profile' }, { name: 'Track', path: '/track' },];
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return (<div className='h-20'></div>);
  }
  return (
    <div>
      <ul id="nav" className="py-5 shadow-md flex px-6 border-b-1 border-black h-20">
        {[<img src="https://cics-careers.github.io/destinations-report/img/UMassAmherst_logo.png" height={30} width={300} className='object-contain h-8'></img>, ...routes.map((item) => {
          const active = location.pathname === item.path ? 'bg-black text-white rounded-lg' : ''
          return <li key={item.path} className={"px-6 py-2 mx-1 " + active}><button onClick={() => navigate(item.path)}>{item.name}</button></li>
        })]}
      </ul>
    </div>
  );
}

export default Navbar