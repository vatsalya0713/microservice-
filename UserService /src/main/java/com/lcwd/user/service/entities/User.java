package com.lcwd.user.service.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.UUID;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table( name="micro_users")

public class User {
    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    private String userId;

    //@Column(name="NAME")
    private String name;
   // @Column(name="EMAIL")
    private String email;
  //  @Column(name="ABOUT")
    private String about;
    @Transient
    private ArrayList<Rating> ratings;

}
