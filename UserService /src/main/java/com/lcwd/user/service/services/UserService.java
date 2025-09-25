package com.lcwd.user.service.services;

import com.lcwd.user.service.entities.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

public interface UserService {
    //create
    User saveUser(User user);

    //get all user
    List<User> getAllUser();


    //get user by UserId
    User getUserBYId(String userId);

    //update user
    User UpdateUserById(String UserId,User user);

    //delete user
    void deleteUser(String userId);




}
