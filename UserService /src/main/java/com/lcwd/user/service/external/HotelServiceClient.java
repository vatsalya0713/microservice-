package com.lcwd.user.service.external;

import com.lcwd.user.service.entities.Hotel;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name="HOTEL-SERVICE")
public interface HotelServiceClient {
@GetMapping("/api/hotel/getById/{id}")
          Hotel getHotelById(@PathVariable("id") String hotelId);

}
