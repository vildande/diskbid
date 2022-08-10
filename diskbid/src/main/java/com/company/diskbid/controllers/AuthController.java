package com.company.diskbid.controllers;

import com.company.diskbid.auth.configs.jwt.JwtUtils;
import com.company.diskbid.auth.models.ERole;
import com.company.diskbid.auth.models.Role;
import com.company.diskbid.auth.models.User;
import com.company.diskbid.auth.pojo.JwtResponse;
import com.company.diskbid.auth.pojo.LoginRequest;
import com.company.diskbid.auth.pojo.MessageResponse;
import com.company.diskbid.auth.pojo.SignupRequest;
import com.company.diskbid.auth.repo.RoleRepository;
import com.company.diskbid.auth.repo.UserRepository;
import com.company.diskbid.auth.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
                );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), userDetails.getEmail(), roles)
        );

    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {

        if(userRepository.existsByUsername(signupRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(
                            "Error: User with username " + signupRequest.getUsername() + " already exists"
                    ));

        }

        if(userRepository.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(
                            "Error: User with email " + signupRequest.getEmail() + " already exists"
                    ));
        }

        String reqUsername = signupRequest.getUsername();
        String reqEmail =  signupRequest.getEmail();
        String reqPassword = signupRequest.getPassword();

        String regexUsername = "^[a-z0-9]{3,16}$";
        String regexEmail = "[a-z0-9]+@[a-z]+\\.[a-z]{2,3}";
        String regexPassword = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$";

        if(!reqUsername.matches(regexUsername)){
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(
                            "Error: Invalid Username"
                    ));
        }

        if(!reqEmail.matches(regexEmail)){
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(
                            "Error: Invalid Email"
                    ));
        }

        if(!reqPassword.matches(regexPassword)){
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(
                            "Error: Invalid Password"
                    ));
        }

        if(signupRequest.getEmail().isBlank() || signupRequest.getUsername().isBlank() || signupRequest.getPassword().isBlank())
            throw new RuntimeException("CHEL TY {" + signupRequest.getUsername() + ", " + signupRequest.getEmail() + ", " + signupRequest.getPassword() + "}");

        User user = new User(signupRequest.getUsername(),
                signupRequest.getEmail(),
                passwordEncoder.encode(signupRequest.getPassword()));



        Set<String> reqRoles = signupRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (reqRoles == null) {
            Role userRole = roleRepository
                    .findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error, Role USER is not found"));
            roles.add(userRole);
        } else {
            reqRoles.forEach(r -> {
                switch (r) {
                    case "admin":
                        Role adminRole = roleRepository
                                .findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error, Role ADMIN not found"));
                        roles.add(adminRole);
                    case "mod":
                        Role modRole = roleRepository
                                .findByName(ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException("Error, Role MODERATOR not found"));
                        roles.add(modRole);
                    default:
                        Role userRole = roleRepository
                                .findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error, Role USER not found"));
                        roles.add(userRole);
                }
            });
        }
        user.setRoles(roles);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User CREATED"));
    }
}
