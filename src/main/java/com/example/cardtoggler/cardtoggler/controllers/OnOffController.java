package com.example.cardtoggler.cardtoggler.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.client.RestTemplate;

@RestController
public class OnOffController {

    @Value("${api.key}")
    private String apiKey;

    public String onOff;

    @PostMapping("/onoff")
    public String onOff() {
        String url = "https://anypoint.mulesoft.com/mocking/api/v1/links/2107a7ca-f0f9-4894-93f3-a6f18e9c9f63/cardcontrols/onoff/0001";
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("API-Key", apiKey);
        String body = "";
        HttpEntity<String> request = new HttpEntity<String>(body, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
        if (response.getStatusCode() == HttpStatus.OK) {
            System.out.println("Request Successful.");
            System.out.println(response.getBody());
        } else {
            System.out.println(response.getStatusCode());
        }
        return response.getBody();
    }
}
