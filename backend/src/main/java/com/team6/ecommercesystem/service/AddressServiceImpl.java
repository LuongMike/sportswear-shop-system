package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.AddressRequest;
import com.team6.ecommercesystem.dto.response.AddressResponse;
import com.team6.ecommercesystem.model.User;
import com.team6.ecommercesystem.model.UserAddress;
import com.team6.ecommercesystem.repository.UserAddressRepository;
import com.team6.ecommercesystem.repository.UserRepository;
import com.team6.ecommercesystem.utils.AddressMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService{
    private final UserAddressRepository addressRepository;
    private final UserRepository userRepository;

    @Override
    public User getCurrentUser() {
        try {
            String userIdStr = SecurityContextHolder.getContext().getAuthentication().getName();
            Long userId = Long.parseLong(userIdStr);

            return userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid User ID in token");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<AddressResponse> getMyAddresses() {
        User user = getCurrentUser();
        return addressRepository.findAllByUserId(user.getId()).stream()
                .map(AddressMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AddressResponse createAddress(AddressRequest request) {
        User user = getCurrentUser();
        List<UserAddress> myAddresses = addressRepository.findAllByUserId(user.getId());

        boolean isDefault = myAddresses.isEmpty() || Boolean.TRUE.equals(request.getIsDefault());

        UserAddress address = UserAddress.builder()
                .recipientName(request.getRecipientName())
                .phoneNumber(request.getPhoneNumber())
                .city(request.getCity())
                .district(request.getDistrict())
                .ward(request.getWard())
                .street(request.getStreet())
                .isDefault(isDefault)
                .user(user)
                .build();

        if (isDefault && !myAddresses.isEmpty()) {
            myAddresses.forEach(a -> a.setIsDefault(false));
            addressRepository.saveAll(myAddresses);
        }
        return AddressMapper.toResponse(addressRepository.save(address));
    }

    @Override
    @Transactional
    public AddressResponse updateAddress(Long id, AddressRequest request) {
        User user = getCurrentUser();
        UserAddress address = addressRepository.findByIdAndUserId(id, user.getId());
        if (address == null) throw new RuntimeException("Address not found or access denied");

        address.setRecipientName(request.getRecipientName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setCity(request.getCity());
        address.setDistrict(request.getDistrict());
        address.setWard(request.getWard());
        address.setStreet(request.getStreet());

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            setDefaultAddress(user, address);
        }

        return AddressMapper.toResponse(addressRepository.save(address));
    }

    @Override
    @Transactional
    public void deleteAddress(Long id) {
        User user = getCurrentUser();
        UserAddress address = addressRepository.findByIdAndUserId(id, user.getId());
        if (address == null) throw new RuntimeException("Address not found");

        addressRepository.delete(address);
    }

    @Override
    @Transactional
    public void setDefault(Long id) {
        User user = getCurrentUser();
        UserAddress address = addressRepository.findByIdAndUserId(id, user.getId());
        if (address == null) throw new RuntimeException("Address not found");

        setDefaultAddress(user, address);
    }

    private void setDefaultAddress(User user, UserAddress newDefault) {
        List<UserAddress> all = addressRepository.findAllByUserId(user.getId());
        for (UserAddress addr : all) {
            addr.setIsDefault(false);
        }
        newDefault.setIsDefault(true);
        addressRepository.saveAll(all); // Update batch
    }


}
