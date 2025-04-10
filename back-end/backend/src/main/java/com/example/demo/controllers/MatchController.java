package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.models.Match;
import com.example.demo.services.MatchService;

@RestController()
@CrossOrigin("*")
public class MatchController {
	
	@Autowired
	private MatchService matchService;
	
	@Autowired
	private PlayerService matchService;
	
	
	@GetMapping(path="/allMatches")
	public List<Match> getAllMatches(){
		return matchService.getAllMatches();
	}
	
	@PostMapping(path="/addMatch")
	public ResponseEntity<String> getAllMatches(@RequestBody Match match){
		matchService.addMatch(match);
		return new ResponseEntity<>("Match added",HttpStatus.OK);
	}
	
	@PutMapping(path="/editMatch")
	public ResponseEntity<String> editMatch(@RequestBody Match match){
		if(matchService.editMatch(match)) {
			return new ResponseEntity<>("Match Edited",HttpStatus.OK);
		}else {
			return new ResponseEntity<>("Match Does Not Exists",HttpStatus.BAD_REQUEST);
		}
		
	}
	
	
	
}
