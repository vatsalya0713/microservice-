package com.lcwd.rating.service;

import com.lcwd.rating.entities.Rating;
import com.lcwd.rating.repo.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RatingService {

    //create
@Autowired
private RatingRepository ratingRepository;
    public Rating saveRating(Rating rating){



        return ratingRepository.save(rating);
    }


    //getALLReating
public List<Rating> getAllReating(){

        return ratingRepository.findAll();

}


    //getRatingById

    public Rating getRatingById(String ratingId){
        return ratingRepository.findById(ratingId).orElseThrow(()-> new RuntimeException("rating Id not found "));
    }

    //getUserId
    public List<Rating> getRatingByUserId(String userId){
        return ratingRepository.findByUserId(userId);
    }

    public List<Rating> getRatingByHotelrId(String hotelId){
        return ratingRepository.findByUserId(hotelId);
    }


    //deletingRating
 public void deleteRating(String ratingId){
        ratingRepository.deleteById(ratingId);
 }


}
