package com.gss.inventory.inventory.domain.exception;

public class ImageNotFoundException extends RuntimeException {
    public ImageNotFoundException(Long imageId) {
        super("Fotografija nije pronađena: " + imageId);
    }
}
