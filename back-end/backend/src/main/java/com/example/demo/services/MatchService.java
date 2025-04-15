package com.example.demo.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.MatchDto;
import com.example.demo.dto.PlayerStatsDto;
import com.example.demo.dto.TeamDto;
import com.example.demo.models.Match;
import com.example.demo.models.Team;
import com.example.demo.repos.MatchRepo;

@Service
public class MatchService {

	@Autowired
	private MatchRepo matchRepo;
	
	@Autowired
	private PlayerStatsService playerStatsService;
	
	
	public List<Match> getAllMatches(){
		return matchRepo.findAll();
	}
	
	public Match getMatchById(int id) {
		Optional<Match> res = matchRepo.findById(id);
		if(res.isPresent()) {
			return res.get();
		}else {
			return null;
		}
	}
	
	public boolean deleteMatch(int id) {
		Optional<Match> res = matchRepo.findById(id);
		if(res.isEmpty()) {
			return false;
		}else {
			matchRepo.deleteById(id);
			return true;
		}
	}
	
	public void addMatch(Match match){
		matchRepo.save(match);
	}
	
	public boolean editMatch(Match match){
		Optional<Match> found = matchRepo.findById(match.getId());
		if(found.isEmpty()) {
			return false;
		}else {
			matchRepo.save(match);
			return true;
		}	
	}
	
	public void saveMatch(MatchDto matchDto) {
	    Match match = new Match();
	    match.setElapsedTime(matchDto.getElapsedTime());
	    match.setTeam1Score(matchDto.getTeam1Score());
	    match.setTeam2Score(matchDto.getTeam2Score());

	    List<Team> teams = new ArrayList<>();

	    for (TeamDto t1 : matchDto.getPlayers().getTeam1()) {
	        Team team = new Team();
	        team.setName(t1.getName());
	        team.setPosition(t1.getPosition());
	        team.setScores(t1.getScores());
	        team.setTeamSide("team1");
	        teams.add(team);
	        
	        PlayerStatsDto playerStatsDto = new PlayerStatsDto();
	        playerStatsDto.setName(t1.getName());
	        playerStatsDto.setScores(t1.getScores());
	        if(match.getTeam1Score()>match.getTeam2Score()) {
	        	playerStatsDto.setWinner(true);
	        }
	        playerStatsService.handlePlayerUpdates(playerStatsDto);
	        
	    }

	    for (TeamDto t2 : matchDto.getPlayers().getTeam2()) {
	        Team team = new Team();
	        team.setName(t2.getName());
	        team.setPosition(t2.getPosition());
	        team.setScores(t2.getScores());
	        team.setTeamSide("team2");
	        teams.add(team);
	        
	        PlayerStatsDto playerStatsDto = new PlayerStatsDto();
	        playerStatsDto.setName(t2.getName());
	        playerStatsDto.setScores(t2.getScores());
	        if(match.getTeam1Score()<match.getTeam2Score()) {
	        	playerStatsDto.setWinner(true);
	        }
	        playerStatsService.handlePlayerUpdates(playerStatsDto);
	    }

	    match.setTeams(teams);

	    matchRepo.save(match);
	}
}
