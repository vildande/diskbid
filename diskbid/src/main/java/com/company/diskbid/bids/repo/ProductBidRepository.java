package com.company.diskbid.bids.repo;

import com.company.diskbid.bids.entitities.BidEntity;
import com.company.diskbid.bids.entitities.ProductBidEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductBidRepository extends JpaRepository<ProductBidEntity, Long> {

    Optional<List<ProductBidEntity>> findAllByAcceptedFalseAndOwnerIdEquals(Long id);

    Optional<ProductBidEntity> findByAcceptedFalseAndIdEquals(Long id);

    Optional<List<ProductBidEntity>> findAllByAcceptedTrueAndEndTimeIsAfter(LocalDateTime time);

    Optional<List<ProductBidEntity>> findAllByAcceptedTrueAndEndTimeIsBefore(LocalDateTime time);

    Optional<ProductBidEntity> findByAcceptedTrueAndEndTimeIsAfterAndIdEquals(LocalDateTime time, Long id);

    Optional<ProductBidEntity> findByAcceptedTrueAndEndTimeIsBeforeAndIdEquals(LocalDateTime time, Long id);

    Optional<ProductBidEntity> findAllByAcceptedFalseAndOwnerIdEqualsAndIdEquals(Long ownerId, Long productId);

    Optional<List<ProductBidEntity>> findAllByAcceptedFalse();

    Optional<List<ProductBidEntity>> findAllByAcceptedTrueAndClosedFalseAndEndTimeIsBefore(LocalDateTime time);

    Optional<ProductBidEntity> findByAcceptedTrueAndAndClosedFalseAndEndTimeIsBeforeAndIdEquals(LocalDateTime time, Long id);
}
