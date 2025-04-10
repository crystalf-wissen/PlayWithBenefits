package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.models.Player;
import com.example.demo.services.PlayerService;

@RestController(value = "/players")
public class PlayerController {
	
	@Autowired
	private PlayerService playerService;

	@PostMapping(path = "/add-player")
	public void addPlayer(@RequestBody Player player) {
		playerService.addPlayer(player);
	}
}
