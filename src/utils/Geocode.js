import axios from "axios";
// const NOMINATIM_API = "https://nominatim.openstreetmap.org/search";

// const publicAxios = axios.create({
//     headers:{
//         'Content-Type': 'application/json',
//     },
// });


export const geocodeAddress = async(street, city,country,pincode)=>{
    try{
        const fullAddress = `${street ? street + ', ' : ''}${city}, ${country}${pincode ? ' - ' + pincode : ''}`;
        console.log('Geocoding query:', fullAddress);
        const response = await axios.get('/geocode', {
            params: {address: fullAddress},
        });
        const data = response.data;
        console.log('Goecoding response status', data.status);
        console.log('Geocoding response count:', data.results.length);
        console.log()
        if(data.status!=='OK' || data.results.length === 0){
            console.warn('No geocoding for address', fullAddress);
            return null;
        }
        const {lat, lng} = data.results[0].geometry.location;
        console.log('Geocoded successful: ', {lat,lng});
        return{ lat, lng};
    }catch(err){
        console.error('Error in geocoding', err);
        return null;
    }
};

export const reverseGeocode = async(lat,lng)=>{
    try{
        console.log('Reverse geocode:', {lat,lng});
        const response = await axios.get('/reverse-geocode',{
            params: {
                latlng: `${lat},${lng}`,        
            }
        });
        const data = response.data;
        if(data.status!=='OK'){
            console.warn('Reverse geocoding failed:', data.status);
             return null;
        }
        const components = data.results[0].address_components || [];
        const street = components.find(c=> c.types.includes('route'))?.long_name || '';
        const city = components.find(c=> c.types.includes('locality'))?.long_name || '';
        const country = components.find(c=> c.types.includes('country'))?.long_name || '';
        const pincode = components.find(c=> c.types.includes('postal_code'))?.long_name || '';
        return {street, city, country, pincode};
    }catch(err){
        console.error('Error in reverse geocoding', err);
        return null;
    }
};