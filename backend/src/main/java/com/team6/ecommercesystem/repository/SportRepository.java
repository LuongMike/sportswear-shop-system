package com.team6.ecommercesystem.repository;

import com.team6.ecommercesystem.model.Sport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SportRepository extends JpaRepository<Sport, Long> {

    @Query("SELECT s.id FROM Sport s WHERE s.sportName = :sportName")
    Long findIdBySportName(@Param("sportName") String sportName);

    boolean existsBySportName(String sportName);
}
