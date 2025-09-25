package com.lcwd.user.service.controller;

import com.lcwd.user.service.entities.User;
import com.lcwd.user.service.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userservice;
    @PostMapping("/create")
    public ResponseEntity< User> saveUser(@RequestBody User user){
           User user1=userservice.saveUser(user);
         return ResponseEntity.status(HttpStatus.CREATED).body(user1);

    }
    @GetMapping("/getAllUser")
    public  ResponseEntity<List<User>> getAllUser(){
        List<User> alluser = userservice.getAllUser();
        return  ResponseEntity.ok(alluser);
    }

    @GetMapping("/getUserById/{userId}")
    public ResponseEntity< User> getUserById(@PathVariable String userId){
        User user = userservice.getUserBYId(userId);

        return  ResponseEntity.ok(user);
    }
    @PutMapping("/updateUser/{userId}")
    public User updateUserById(@PathVariable String userId,@RequestBody User user){
        return userservice.UpdateUserById(userId,user);
    }

    @DeleteMapping("/delete/{userId}")
    public void deleteUser(@PathVariable String userId){
        userservice.deleteUser(userId);
    }
}
