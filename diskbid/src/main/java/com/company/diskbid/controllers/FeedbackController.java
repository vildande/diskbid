package com.company.diskbid.controllers;


import com.company.diskbid.auth.pojo.MessageResponse;
import com.company.diskbid.bids.models.Feedback;
import com.company.diskbid.bids.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/feedbacks")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping("")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> sendFeedback(@RequestBody Feedback feedback) {

        if(feedback.getSubject().isBlank() || feedback.getDescription().isBlank())
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(
                            "Error: Empty feedback subject or description"
                    ));

        feedbackService.addFeedback(feedback);

        return ResponseEntity.ok(new MessageResponse("Feedback sent"));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getFeedbacks() {
        List<Feedback> feedbacks = feedbackService.getAllFeedbacks();

        return ResponseEntity.ok(feedbacks);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long id){
        Boolean deleted = feedbackService.deleteFeedbackById(id);

        if(!deleted)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(new MessageResponse("Successfully deleted"));
    }
}
