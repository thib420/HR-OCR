#!/usr/bin/env python3
"""
Mistral AI OCR Script for CV Text Extraction
"""

import sys
import json
import os
from pathlib import Path
from mistralai import Mistral, DocumentURLChunk
from mistralai.models import OCRResponse


def extract_text_from_pdf(pdf_path: str, api_key: str) -> dict:
    """
    Extract text from PDF using Mistral AI OCR
    
    Args:
        pdf_path: Path to the PDF file
        api_key: Mistral AI API key
        
    Returns:
        Dictionary containing extracted text and status
    """
    try:
        # Initialize Mistral client
        client = Mistral(api_key)
        
        # Verify PDF file exists
        pdf_file = Path(pdf_path)
        if not pdf_file.is_file():
            return {
                "success": False,
                "error": f"PDF file not found: {pdf_path}"
            }
        
        # Upload PDF file to Mistral's OCR service
        uploaded_file = client.files.upload(
            file={
                "file_name": pdf_file.stem,
                "content": pdf_file.read_bytes(),
            },
            purpose="ocr",
        )
        
        # Get URL for the uploaded file
        signed_url = client.files.get_signed_url(file_id=uploaded_file.id, expiry=1)
        
        # Process PDF with OCR
        pdf_response = client.ocr.process(
            document=DocumentURLChunk(document_url=signed_url.url),
            model="mistral-ocr-latest",
            include_image_base64=False  # We only need text for anonymization
        )
        
        # Extract text from all pages
        extracted_text = get_combined_text(pdf_response)
        
        # Clean up uploaded file (optional)
        try:
            client.files.delete(file_id=uploaded_file.id)
        except:
            pass  # Ignore cleanup errors
        
        return {
            "success": True,
            "extracted_text": extracted_text,
            "pages_count": len(pdf_response.pages)
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def get_combined_text(ocr_response: OCRResponse) -> str:
    """
    Combine text from all pages into a single string
    
    Args:
        ocr_response: Response from OCR processing
        
    Returns:
        Combined text from all pages
    """
    text_parts = []
    
    for page in ocr_response.pages:
        # Extract text from markdown, removing image references
        page_text = page.markdown
        
        # Remove markdown image syntax
        import re
        page_text = re.sub(r'!\[.*?\]\(.*?\)', '', page_text)
        
        # Clean up extra whitespace
        page_text = re.sub(r'\n\s*\n', '\n\n', page_text)
        page_text = page_text.strip()
        
        if page_text:
            text_parts.append(page_text)
    
    return '\n\n'.join(text_parts)


def main():
    """Main function to handle command line arguments"""
    if len(sys.argv) != 3:
        print(json.dumps({
            "success": False,
            "error": "Usage: python mistral_ocr.py <pdf_path> <api_key>"
        }))
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    api_key = sys.argv[2]
    
    result = extract_text_from_pdf(pdf_path, api_key)
    print(json.dumps(result))


if __name__ == "__main__":
    main() 