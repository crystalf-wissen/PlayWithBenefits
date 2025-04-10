package com.example.demo.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Player;

public interface PlayerRepo extends JpaRepository<Player, Integer>{

}
