package com.example.disaster_live_alerts.exceptions;

public class NoSuchUserExistsException extends RuntimeException{
    public NoSuchUserExistsException(String message) {
        super(message);
    }

}
