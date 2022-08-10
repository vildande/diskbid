package com.company.diskbid.bids.service;

import com.company.diskbid.auth.models.User;
import com.company.diskbid.auth.repo.UserRepository;
import com.company.diskbid.bids.entitities.BidEntity;
import com.company.diskbid.bids.entitities.ProductBidEntity;
import com.company.diskbid.bids.models.Bid;
import com.company.diskbid.bids.models.ProductBid;
import com.company.diskbid.bids.repo.BidRepository;
import com.company.diskbid.bids.repo.ProductBidRepository;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;


@Service
public class ProductBidServiceImpl implements ProductBidService {

    @Autowired
    private ProductBidRepository productBidRepository;

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${file.productimages.dir}")
    private String imagesDir;


    @Override
    public ProductBid saveProductBid(ProductBid productBid, MultipartFile image) {

        ProductBidEntity productBidEntity = new ProductBidEntity();

        if(productBid.getName().isBlank())
            throw new RuntimeException("Empty Product Name.");

        if(productBid.getDescription().isBlank())
            throw new RuntimeException("Empty Product Description.");

        if(productBid.getMinBidAmount().compareTo(BigDecimal.ZERO) <= 0)
            throw new RuntimeException("Min bid amount should greater than zero.");

        if(productBid.getBidStep().compareTo(BigDecimal.valueOf(1000)) < 0
            && productBid.getBidStep().compareTo(BigDecimal.valueOf(10000000)) > 0)
            throw new RuntimeException("Bid step should be between 1000 and 10000000.");

        if(productBid.getMinutes() < 5 || productBid.getMinutes() > 4320)
            throw new RuntimeException("Minutes should be between 5 and 4320.");

        User owner = new User();
        try {
            owner = userRepository.getById(productBid.getOwnerId());
        }catch (Exception e) {
            throw new RuntimeException("Cannot find owner by id.");
        }

        productBidEntity.setName(productBid.getName());
        productBidEntity.setDescription(productBid.getDescription());
        productBidEntity.setStartAmount(productBid.getMinBidAmount());
        productBidEntity.setBidStep(productBid.getBidStep());
        productBidEntity.setMinBidAmount(productBid.getMinBidAmount());
        productBidEntity.setMinutes(productBid.getMinutes());
        productBidEntity.setOwner(owner);
        productBidEntity.setAccepted(false);


        productBidEntity = productBidRepository.save(productBidEntity);

        String imageHash =  DigestUtils.sha256Hex(
                productBidEntity.getOwner().getId() + "_" + productBidEntity.getId());
        String ext;
        switch (image.getContentType()){
            case "image/jpeg":
                ext = "jpeg";
                break;
            case "image/jpg":
                ext = "jpg";
                break;
            case "image/png":
                ext = "png";
                break;
            default:
                ext = "png";
        }

        try {
            String filename = imageHash + "." + ext;
            String fullPath = imagesDir + filename;
            byte[] bytes = image.getBytes();
            Path path = Paths.get(fullPath);
            Files.write(path, bytes);
            productBidEntity.setImage(filename);
            productBidRepository.save(productBidEntity);

            productBid.setImage(filename);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Cannot save product image.");
        }

        return productBid;
    }

    @Override
    public List<ProductBid> getPendingProductBids(Long ownerId) {
        List<ProductBidEntity> pendingProductEntities = productBidRepository.findAllByAcceptedFalseAndOwnerIdEquals(ownerId)
                                                            .orElse(null);

        if(pendingProductEntities == null)
            return null;

        List<ProductBid> pendingProducts = new ArrayList<>();

        for (var p : pendingProductEntities){
            pendingProducts.add(new ProductBid(
                    p.getId(),
                    p.getName(),
                    p.getDescription(),
                    p.getMinBidAmount(),
                    p.getBidStep(),
                    null,
                    p.getMinutes(),
                    p.getOwner().getId(),
                    p.getOwner().getUsername(),
                    null,
                    null,
                    p.getAccepted(),
                    p.getImage(),
                    p.getClosed(),
                    null
            ));
        }

        pendingProducts.sort((p1, p2) -> p2.getId().compareTo(p1.getId()));

        return pendingProducts;
    }

