package com.lcwd.user.service.external;

import com.lcwd.user.service.entities.Hotel;
import com.lcwd.user.service.entities.Rating;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.List;

@FeignClient(name="RATING-SERVICE")
public interface RatingServiceClient {

    @GetMapping("/api/rating/getRatingByUserId/{userId}")
    ArrayList<Rating> getRatingsByUserId(@PathVariable("userId") String userId);



}