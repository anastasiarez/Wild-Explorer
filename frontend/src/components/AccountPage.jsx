import React, { useState } from 'react';
import {useContext} from "react";
import {UserContext} from "../UserContext.jsx";
import {Navigate} from "react-router-dom";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import PlacesPage from './PlacesPage.jsx';


export default function AccountPage(){

const [redirect,setRedirect]=useState(null)
const [ready,user,setUser] = useContext(UserContext);

let {subpage} = useParams();
  if (subpage === undefined) {
     subpage = 'profile';
}

async function logout() {
 await axios.post('/logout');
setRedirect('/');
setUser(null);
}


if (!ready) {
	return 'Loading...'
}

if (ready && !user) {
	return <Navigate to ={'/login'} />
}


function linkClasses (type=null) {
      let classes =  'inline-flex gap-1 py-2 px-6 rounded-full';

      if (type === subpage) {
     classes += 'bg-primary text-white ';
     } else {
      classes += 'bg-gray-200';

     }
return classes;
}

if (redirect) {
  return <Navigate to ={redirect} />
}


return (
<div>
     <nav className= "w-full flex justify-center mt-8 gap-2 mb-8">

  <Link className = { linkClasses('profile')} to={'/account'}> My Profile </Link>

  <Link className = { linkClasses('bookings')} to={'/account/bookings'}> My Bookings</Link>

  <Link className = { linkClasses('places')} to={'/account/places'}> My Accomodations </Link>

      </nav>

{subpage === 'profile' && (
<div className="text-center max-w-lg mx-auto">
Logged in as {user.name} ({user.email})<br />
<button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
</div>
)}
{subpage === 'places' && (
  <PlacesPage />
)}
 </div>
);
}
