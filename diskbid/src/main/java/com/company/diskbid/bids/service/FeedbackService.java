package com.company.diskbid.bids.service;

import com.company.diskbid.bids.models.Feedback;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


public interface FeedbackService {

    Feedback addFeedback(Feedback feedback);

    List<Feedback> getAllFeedbacks();

    Boolean deleteFeedbackById(Long id);
}
