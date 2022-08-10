package com.company.diskbid.bids.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductBid {

    private Long id;

    private String name;

    private String description;

    private BigDecimal minBidAmount;

    private BigDecimal bidStep;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime endTime;

    private Integer minutes;

    private Long ownerId;

    private String owner;

    private Long winnerId;

    private String winner;

    private Boolean accepted;

    private String image;

    private Boolean closed;

    private Long latestBidderId;
}