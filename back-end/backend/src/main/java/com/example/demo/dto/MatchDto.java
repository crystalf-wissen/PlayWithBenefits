package com.example.demo.dto;

public class MatchDto {

	private int elapsedTime;
	
	private int team1Score;
	
	private int team2Score;
	
	private PlayersDto players;

	public int getElapsedTime() {
		return elapsedTime;
	}

	public void setElapsedTime(int elapsedTime) {
		this.elapsedTime = elapsedTime;
	}

	public int getTeam1Score() {
		return team1Score;
	}

	public void setTeam1Score(int team1Score) {
		this.team1Score = team1Score;
	}

	public int getTeam2Score() {
		return team2Score;
	}

	public void setTeam2Score(int team2Score) {
		this.team2Score = team2Score;
	}

	public PlayersDto getPlayers() {
		return players;
	}

	public void setPlayers(PlayersDto players) {
		this.players = players;
	}

	@Override
	public String toString() {
		return "MatchDto [elapsedTime=" + elapsedTime + ", team1Score=" + team1Score + ", team2Score=" + team2Score
				+ ", players=" + players + "]";
	}
	
	
}
