package com.example.cardtoggler.cardtoggler.utils;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class Rest {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
