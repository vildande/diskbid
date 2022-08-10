package com.company.diskbid.controllers;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/bids/test")
@CrossOrigin(origins = "*")
public class TestBidController {

    @GetMapping("")
    public ResponseEntity<?> getAll() {
        List<String> bids = new ArrayList<>();
        bids.add("bid1");
        bids.add("bid2");

        return ResponseEntity.ok(bids);
    }

    @PostMapping("")
    public ResponseEntity<?> addBid() {
        return ResponseEntity.ok("Adding bid");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBid(@PathVariable Long id) {

        return ResponseEntity.ok("Get bid with id=" + id);
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateBid(@PathVariable Long id) {
        return ResponseEntity.ok("Update bid with id=" + id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBid(@PathVariable Long id) {
        return ResponseEntity.ok("Delete bid with id=" + id);
    }

}
