package com.company.diskbid.bids.entitities;

import com.company.diskbid.auth.models.User;
import com.sun.istack.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
@Getter
@Setter
@NoArgsConstructor
public class FeedbackEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String subject;

    @NotNull
    private String description;

    @NotNull
    @ManyToOne
    @JoinColumn(name="sender_id")
    private User sender;

    @NotNull
    private LocalDateTime date;

}
