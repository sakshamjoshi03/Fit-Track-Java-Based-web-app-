package com.fittrack.exception;

public class ApiKeyMissingException extends RuntimeException {

    private final String serviceName;

    public ApiKeyMissingException(String serviceName) {
        super("API key not configured for service: " + serviceName);
        this.serviceName = serviceName;
    }

    public String getServiceName() {
        return serviceName;
    }
}
