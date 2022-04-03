package com.example.cardtoggler.cardtoggler.utils;

import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

@Component
public class Headers {
    @Bean
    public HttpHeaders reqHeaders() {
        return new HttpHeaders();
    }
}
