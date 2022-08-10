package com.company.diskbid.auth.pojo;

import com.sun.istack.NotNull;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class LoginRequest {

    private String username;

    private String password;
}
