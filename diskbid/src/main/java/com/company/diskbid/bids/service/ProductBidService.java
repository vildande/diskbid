package com.company.diskbid.bids.service;


import com.company.diskbid.bids.models.Bid;
import com.company.diskbid.bids.models.ProductBid;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductBidService {

    ProductBid saveProductBid(ProductBid productBid, MultipartFile image);

    List<ProductBid> getPendingProductBids(Long ownerId);

    Boolean deletePendingProductBid(Long id);

    ProductBid getPendingProductBidByProductId(Long id);

    List<ProductBid> getAllActiveProductBids();

    List<ProductBid> getAllClosedProductBids();

    ProductBid getActiveProductById(Long id);

    ProductBid getClosedProductBidById(Long id);

    ProductBid getPendingProductBid(Long ownerId, Long productId);

    Bid placeBid(Long productId, Bid bid);

    List<Bid> getAllBidsByActiveProductBidId(Long id);

    List<Bid> getAllBidsByClosedProductBidId(Long id);

    List<ProductBid> getAllPendingProductBids();

    Boolean acceptPendingProductBid(Long id);


    List<ProductBid> getAllNotChosenClosedProductBids();

    List<Bid> getAllBidsWithEmailByClosedProductBidId(Long id);

    Boolean setWinner(Long id, Long winnerId);
}
