package com.example.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.demo.models.Match;
import com.example.demo.repos.MatchRepo;

@Service
public class MatchService {

	@Autowired
	private MatchRepo matchRepo;
	
	
	public List<Match> getAllMatches(){
		return matchRepo.findAll();
	}
	
	public void addMatch(Match match){
		matchRepo.save(match);
	}
	
	public boolean editMatch(Match match){
		Optional<Match> found = matchRepo.findById(match.getMatchId());
		if(found.isEmpty()) {
			return false;
		}else {
			matchRepo.save(match);
			return true;
		}
		
	}
}
