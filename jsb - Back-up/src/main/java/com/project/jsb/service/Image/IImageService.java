package com.project.jsb.service.Image;

import com.project.jsb.dto.ImageDto;
import com.project.jsb.model.Image;
import org.springframework.web.multipart.MultipartFile;

public interface IImageService {
    Image getImageById(Long imageId);

    void deleteImageById(Long imageId);

    ImageDto saveImage(MultipartFile file , Long userId);

    void updateImage(MultipartFile file , Long imageId);
}
