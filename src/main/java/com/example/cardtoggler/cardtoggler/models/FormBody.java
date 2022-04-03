package com.example.cardtoggler.cardtoggler.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FormBody {

    private String cardId;
    private String cardStatus;
    private String comment;

}
