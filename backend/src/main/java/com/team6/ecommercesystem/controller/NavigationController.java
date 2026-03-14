package com.team6.ecommercesystem.controller;

import com.team6.ecommercesystem.dto.response.NavigationCategoryDTO;
import com.team6.ecommercesystem.service.NavigationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/navigation")
@RequiredArgsConstructor
public class NavigationController {

    private final NavigationService navigationService;

    @GetMapping("/main")
    public List<NavigationCategoryDTO> getMainNavigation() {
        return navigationService.getMainNavigation();
    }
}