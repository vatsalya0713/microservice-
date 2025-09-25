package com.lcwd.hotel.Service;

import com.lcwd.hotel.entities.Hotel;
import com.lcwd.hotel.repo.HotelRepository;
import jakarta.persistence.Id;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class HotelService {
     @Autowired
    private HotelRepository hotelRepository;

    public Hotel saveHotel(Hotel hotel){
        hotel.setId(UUID.randomUUID().toString());
        return hotelRepository.save(hotel);
    }

    public List<Hotel> findAllHotel(){
        return hotelRepository.findAll();
    }

    public Hotel findHotelById(String Id){



        return hotelRepository.findHotelById(Id).orElseThrow(()-> new RuntimeException("Hotel not found "+Id));
    }

    public Hotel UpdateHotelById(String Id,Hotel hotel){

        Hotel data =hotelRepository.findHotelById(Id).orElseThrow(()-> new RuntimeException("Hotel not found"));

        data.setName(hotel.getName());
        data.setLocation(hotel.getLocation());
        data.setAbout(hotel.getAbout());
        return hotelRepository.save(data);

    }

    public  void deletHotelById(String Id){
        hotelRepository.deleteById(Id);

    }


}
