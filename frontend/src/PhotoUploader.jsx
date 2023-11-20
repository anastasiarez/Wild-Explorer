import React, { useState } from "react";
import axios from "axios";

const PhotoUploader = ({addedPhotos, onChange}) => {
    const [photoLink, setPhotoLink] = useState("");



    async function addPhotoUsingLink(e) {
        e.preventDefault();
        const {data:filename} = await axios.post('/upload-by-link', {link: photoLink})
        // console.log('Image uploaded successfully using link. Filename:', filename);
        onChange(prev => {
          return [...prev, filename];
        });
        setPhotoLink('');
      }

      function uploadPhoto(e){
        const files = e.target.files;
        const data = new FormData();
        for(let i = 0; i < files.length; i++){
          data.append('photos', files[i]);

        }

        axios.post('/upload', data, {
          headers: {'content-type' : 'multipart/form-data'}
        }).then(response => {
          const {data:filenames} = response;
          onChange(prev => {
            return [...prev, ...filenames];
          });
        });
      }

      function removePhoto(filename){ //Silvia
        onChange([...addedPhotos.filter(photo => photo != filename)]);
      }



    return(
        <>
        <div className="flex gp-2">
              <input
                type="text"
                value={photoLink}
                onChange={(e) => setPhotoLink(e.target.value)}
                placeholder={"add using a link ...jpg"}/>
              <button onClick={addPhotoUsingLink} className="bg-gray-200 px-4 rounded-2xl">
                Add&nbsp; Photo
              </button>
            </div>

            <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {addedPhotos.length > 0 && addedPhotos.map(link => (
                <div className="h-32 flex relative" key={link}>
                 <img className="rounded-2xl w-full object-cover" src={"http://localhost:4000/uploads/"+link} alt="" />




                <button onClick={() => removePhoto(link)} className="cursor-pointer absolute bottom-2 right-1 text-white bg-black bg-opacity-50rounded-2xl py-2 px-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                     <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                </button>
                </div> // Silvia



              ))}
              <label className="h-17 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
                <input type="file" multiple className="hidden" onChange={uploadPhoto}/>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75"/>
                </svg>
                Upload
              </label>
            </div>

        </>

    );
}

export default PhotoUploader