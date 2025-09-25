package com.lcwd.hotel.controller;

import com.lcwd.hotel.Service.HotelService;
import com.lcwd.hotel.entities.Hotel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/hotel")
public class HotelController {
@Autowired
    private HotelService hotelService;

    @PostMapping("/create")
    public ResponseEntity< Hotel> saveHotel(@RequestBody Hotel hotel){
         Hotel save =  hotelService.saveHotel(hotel);

         return  new ResponseEntity<>(save ,HttpStatus.CREATED);
    }

    @GetMapping("/getAllHotel")
    public ResponseEntity< List<Hotel>> findAllHotel(){
       List< Hotel> allHotel=  hotelService.findAllHotel();
        if(allHotel.isEmpty()){
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        }

        return ResponseEntity.ok(allHotel);
    }

    @GetMapping("/getById/{Id}")
    public Hotel findById(@PathVariable String Id){
        return hotelService.findHotelById(Id);
    }

    @PutMapping("/update/{Id}")
    public  Hotel updateHotelById(String Id,Hotel hotel){
        return hotelService.UpdateHotelById(Id,hotel);
    }


    @DeleteMapping("/deletById/{Id}")
    public ResponseEntity<String> deletHotelById(String Id){
        hotelService.deletHotelById(Id);

        return ResponseEntity.status(HttpStatus.OK).body("hotel deleted successfully");


    }
}
