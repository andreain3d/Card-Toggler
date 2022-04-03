package com.example.cardtoggler.cardtoggler.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

@RestController
public class OnOffController {

    @Value("${api.key}")
    private String apiKey;

    public String onOff;

    @Autowired
    RestTemplate restTemplate;

    @Autowired
    HttpHeaders reqHeaders;

    @PostMapping("/onoff/{cardId}")
    @ResponseBody
    public String onOff(@PathVariable String cardId, @RequestBody String cardActiveData) {
        String url = "https://anypoint.mulesoft.com/mocking/api/v1/links/2107a7ca-f0f9-4894-93f3-a6f18e9c9f63/cardcontrols/onoff/" + cardId;
        reqHeaders.set("API-Key", apiKey);
        HttpEntity<String> request = new HttpEntity<String>(cardActiveData, reqHeaders);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
        return response.getBody();
    }
}
