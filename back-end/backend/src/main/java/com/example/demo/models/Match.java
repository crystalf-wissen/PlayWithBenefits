package com.example.demo.models;

import java.sql.Date;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Match {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int matchId;
	
	private Date date;
	
	private List<String> team1;
	
	private List<String> team2;
	
	private int score1;
	
	private int score2;
	

	
	public int getMatchId() {
		return matchId;
	}

	public void setMatchId(int matchId) {
		this.matchId = matchId;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public List<String> getTeam1() {
		return team1;
	}

	public void setTeam1(List<String> team1) {
		this.team1 = team1;
	}

	public List<String> getTeam2() {
		return team2;
	}

	public void setTeam2(List<String> team2) {
		this.team2 = team2;
	}

	public int getScore1() {
		return score1;
	}

	public void setScore1(int score1) {
		this.score1 = score1;
	}

	public int getScore2() {
		return score2;
	}

	public void setScore2(int score2) {
		this.score2 = score2;
	}
}
