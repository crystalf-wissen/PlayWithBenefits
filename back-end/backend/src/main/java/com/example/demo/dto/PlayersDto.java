package com.example.demo.dto;

import java.util.List;

public class PlayersDto {
	
	private List<TeamDto> team1;
	
	private List<TeamDto> team2;

	public List<TeamDto> getTeam1() {
		return team1;
	}

	public void setTeam1(List<TeamDto> team1) {
		this.team1 = team1;
	}

	public List<TeamDto> getTeam2() {
		return team2;
	}

	public void setTeam2(List<TeamDto> team2) {
		this.team2 = team2;
	}

}
