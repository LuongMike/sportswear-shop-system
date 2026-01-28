package com.team6.ecommercesystem.repository;

import com.team6.ecommercesystem.model.BlackListedAccessToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlacklistedAccessTokenRepository extends CrudRepository<BlackListedAccessToken, String> {
}
