package com.lcwd.rating.controller;

import com.lcwd.rating.entities.Rating;
import com.lcwd.rating.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rating")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @PostMapping("/create")
    public ResponseEntity< Rating> saveRating(@RequestBody Rating rating){
       return ResponseEntity.status(HttpStatus.CREATED).body( ratingService.saveRating(rating));
    }


    @GetMapping("/getAllRating")
    public ResponseEntity<List<Rating>> getAllRating(){
        return ResponseEntity.ok( ratingService.getAllReating());
    }

    @GetMapping("/getRatingById/{ratingId}")
    public Rating GetRatingById(@PathVariable String ratingId){
        return ratingService.getRatingById(ratingId);
    }


    @GetMapping("/getRatingByUserId/{userId}")
    public ResponseEntity<List<Rating>> getRatingByUserId( @PathVariable String userId){
        return ResponseEntity.ok(ratingService.getRatingByUserId(userId));
    }

    @GetMapping("/getRatingByHotelId/{hotelId}")
    public ResponseEntity< List<Rating>> getRatingByHotelId(@PathVariable String hotelId){
        return ResponseEntity.ok( ratingService.getRatingByHotelrId(hotelId));
    }


}
