#!/usr/bin/env python3

import requests
from bs4 import BeautifulSoup
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time  # Added for delay to let the page load

def trim_text(text, max_lines=1, max_chars=150):
    """
    Trims text to a specific number of lines and characters.
    """
    lines = text.split('\n')
    trimmed_lines = lines[:max_lines]
    trimmed_text = '\n'.join(trimmed_lines)
    if len(trimmed_text) > max_chars:
        trimmed_text = trimmed_text[:max_chars] + '...'
    return trimmed_text

def scrape_website():
    """
    Scrapes the website for headlines using requests and BeautifulSoup for static content
    and Selenium for dynamic content.
    """
    try:
        # Load configuration settings from JSON files
        with open('config.json', 'r') as json_file:
            config = json.load(json_file)

        # Get the URL from the loaded URLs
        url = config['urls']['url_2']['url']
        print(f"Scraping URL: {url}")  # Debugging: Check if URL is correct

        # Make a GET request to the website
        headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0',
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')

        # Find the desired elements on the page using the specified CSS selector
        elements = soup.select(
            '#maincontent > div:nth-child(1) > '
            'div.region.region--primary > '
            'div.component.component--module.more-headlines > div > div.collection__elements.j-scrollElement h3 > a')

        if elements:
            print("Found static elements:")  # Debugging: Found elements
            for element in elements:
                title = element.text.strip()
                link = element['href']
                print(f"<a href='{link}'>{title}</a>")
        else:
            print("No static elements found using BeautifulSoup.")  # Debugging: No elements found

        # Initialize headless Selenium WebDriver
        chrome_options = Options()
        chrome_options.add_argument('--headless')  # Add this line for headless mode
        driver = webdriver.Chrome(options=chrome_options)  # You can use any WebDriver here

        # Navigate to the page
        driver.get(url)

        # Add delay to wait for the page to load
        time.sleep(5)  # Adjust sleep time based on how long the page takes to load

        # Find the desired elements using Selenium
        selenium_elements = driver.find_elements(By.CLASS_NAME, config['urls']['url_2']['text_data'])

        if selenium_elements:
            print("Found dynamic elements using Selenium:")  # Debugging: Found dynamic elements
            for selenium_element in selenium_elements:
                element_text = trim_text(selenium_element.text)
                element_link = selenium_element.find_element(By.TAG_NAME, 'a').get_attribute('href')
                print(f"<a href='{element_link}'>{element_text}</a>")
        else:
            print("No dynamic elements found using Selenium.")  # Debugging: No elements found

        # Close the WebDriver
        driver.quit()

    except requests.exceptions.RequestException as request_error:
        print(f'An error occurred during the requests operation: {request_error}')
    except Exception as error:
        print(f'An unexpected error occurred: {error}')

if __name__ == '__main__':
    scrape_website()
