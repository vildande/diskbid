package com.company.diskbid.auth.pojo;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class SignupRequest {

    private String username;

    private String email;

    private String password;

    private Set<String> roles;

}
