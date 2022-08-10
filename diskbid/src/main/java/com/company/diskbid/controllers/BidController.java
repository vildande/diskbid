package com.company.diskbid.controllers;



import com.company.diskbid.auth.models.User;
import com.company.diskbid.auth.pojo.MessageResponse;
import com.company.diskbid.auth.repo.UserRepository;
import com.company.diskbid.bids.entitities.ProductBidEntity;
import com.company.diskbid.bids.models.Bid;
import com.company.diskbid.bids.models.ProductBid;
import com.company.diskbid.bids.service.ProductBidService;
import lombok.SneakyThrows;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/bids")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('USER')")
public class BidController {

    @Autowired
    private ProductBidService productBidService;


    @Value("${file.productimages.dir}")
    private String imagesDir;


    @GetMapping("")
    public ResponseEntity<?> getAllActiveProductBids() {
        List<ProductBid> productBids = productBidService.getAllActiveProductBids();

        return ResponseEntity.ok(productBids);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBid(@PathVariable Long id){
        ProductBid productBid = productBidService.getActiveProductById(id);

        if(productBid == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(productBid);
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> setBid(@PathVariable Long id, @RequestBody Bid bid) {
        Bid placedBid = productBidService.placeBid(id, bid);

        if(placedBid == null)
            return ResponseEntity.badRequest().body(new MessageResponse("error during placing bid"));

        return ResponseEntity.ok().body(new MessageResponse("Successfully added"));
    }

    @GetMapping("/{id}/all")
    public ResponseEntity<?> getBidsOfActiveProduct(@PathVariable Long id) {
        List<Bid> bids = productBidService.getAllBidsByActiveProductBidId(id);

        if(bids == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(bids);
    }

    @PostMapping(value = "/add", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> addProductBid(@RequestPart MultipartFile image, @RequestPart ProductBid productBid) {

        if(!(Objects.equals(image.getContentType(), "image/jpg")
            || Objects.equals(image.getContentType(), "image/jpeg")
            || Objects.equals(image.getContentType(), "image/png")))
            return ResponseEntity.badRequest().body(new MessageResponse("Image should be jpg, jpeg or png"));

        try {
            productBidService.saveProductBid(productBid, image);
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body(new MessageResponse("Incorrect bid data. " + e.getMessage()));
        }

        return ResponseEntity.ok(new MessageResponse("Added successfully"));
    }

    @SneakyThrows
    @GetMapping(value = "/images/{imageName}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    public @ResponseBody byte[] getProductImage(@PathVariable String imageName){

        String defaultImage = imagesDir +  "noimage.png";
        String image = defaultImage;

        if(!imageName.equals("null")){
            image = imagesDir + imageName;
        }

        Path imagePath = Paths.get(image);
        Path defaultImagePath = Paths.get(defaultImage);

        InputStream in;

        try{
            FileSystemResource resource = new FileSystemResource(imagePath);
            in = resource.getInputStream();
        } catch (IOException e) {
            FileSystemResource resource = new FileSystemResource(defaultImagePath);
            in = resource.getInputStream();
        }
        return IOUtils.toByteArray(in);
    }

    @GetMapping("/delete")
    public ResponseEntity<?> getPendingBids(@RequestParam("ownerId") Long ownerId) {

        List<ProductBid> pendingBids = productBidService.getPendingProductBids(ownerId);

        if(pendingBids == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(pendingBids);
    }
    @GetMapping("delete/{id}")
    public ResponseEntity<?> getPendingBid(@RequestParam("ownerId") Long ownerId, @PathVariable Long id){
        ProductBid pendingBid = productBidService.getPendingProductBid(ownerId, id);

        if(pendingBid == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(pendingBid);
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<?> deletePendingBid(@PathVariable Long id){
        Boolean deleted = productBidService.deletePendingProductBid(id);

        if(!deleted)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(new MessageResponse("Deleted successfully"));
    }

    @GetMapping("/closed")
    public ResponseEntity<?> getClosedBids() {
        List<ProductBid> productBids = productBidService.getAllClosedProductBids();

        return ResponseEntity.ok(productBids);
    }

    @GetMapping("/closed/{id}")
    public ResponseEntity<?> getClosedBid(@PathVariable Long id){
        ProductBid productBid = productBidService.getClosedProductBidById(id);

        if(productBid == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(productBid);
    }

    @GetMapping("/closed/{id}/all")
    public ResponseEntity<?> getBidsOfClosedProduct(@PathVariable Long id) {
        List<Bid> bids = productBidService.getAllBidsByClosedProductBidId(id);

        if(bids == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(bids);
    }


    @GetMapping("/pending/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllPendingProducts(){
        List<ProductBid> pendingProducts = productBidService.getAllPendingProductBids();

        return ResponseEntity.ok(pendingProducts);
    }

    @GetMapping("/pending/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPendingProduct(@PathVariable Long id){
        ProductBid pendingProduct = productBidService.getPendingProductBidByProductId(id);

        if(pendingProduct == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(pendingProduct);
    }

    @DeleteMapping("/pending/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePendingProduct(@PathVariable Long id){
        Boolean deleted = productBidService.deletePendingProductBid(id);

        if(!deleted)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(new MessageResponse("Successfully deleted"));
    }

    @PatchMapping("/pending/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> acceptPendingProduct(@PathVariable Long id, @RequestBody ProductBid productBid) {
        Boolean accepted = productBidService.acceptPendingProductBid(id);

        if(!accepted)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(new MessageResponse("Successfully accepted"));
    }


    @GetMapping("/results")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getProductBidResults(){
        List<ProductBid> productBids = productBidService.getAllNotChosenClosedProductBids();

        return ResponseEntity.ok(productBids);
    }

    @GetMapping("/results/{id}/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getBidsOfProductBidResults(@PathVariable Long id) {
        List<Bid> bids = productBidService.getAllBidsWithEmailByClosedProductBidId(id);

        if(bids == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(bids);
    }

    @PatchMapping("/results/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> setWinner(@PathVariable Long id, @RequestParam Long winnerId) {
        Boolean set = productBidService.setWinner(id, winnerId);
        if(!set)
            return ResponseEntity.badRequest().body(new MessageResponse("Cannot set the winner"));

        return ResponseEntity.ok(new MessageResponse("Successfully set the winner"));
    }
}
