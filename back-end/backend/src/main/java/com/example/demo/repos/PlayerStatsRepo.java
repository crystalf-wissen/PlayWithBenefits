package com.example.demo.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.models.PlayerStats;

@Repository
public interface PlayerStatsRepo extends JpaRepository<PlayerStats, Integer> {
	
	PlayerStats findByName(String name);

}
