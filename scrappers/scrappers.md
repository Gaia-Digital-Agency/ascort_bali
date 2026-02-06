# Web Scraper Project

This project contains two Python web scraping scripts that use Selenium with `undetected-chromedriver` and `selenium-stealth` to extract information from websites while attempting to avoid bot detection.

## Project Structure

- `site_scrapper/`: A script to crawl entire websites and extract links.
- `page_scrapper/`: A script to scrape the full content of a single web page.
- `photos/`: Directory for storing images.

## Setup

1.  **Install Python:** Make sure you have Python 3 installed on your system.
2.  **Install Dependencies:** Navigate to the `site_scrapper` directory and install the required Python packages using `pip`:

    ```bash
    cd site_scrapper
    pip install -r requirements.txt
    ```

## Scrapers

### 1. Site Scrapper

This scraper crawls one or more websites listed in `site_scrapper/sites.json` and extracts all unique internal links. The results are saved in `site_scrapper/output.md`.

**Configuration:**

-   Add the websites you want to crawl to the `sites` array in `site_scrapper/sites.json`.

    ```json
    {
      "sites": [
        "https://example.com",
        "https://another-example.com"
      ]
    }
    ```

**Usage:**

1.  Navigate to the `site_scrapper` directory:

    ```bash
    cd site_scrapper
    ```

2.  Run the script:

    ```bash
    python scrape.py
    ```

3.  The output will be saved in `site_scrapper/output.md`.

### 2. Page Scrapper

This scraper extracts the title, all visible text, images, and links from a single web page specified in `page_scrapper/page.json`. The content is saved to `page_scrapper/page_output.md`.

**Configuration:**

-   Set the URL of the page you want to scrape in `page_scrapper/page.json`:

    ```json
    {
      "url": "https://example.com/some-page"
    }
    ```

**Usage:**

1.  Navigate to the `page_scrapper` directory:

    ```bash
    cd page_scrapper
    ```

2.  Run the script:

    ```bash
    python scrape_page.py
    ```

3.  The scraped content will be saved in `page_scrapper/page_output.md`.

## Disclaimer

This project is for educational purposes only. Please be responsible and respect the terms of service of the websites you scrape.
