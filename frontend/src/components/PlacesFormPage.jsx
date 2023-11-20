import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import PhotoUploader from "../PhotoUploader";
import Perks from "../Perks";
import axios from "axios";



const PlacesFormPage = () => {
    //states
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [redirectToPlacesList, setRedirectToPlacesList] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [price, setPrice] = useState(100);
  useEffect(() => {
    if(!id){
      return;
    }
    axios.get('/places/'+id).then(response => {
      const {data} = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
   });
 }, [id]);



  //helper functions
  const inputHeader = (text) => {
    return <h2 className="text-xl mt-4">{text}</h2>;
  };

  const inputDescription = (text) => {
    return <p className="text-gray-500 text-sm">{text}</p>;
  };

  const inputValue = (header, description) => { 
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  };

  async function SavePlace(e) {
    e.preventDefault();
    if (id){
      await axios.put(`/places/${id}`,{
      title,
      address,
      description,
      addedPhotos,
      checkIn,
      checkOut,
      extraInfo,
      maxGuests, 
      price,
    });
    } else {
      await axios.post("/places",{
        title,
        address,
        description,
        addedPhotos,
        checkIn,
        checkOut,
        extraInfo,
        maxGuests, 
        price,
      });
    }
    
    
    setRedirect(true);


  }
  if(redirect){
    return <Navigate to={'/account/places'}/>
  }
    return (
        <div>
          <AccountNav />
          <form onSubmit={SavePlace}>
            {inputValue("Title", "")}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="title, for example: my lovely apartment"/>

            {inputValue("Address")}
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="address"/>

            {inputValue("Photo")}
            <PhotoUploader
              addedPhotos={addedPhotos}
              onChange={setAddedPhotos}/>

            {inputValue("Description")}
            <br></br>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}/>

            {inputValue("Perks")}
            <br></br>
            <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <Perks selected={perks} onChange={setPerks} />
            </div>
            <br></br>

            {inputValue("Extra info & Rules")}
            <br></br>
            <textarea
              value={extraInfo}
              onChange={(e) => setExtraInfo(e.target.value)}
            />

            {inputValue(
              "Check-in & Check-out Time"
            )}
            <br></br>

            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
              <div>
                <h3 className="mt-2 -mb-1">Check-in time</h3>
                <input
                  type="text"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  placeholder="12"
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Check-out time</h3>
                <input
                  type="text"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  placeholder="11"
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Max number of guests</h3>
                <input
                  type="number"
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(e.target.value)}
                />
              </div>
            </div>
            <div>
                <h3 className="mt-2 -mb-1">Price per night</h3>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}/>
              </div>
            <div>
              <br></br>
              <br></br>
              <button className="bg-secondary px-16 py-2 rounded-2xl">
                Save
              </button>
            </div>
          </form>
          </div>


    );

}

export default PlacesFormPage;