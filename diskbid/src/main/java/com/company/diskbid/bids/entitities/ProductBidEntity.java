package com.company.diskbid.bids.entitities;


import com.company.diskbid.auth.models.User;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "bid_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductBidEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String name;

    private String description;

    @NotNull
    private BigDecimal startAmount;

    @NotNull
    private BigDecimal bidStep;

    @NotNull
    private BigDecimal minBidAmount;

    @NotNull
    private Integer minutes;

    private LocalDateTime endTime;

    private String image;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "winner_id")
    private User winner;

    @NotNull
    private Boolean accepted = false;


    @OneToMany(mappedBy = "productBid")
    private List<BidEntity> bids;

    @NotNull
    private Boolean closed = false;
}
