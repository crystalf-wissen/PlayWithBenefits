package com.example.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.models.Player;
import com.example.demo.repos.PlayerRepo;

@Service
public class PlayerService {
	
	@Autowired
	private PlayerRepo playerRepo;
	
	public void addPlayer(Player player) {
		playerRepo.save(player);
		
	}
}