    @Override
    public ProductBid getPendingProductBid(Long ownerId, Long productId) {
        ProductBidEntity productBidEntity = productBidRepository.findAllByAcceptedFalseAndOwnerIdEqualsAndIdEquals(ownerId, productId)
                .orElse(null);

        ProductBid pendingProduct = null;

        if(productBidEntity != null){

            pendingProduct = new ProductBid(
                    productBidEntity.getId(),
                    productBidEntity.getName(),
                    productBidEntity.getDescription(),
                    productBidEntity.getMinBidAmount(),
                    productBidEntity.getBidStep(),
                    null,
                    productBidEntity.getMinutes(),
                    productBidEntity.getOwner().getId(),
                    productBidEntity.getOwner().getUsername(),
                    null,
                    null,
                    productBidEntity.getAccepted(),
                    productBidEntity.getImage(),
                    productBidEntity.getClosed(),
                    null
            );
        }

        return pendingProduct;
    }

    @Override
    public Bid placeBid(Long productId, Bid bid) {
        ProductBidEntity productBidEntity = productBidRepository.findByAcceptedTrueAndEndTimeIsAfterAndIdEquals(LocalDateTime.now(), productId)
                .orElse(null);
        Bid placedBid = null;

        if(productBidEntity != null){
            if(productBidEntity.getMinBidAmount().compareTo(bid.getAmount()) > 0)
                return null;

            if(productBidEntity.getBids() == null)
                productBidEntity.setBids(new ArrayList<>());

            User bidder = userRepository.getById(bid.getBidderId());

            BidEntity bidEntity = new BidEntity(
                    null,
                    productBidEntity,
                    bidder,
                    bid.getAmount(),
                    LocalDateTime.now()
            );

            bidEntity = bidRepository.save(bidEntity);

            productBidEntity.getBids().add(bidEntity);
            productBidEntity.setMinBidAmount(bidEntity.getAmount().add(productBidEntity.getBidStep()));
            productBidRepository.save(productBidEntity);

            placedBid = new Bid(
                    bidEntity.getId(),
                    bidEntity.getProductBid().getId(),
                    bidEntity.getProductBid().getName(),
                    bidEntity.getBidder().getId(),
                    bidEntity.getBidder().getUsername(),
                    null,
                    bidEntity.getAmount(),
                    bidEntity.getTime()
            );
        }

        return placedBid;
    }

    @Override
    public List<Bid> getAllBidsByActiveProductBidId(Long id) {
        ProductBidEntity activeProduct = productBidRepository
                .findByAcceptedTrueAndEndTimeIsAfterAndIdEquals(LocalDateTime.now(), id)
                .orElse(null);

        if(activeProduct == null)
            return null;

        List<BidEntity> bidEntities = bidRepository.findAllByProductBidId(activeProduct.getId())
                .orElse(null);



        if(bidEntities == null)
            return null;

        bidEntities.sort((b1, b2) -> b2.getTime().compareTo(b1.getTime()));

        List<Bid> bids = new ArrayList<>();

        for(var b : bidEntities) {
            bids.add(new Bid(
                    b.getId(),
                    b.getProductBid().getId(),
                    b.getProductBid().getName(),
                    b.getBidder().getId(),
                    b.getBidder().getUsername(),
                    null,
                    b.getAmount(),
                    b.getTime().minusHours(6)
            ));
        }

        return bids;
    }

    @Override
    public List<Bid> getAllBidsByClosedProductBidId(Long id) {
        ProductBidEntity activeProduct = productBidRepository
                .findByAcceptedTrueAndEndTimeIsBeforeAndIdEquals(LocalDateTime.now(), id)
                .orElse(null);

        if(activeProduct == null)
            return null;

        List<BidEntity> bidEntities = bidRepository.findAllByProductBidId(activeProduct.getId())
                .orElse(null);

        if(bidEntities == null)
            return null;

        bidEntities.sort((b1, b2) -> b2.getTime().compareTo(b1.getTime()));

        List<Bid> bids = new ArrayList<>();

        for(var b : bidEntities) {
            bids.add(new Bid(
                    b.getId(),
                    b.getProductBid().getId(),
                    b.getProductBid().getName(),
                    b.getBidder().getId(),
                    b.getBidder().getUsername(),
                    null,
                    b.getAmount(),
                    b.getTime().minusHours(6)
            ));
        }

        return bids;
    }

    @Override
    public List<ProductBid> getAllPendingProductBids() {
        List<ProductBidEntity> productBidEntities = productBidRepository.findAllByAcceptedFalse().orElse(new ArrayList<>());

        List<ProductBid> pendingBids = new ArrayList<>();
        for (var p : productBidEntities){
            pendingBids.add(new ProductBid(
               p.getId(),
               p.getName(),
               p.getDescription(),
               p.getMinBidAmount(),
               p.getBidStep(),
               null,
               p.getMinutes(),
               p.getOwner().getId(),
               p.getOwner().getUsername(),
               null,
               null,
               p.getAccepted(),
               p.getImage(),
               p.getClosed(),
               null
            ));
        }

        pendingBids.sort((p1, p2) -> p2.getId().compareTo(p1.getId()));

        return pendingBids;
    }

