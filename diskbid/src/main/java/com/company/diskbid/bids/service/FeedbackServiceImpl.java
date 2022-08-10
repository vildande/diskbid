package com.company.diskbid.bids.service;

import com.company.diskbid.auth.models.User;
import com.company.diskbid.auth.repo.UserRepository;
import com.company.diskbid.bids.entitities.FeedbackEntity;
import com.company.diskbid.bids.models.Feedback;
import com.company.diskbid.bids.repo.FeedbackRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Feedback addFeedback(Feedback feedback) {
        FeedbackEntity feedbackEntity = new FeedbackEntity();

        BeanUtils.copyProperties(feedback, feedbackEntity);
        feedbackEntity.setSender(userRepository.getById(feedback.getSenderId()));
        feedbackEntity.setDate(LocalDateTime.now());
        feedbackRepository.save(feedbackEntity);

        return feedback;
    }

    @Override
    public List<Feedback> getAllFeedbacks() {
        List<FeedbackEntity> feedbackEntities = feedbackRepository.findAll();

        List<Feedback> feedbacks = new ArrayList<>();

        for (var f : feedbackEntities){
            feedbacks.add(new Feedback(
                    f.getId(),
                    f.getSubject(),
                    f.getDescription(),
                    f.getSender().getId(),
                    f.getSender().getUsername(),
                    f.getDate().minusHours(6)
            ));
        }

        return feedbacks;
    }

    @Override
    public Boolean deleteFeedbackById(Long id) {
        FeedbackEntity feedbackEntity = feedbackRepository.findById(id).orElse(null);
        if(feedbackEntity == null)
            return false;

        feedbackRepository.delete(feedbackEntity);
        return true;
    }
}
