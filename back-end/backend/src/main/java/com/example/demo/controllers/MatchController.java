package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.MatchDto;
import com.example.demo.models.Match;
import com.example.demo.services.MatchService;

@RestController()
@CrossOrigin("*")
public class MatchController {
	
	@Autowired
	private MatchService matchService;
	
	
	@GetMapping(path="/allMatches")
	public List<Match> getAllMatches(){
		return matchService.getAllMatches();
	}
	
	@GetMapping(path="/match/{id}")
	public Match getMatchById(@PathVariable int id){
		Match match = matchService.getMatchById(id);
		if(match!=null) return match;
		else return null;
	}
	
	@PostMapping(path="/addMatch")
	public ResponseEntity<String> addMatch(@RequestBody Match match){
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
	
	@PostMapping(path="/submit")
	public ResponseEntity<String> saveMatch(@RequestBody MatchDto matchDto){
		matchService.saveMatch(matchDto);
		return new ResponseEntity<>("Match Saved",HttpStatus.OK);
	}
	
	@DeleteMapping(path="/remove/{id}")
	public ResponseEntity<String> deleteMatch(@PathVariable int id){
		if(matchService.deleteMatch(id)) {
			return new ResponseEntity<>("Match Deleted",HttpStatus.OK);
		}else {
			return new ResponseEntity<>("Match Could Not Be Deleted",HttpStatus.BAD_REQUEST);
		}
		
	}
}
