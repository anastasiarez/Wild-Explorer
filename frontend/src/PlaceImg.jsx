export default function PlaceImg({ place, index = 0, className = null }) {
  if (!place.photos?.length) {
    return null; // Return null if there are no photos
  }
  if (!className) {
    className = 'object-cover';
  }
  return (
    <img className={className} src={`http://localhost:4000/uploads/${place.photos[index]}`} alt="" />
  );
}