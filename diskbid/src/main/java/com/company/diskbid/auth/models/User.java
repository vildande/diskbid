package com.company.diskbid.auth.models;

import com.company.diskbid.bids.entitities.BidEntity;
import com.company.diskbid.bids.entitities.FeedbackEntity;
import com.company.diskbid.bids.entitities.ProductBidEntity;
import com.sun.istack.NotNull;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users",
        uniqueConstraints = {
            @UniqueConstraint(columnNames = "username"), @UniqueConstraint(columnNames = "email")
        })
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String username;

    @NotNull
    private String email;

    @NotNull
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
                joinColumns = @JoinColumn(name = "user_id"),
                inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "sender")
    private List<FeedbackEntity> feedbacks;

    @OneToMany(mappedBy = "owner")
    private List<ProductBidEntity> productBids;

    @OneToMany(mappedBy = "winner")
    private List<ProductBidEntity> wonProductBids;

    @OneToMany(mappedBy = "bidder")
    private List<BidEntity> bids;

    public User() {}

    public User(String username, String email, String password) {
        super();
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
