package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.AddressRequest;
import com.team6.ecommercesystem.dto.response.AddressResponse;
import com.team6.ecommercesystem.model.User;

import java.util.List;

public interface AddressService {
    User getCurrentUser();
    List<AddressResponse> getMyAddresses();
    AddressResponse createAddress(AddressRequest request);
    AddressResponse updateAddress(Long id, AddressRequest request);
    void deleteAddress(Long id);
    void setDefault(Long id);
}
