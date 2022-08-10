package com.company.diskbid.bids.entitities;


import com.company.diskbid.auth.models.User;
import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;


@Entity
@Table(name = "bids")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BidEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name="product_bid_id")
    private ProductBidEntity productBid;

    @NotNull
    @ManyToOne
    @JoinColumn(name="bidder_id")
    private User bidder;

    @NotNull
    private BigDecimal amount;

    @NotNull
    private LocalDateTime time;
}
