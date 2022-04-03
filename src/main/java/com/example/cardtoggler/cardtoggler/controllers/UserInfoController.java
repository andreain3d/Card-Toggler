package com.example.cardtoggler.cardtoggler.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.RestTemplate;

@RestController
public class UserInfoController {

    @Value("${api.key}")
    private String apiKey;

    public String userInfo;

    @Autowired
    RestTemplate restTemplate;

    @Autowired
    HttpHeaders reqHeaders;

    @GetMapping(value = "/userInfo/{userId}")
    @ResponseBody
    public String userInfo(@PathVariable String userId) {
        String url = "https://anypoint.mulesoft.com/mocking/api/v1/links/2107a7ca-f0f9-4894-93f3-a6f18e9c9f63/cardInfo/" + userId;
        reqHeaders.set("API-Key", apiKey);
        HttpEntity<String> request = new HttpEntity<String>(reqHeaders);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);
        return response.getBody();
    }

}
