package com.example.demo.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.models.Match;

@Repository
public interface MatchRepo extends JpaRepository<Match, Integer>{

	
}
