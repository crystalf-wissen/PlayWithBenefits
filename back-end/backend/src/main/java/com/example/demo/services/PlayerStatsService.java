package com.example.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.PlayerStatsDto;
import com.example.demo.models.PlayerStats;
import com.example.demo.repos.PlayerStatsRepo;

@Service
public class PlayerStatsService {

	@Autowired
	private PlayerStatsRepo playerStatsRepo;
	
	public void handlePlayerUpdates(PlayerStatsDto playerStatsDto) {
	    PlayerStats player = playerStatsRepo.findByName(playerStatsDto.getName());

	    if (player != null) {
	        player.setGoals(player.getGoals() + playerStatsDto.getScores());
	        player.setMatches(player.getMatches() + 1);
	        if(playerStatsDto.isWinner()) {
	        	player.setWins(player.getWins()+1);
	        }else {
	        	player.setLosses(player.getLosses()+1);
	        }
	        playerStatsRepo.save(player); 
	        System.out.println("Player updated");
	    } else {
	    	PlayerStats newPlayer = new PlayerStats();
	        newPlayer.setName(playerStatsDto.getName());
	        newPlayer.setGoals(playerStatsDto.getScores());
	        newPlayer.setMatches(1);
	        if(playerStatsDto.isWinner()) {
	        	newPlayer.setWins(1);
	        }else {
	        	newPlayer.setLosses(1);
	        }
	        playerStatsRepo.save(newPlayer);
	        System.out.println("New player created and saved");
	        
	    }
	}

}
