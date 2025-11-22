package com.ant.utils;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.extractor.WordExtractor;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Slf4j
public class DocumentExtractorUtil {

    /**
     * 从MultipartFile中提取文本内容
     * @param file 上传的文件
     * @return 提取的文本内容
     */
    public static String extractText(MultipartFile file) {
        try {
            String fileName = file.getOriginalFilename();
            if (fileName == null) {
                return "";
            }

            String fileExtension = getFileExtension(fileName).toLowerCase();

            switch (fileExtension) {
                case "pdf":
                    return extractPdfText(file);
                case "doc":
                    return extractDocText(file);
                case "docx":
                    return extractDocxText(file);
                default:
                    throw new IllegalArgumentException("不支持的文件格式: " + fileExtension);
            }
        } catch (Exception e) {
            log.error("提取文档内容时发生错误", e);
            return "";
        }
    }

    /**
     * 提取PDF文件文本内容
     * @param file PDF文件
     * @return 提取的文本内容
     */
    private static String extractPdfText(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream();
             PDDocument document = PDDocument.load(inputStream)) {

            PDFTextStripper pdfStripper = new PDFTextStripper();
            return pdfStripper.getText(document);
        } catch (IOException e) {
            log.error("提取PDF文本内容时发生错误", e);
            return "";
        }
    }

    /**
     * 提取DOC文件文本内容
     * @param file DOC文件
     * @return 提取的文本内容
     */
    private static String extractDocText(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream();
             HWPFDocument document = new HWPFDocument(inputStream);
             WordExtractor extractor = new WordExtractor(document)) {

            return extractor.getText();
        } catch (IOException e) {
            log.error("提取DOC文本内容时发生错误", e);
            return "";
        }
    }

    /**
     * 提取DOCX文件文本内容
     * @param file DOCX文件
     * @return 提取的文本内容
     */
    private static String extractDocxText(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream();
             XWPFDocument document = new XWPFDocument(inputStream);
             XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {

            return extractor.getText();
        } catch (IOException e) {
            log.error("提取DOCX文本内容时发生错误", e);
            return "";
        }
    }

    /**
     * 获取文件扩展名
     * @param fileName 文件名
     * @return 文件扩展名
     */
    private static String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex > 0 && lastDotIndex < fileName.length() - 1) {
            return fileName.substring(lastDotIndex + 1);
        }
        return "";
    }
}
