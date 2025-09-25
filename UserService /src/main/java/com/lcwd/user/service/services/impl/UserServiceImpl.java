package com.lcwd.user.service.services.impl;

import com.lcwd.user.service.entities.User;
import com.lcwd.user.service.exception.ResourceNotFoundException;
import com.lcwd.user.service.repositories.UserRepository;
import com.lcwd.user.service.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {


    @Autowired
    private UserRepository userRepository;
   @Override
   public User saveUser(User user){
      String randomUserId = UUID.randomUUID().toString();
      user.setUserId(randomUserId);

        return userRepository.save(user);

    }
@Override
   public  List<User> getAllUser(){
        return userRepository.findAll();
    }
@Override
    public User getUserBYId(String userId){
       return userRepository.findById(userId)
               .orElseThrow(()-> new ResourceNotFoundException("user not found " + userId));
    }


    @Override
    public User UpdateUserById(String  userId, User user) {

       User updateUser= userRepository.findByUserId(userId).orElseThrow(()->new RuntimeException("user not found "));


        updateUser.setName(user.getName());
        updateUser.setEmail(user.getEmail());
        updateUser.setAbout(user.getAbout());
        return userRepository.save(updateUser);
    }
@Override
    public void deleteUser(String  userId){
       userRepository.deleteById(userId);
    }


}