    @Override
    public Boolean acceptPendingProductBid(Long id) {
        ProductBidEntity productBidEntity = productBidRepository.findByAcceptedFalseAndIdEquals(id).orElse(null);
        if(productBidEntity == null)
            return false;

        productBidEntity.setAccepted(true);
        productBidEntity.setEndTime(LocalDateTime.now().plusMinutes(productBidEntity.getMinutes()));

        productBidRepository.save(productBidEntity);

        return true;
    }

    @Override
    public List<ProductBid> getAllNotChosenClosedProductBids() {
        List<ProductBidEntity> productBidList = productBidRepository.findAllByAcceptedTrueAndClosedFalseAndEndTimeIsBefore(LocalDateTime.now())
                .orElse(new ArrayList<>());
        List<ProductBid> productBids = new ArrayList<>();

        for(var p : productBidList){
            productBids.add(new ProductBid(
                    p.getId(),
                    p.getName(),
                    p.getDescription(),
                    p.getMinBidAmount(),
                    p.getBidStep(),
                    p.getEndTime().minusHours(6),
                    p.getMinutes(),
                    p.getOwner().getId(),
                    p.getOwner().getUsername(),
                    p.getWinner() == null ? null : p.getWinner().getId(),
                    p.getWinner() == null ? null : p.getWinner().getUsername(),
                    p.getAccepted(),
                    p.getImage(),
                    p.getClosed(),
                    null
            ));
        }

        productBids.sort((p1, p2) -> p2.getEndTime().compareTo(p1.getEndTime()));

        return productBids;
    }

    @Override
    public List<Bid> getAllBidsWithEmailByClosedProductBidId(Long id) {
        ProductBidEntity activeProduct = productBidRepository
                .findByAcceptedTrueAndEndTimeIsBeforeAndIdEquals(LocalDateTime.now(), id)
                .orElse(null);

        if(activeProduct == null)
            return null;

        List<BidEntity> bidEntities = bidRepository.findAllByProductBidId(activeProduct.getId())
                .orElse(null);

        if(bidEntities == null)
            return null;

        bidEntities.sort((b1, b2) -> b2.getTime().compareTo(b1.getTime()));

        List<Bid> bids = new ArrayList<>();

        for(var b : bidEntities) {
            bids.add(new Bid(
                    b.getId(),
                    b.getProductBid().getId(),
                    b.getProductBid().getName(),
                    b.getBidder().getId(),
                    b.getBidder().getUsername(),
                    b.getBidder().getEmail(),
                    b.getAmount(),
                    b.getTime().minusHours(6)
            ));
        }

        return bids;
    }

    @Override
    public Boolean setWinner(Long id, Long winnerId) {
        ProductBidEntity productBidEntity = productBidRepository
                .findByAcceptedTrueAndAndClosedFalseAndEndTimeIsBeforeAndIdEquals(LocalDateTime.now(), id)
                .orElse(null);

        if(productBidEntity == null)
            return false;

        User winner = null;

        if(winnerId > 0) {
            winner = userRepository.findById(winnerId).orElse(null);
            if(winner == null)
                return false;

        }

        productBidEntity.setWinner(winner);
        productBidEntity.setClosed(true);

        productBidRepository.save(productBidEntity);

        return true;
    }

    @Override
    public ProductBid getPendingProductBidByProductId(Long id) {
        ProductBidEntity productBidEntity = productBidRepository.findByAcceptedFalseAndIdEquals(id).orElse(null);

        ProductBid pendingProduct = null;

        if(productBidEntity != null){
            pendingProduct = new ProductBid(
                    productBidEntity.getId(),
                    productBidEntity.getName(),
                    productBidEntity.getDescription(),
                    productBidEntity.getMinBidAmount(),
                    productBidEntity.getBidStep(),
                    null,
                    productBidEntity.getMinutes(),
                    productBidEntity.getOwner().getId(),
                    productBidEntity.getOwner().getUsername(),
                    null,
                    null,
                    productBidEntity.getAccepted(),
                    productBidEntity.getImage(),
                    productBidEntity.getClosed(),
                    null
            );
        }

        return pendingProduct;
    }

    @Override
    public Boolean deletePendingProductBid(Long id) {
        ProductBidEntity productBidEntity = productBidRepository.findByAcceptedFalseAndIdEquals(id).orElse(null);

        if(productBidEntity == null)
            return false;

        File fileToDelete = FileUtils.getFile(imagesDir + productBidEntity.getImage());

        boolean success = FileUtils.deleteQuietly(fileToDelete);

        productBidRepository.delete(productBidEntity);
        return true;
    }

