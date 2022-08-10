package com.company.diskbid.bids.repo;

import com.company.diskbid.bids.entitities.BidEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BidRepository extends JpaRepository<BidEntity, Long> {

    Optional<List<BidEntity>> findAllByProductBidId(Long id);

}
