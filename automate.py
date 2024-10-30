import schedule
import time
import yaml
import requests

def load_config():
    with open('config.yml', 'r') as file:
        return yaml.safe_load(file)

def fetch_trending_keywords():
    response = requests.get('https://api.example.com/trending-keywords')
    if response.status_code == 200:
        return response.json().get('keywords', [])
    return []

def update_sitemap(keywords):
    sitemap_content = ["https://scripters.shop/"]
    for keyword in keywords:
        sitemap_content.append(f"https://scripters.shop/{keyword.replace(' ', '-')}/")
    
    with open('sitemap.xml', 'w') as file:
        file.write("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap-image/1.1\">\n")
        for url in sitemap_content:
            file.write(f"  <url>\n    <loc>{url}</loc>\n  </url>\n")
        file.write("</urlset>")

def daily_job():
    config = load_config()
    if config['tasks']['keyword_tracking']['enabled']:
        keywords = fetch_trending_keywords()
        update_sitemap(keywords)

def main():
    config = load_config()
    if config['tasks']['keyword_tracking']['enabled']:
        schedule.every().day.at("10:00").do(daily_job)

    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == "__main__":
    main()