    @Override
    public List<ProductBid> getAllActiveProductBids() {

        List<ProductBidEntity> productBidList = productBidRepository.findAllByAcceptedTrueAndEndTimeIsAfter(LocalDateTime.now())
                .orElse(new ArrayList<>());

        List<ProductBid> productBids = new ArrayList<>();

        for(var p : productBidList){
            productBids.add(new ProductBid(
                    p.getId(),
                    p.getName(),
                    p.getDescription(),
                    p.getMinBidAmount(),
                    p.getBidStep(),
                    p.getEndTime().minusHours(6),
                    p.getMinutes(),
                    p.getOwner().getId(),
                    p.getOwner().getUsername(),
                    null,
                    null,
                    p.getAccepted(),
                    p.getImage(),
                    p.getClosed(),
                    null
            ));
        }

        productBidList.sort((p1, p2) -> p2.getId().compareTo(p1.getId()));

        return productBids;
    }

    @Override
    public List<ProductBid> getAllClosedProductBids() {

        List<ProductBidEntity> productBidList = productBidRepository.findAllByAcceptedTrueAndEndTimeIsBefore(LocalDateTime.now())
                .orElse(new ArrayList<>());
        List<ProductBid> productBids = new ArrayList<>();

        for(var p : productBidList){
            productBids.add(new ProductBid(
                    p.getId(),
                    p.getName(),
                    p.getDescription(),
                    p.getMinBidAmount(),
                    p.getBidStep(),
                    p.getEndTime().minusHours(6),
                    p.getMinutes(),
                    p.getOwner().getId(),
                    p.getOwner().getUsername(),
                    p.getWinner() == null ? null : p.getWinner().getId(),
                    p.getWinner() == null ? null : p.getWinner().getUsername(),
                    p.getAccepted(),
                    p.getImage(),
                    p.getClosed(),
                    null
            ));
        }

        productBids.sort((p1, p2) -> p2.getEndTime().compareTo(p1.getEndTime()));

        return productBids;
    }

    @Override
    public ProductBid getActiveProductById(Long id) {
        ProductBidEntity productBidEntity = productBidRepository.findByAcceptedTrueAndEndTimeIsAfterAndIdEquals(LocalDateTime.now(), id)
                .orElse(null);

        ProductBid productBid = null;

        if(productBidEntity != null){
            List<BidEntity> bidEntities = productBidEntity.getBids();
            Long latest = null;
            if(bidEntities != null && !bidEntities.isEmpty()){
                bidEntities.sort(Comparator.comparing(BidEntity::getTime));
                latest = bidEntities.get(bidEntities.size() - 1).getBidder().getId();
            }

            productBid = new ProductBid(
                    productBidEntity.getId(),
                    productBidEntity.getName(),
                    productBidEntity.getDescription(),
                    productBidEntity.getMinBidAmount(),
                    productBidEntity.getBidStep(),
                    productBidEntity.getEndTime().minusHours(6),
                    productBidEntity.getMinutes(),
                    productBidEntity.getOwner().getId(),
                    productBidEntity.getOwner().getUsername(),
                    null,
                    null,
                    productBidEntity.getAccepted(),
                    productBidEntity.getImage(),
                    productBidEntity.getClosed(),
                    latest
            );
        }

        return productBid;
    }

    @Override
    public ProductBid getClosedProductBidById(Long id) {
        ProductBidEntity productBidEntity = productBidRepository.findByAcceptedTrueAndEndTimeIsBeforeAndIdEquals(LocalDateTime.now(), id)
                .orElse(null);

        ProductBid productBid = null;

        if(productBidEntity != null) {
            productBid = new ProductBid(
                    productBidEntity.getId(),
                    productBidEntity.getName(),
                    productBidEntity.getDescription(),
                    productBidEntity.getMinBidAmount(),
                    productBidEntity.getBidStep(),
                    productBidEntity.getEndTime().minusHours(6),
                    productBidEntity.getMinutes(),
                    productBidEntity.getOwner().getId(),
                    productBidEntity.getOwner().getUsername(),
                    productBidEntity.getWinner() == null ? null : productBidEntity.getWinner().getId(),
                    productBidEntity.getWinner() == null ? null : productBidEntity.getWinner().getUsername(),
                    productBidEntity.getAccepted(),
                    productBidEntity.getImage(),
                    productBidEntity.getClosed(),
                    null
            );
        }

        return productBid;
    }

}
