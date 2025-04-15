package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.models.PlayerStats;
import com.example.demo.repos.PlayerStatsRepo;

@RestController
@CrossOrigin
public class PlayerStatsController {
	
	@Autowired
	private PlayerStatsRepo playerStatsRepo;
	
	
	@GetMapping(path = "/playerStats")
	public List<PlayerStats> getPlayerStats(){
		return playerStatsRepo.findAll();
	}

}
