package com.project.jsb.service.Image;

import com.project.jsb.dto.ImageDto;
import com.project.jsb.exception.ResourceNotFoundException;
import com.project.jsb.model.Image;
import com.project.jsb.repository.ImageRepository;
import com.project.jsb.service.User.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ImageService implements IImageService {

    @Autowired
    private final ImageRepository imageRepository;
    @Autowired
    private final IUserService userService;


    public ImageService(ImageRepository imageRepository, IUserService userService) {
        this.imageRepository = imageRepository;
        this.userService = userService;
    }

    @Override
    public Image getImageById(Long imageId) {
        return imageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("no image found" + imageId));
    }

    @Override
    public void deleteImageById(Long imageId) {
        imageRepository.findById(imageId)
                .ifPresentOrElse(imageRepository::delete,
                        () -> {
                            throw new ResourceNotFoundException("no image found" + imageId);
                        });
    }

    @Override
    public ImageDto saveImage(MultipartFile file, Long userId) {
        ImageDto imageDto = new ImageDto();

        try {
            Image image = new Image();
            image.setFilename(file.getOriginalFilename());
            image.setFiletype(file.getContentType());
            image.setImage(file.getBytes());
            image.setUser(userService.getUser(userId));

            imageRepository.save(image);
            String downloadUrl = "/api/v1/images/image/download/" + image.getId();
            image.setDownloadUrl(downloadUrl);
            Image savedImage = imageRepository.save(image);

            imageDto.setId(savedImage.getId());
            imageDto.setFileName(savedImage.getFilename());
            imageDto.setDownloadUrl(savedImage.getDownloadUrl());
        } catch (IOException e) {
            throw new RuntimeException(e.getMessage());
        }
        return imageDto;
    }

    @Override
    public void updateImage(MultipartFile file, Long imageId) {
        Image image = getImageById(imageId);

        try {
            image.setFilename(file.getOriginalFilename());
            image.setFiletype(file.getContentType());
            image.setImage(file.getBytes());
            imageRepository.save(image);
        } catch (IOException e) {
            throw new RuntimeException(e.getMessage());
        }
    }
}
