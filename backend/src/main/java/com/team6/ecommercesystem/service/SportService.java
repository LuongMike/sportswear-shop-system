package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.SportRequest;
import com.team6.ecommercesystem.dto.response.SportResponse;

import java.util.List;

public interface SportService {

    List<SportResponse> getAllSport();

    SportResponse createSport(SportRequest request);

    SportResponse updateSport(Long id, SportRequest request);

    SportResponse getSportById(Long id);

    void deleteSport(Long id);
}
