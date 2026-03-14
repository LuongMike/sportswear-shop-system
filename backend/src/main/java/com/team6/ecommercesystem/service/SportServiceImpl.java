package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.SportRequest;
import com.team6.ecommercesystem.dto.response.SportResponse;
import com.team6.ecommercesystem.model.Sport;
import com.team6.ecommercesystem.repository.SportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional
public class SportServiceImpl implements SportService {

    private final SportRepository sportRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SportResponse> getAllSport() {
        return sportRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public SportResponse createSport(SportRequest request) {

        if (sportRepository.existsBySportName(request.getSportName())) {
            throw new RuntimeException("Sport đã tồn tại");
        }

        Sport sport = Sport.builder()
                .sportName(request.getSportName())
                .description(request.getDescription())
                .build();

        return toResponse(sportRepository.save(sport));
    }

    @Override
    public SportResponse updateSport(Long id, SportRequest request) {

        Sport sport = sportRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy sport"));

        sport.setSportName(request.getSportName());
        sport.setDescription(request.getDescription());

        return toResponse(sportRepository.save(sport));
    }

    @Override
    public SportResponse getSportById(Long id){
        Sport sport = sportRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy sport"));
        return toResponse(sport);
    }

    @Override
    public void deleteSport(Long id) {

        Sport sport = sportRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy sport"));

        // Nếu sport đang được product sử dụng thì không cho xoá
        if (sport.getProducts() != null && !sport.getProducts().isEmpty()) {
            throw new RuntimeException("Không thể xoá sport đang được sử dụng");
        }

        sportRepository.delete(sport);
    }

    private SportResponse toResponse(Sport sport) {
        return SportResponse.builder()
                .id(sport.getId())
                .sportName(sport.getSportName())
                .description(sport.getDescription())
                .build();
    }
}
