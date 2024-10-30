import requests
import datetime
import os

# Configuration: API key, search queries, and HTML paths
API_KEY = "fe040f1fb3mshc7621fdd3e3041cp19c4f1jsn77a8c4c5615c"
SEARCH_QUERIES = [
    "Crypto wallet security", 
    "Blockchain tools", 
    "Web3 integration solutions", 
    "Flash USDT", 
    "Flash Bitcoin",
    "NFT marketplace solutions",
    "Ethereum scaling solutions",
    "Decentralized finance applications",
    "Smart contracts explained",
    "Cryptocurrency trading tips"
]
RESULT_LIMIT = 5
HTML_FILE_PATH = "index.html"
PAGES_DIR = "generated_pages"
SITEMAP_FILE_PATH = "sitemap.xml"
ROBOTS_FILE_PATH = "robots.txt"

# Function to retrieve SEO data using the RapidAPI Google Search API
def get_seo_data(query):
    url = "https://google-search74.p.rapidapi.com/"
    headers = {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": "google-search74.p.rapidapi.com"
    }
    params = {"query": query, "limit": str(RESULT_LIMIT), "related_keywords": "true"}
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching data for query '{query}': {response.status_code}")
        return None

# Function to extract and format SEO data
def generate_seo_metadata(query):
    seo_data = get_seo_data(query)
    if not seo_data:
        return None

    # Extract descriptions and keywords
    meta_description = ""
    meta_keywords = set()
    results_content = []
    for result in seo_data.get("results", []):
        description = result.get('description', '')
        meta_description += f"{description} "
        meta_keywords.update(result.get("related_keywords", []))
        results_content.append(description)

    # Combine additional keywords for better SEO
    additional_keywords = [
        "cryptocurrency", "blockchain", "decentralized finance",
        "digital assets", "USDT", "Bitcoin", "NFT", "Ethereum",
        "crypto trading", "investment strategies", "crypto security"
    ]
    meta_keywords.update(additional_keywords)

    return {
        "description": meta_description.strip()[:160],
        "keywords": ", ".join(list(meta_keywords)),
        "og_title": f"Learn about {query}",
        "og_description": meta_description.strip()[:200],
        "twitter_card": "summary_large_image",
        "content": results_content  # For dynamic page content
    }

# Function to update main HTML file with links to new pages
def update_main_html(pages):
    links = "\n".join([f'<li><a href="{page}">{page.replace(".html", "").replace("_", " ").title()}</a></li>' for page in pages])
    index_content = f"""
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="robots" content="index, follow">
        <title>Dynamic SEO Page</title>
        <link rel="stylesheet" href="styles.css">  <!-- Link to an external stylesheet -->
    </head>
    <body>
        <h1>Explore Topics</h1>
        <ul>{links}</ul>
    </body>
    </html>
    """
    with open(HTML_FILE_PATH, "w") as f:
        f.write(index_content)

# Function to create a new SEO-optimized HTML page for each query
def create_seo_page(query, metadata):
    page_name = f"{query.lower().replace(' ', '_')}.html"
    page_path = os.path.join(PAGES_DIR, page_name)

    # Open Graph and Twitter metadata
    og_tags = f"""
    <meta property="og:title" content="{metadata['og_title']}">
    <meta property="og:description" content="{metadata['og_description']}">
    <meta property="og:type" content="article">
    <meta name="twitter:card" content="{metadata['twitter_card']}">
    """
    meta_tags = f"""
    <meta name="description" content="{metadata['description']}">
    <meta name="keywords" content="{metadata['keywords']}">
    <link rel="canonical" href="http://yourdomain.com/{page_name}">  <!-- Add canonical tag -->
    """

    # Dynamic content for the page
    page_content = "<h2>Key Insights</h2>"
    page_content += "".join([f"<p>{content}</p>" for content in metadata["content"]])
    page_content += "<h3>Related Topics</h3><ul>"
    for keyword in metadata["keywords"].split(", "):
        page_content += f"<li>{keyword}</li>"
    page_content += "</ul>"

    # Write the HTML file
    with open(page_path, "w") as file:
        file.write(f"""
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{metadata['og_title']}</title>
            {meta_tags}
            {og_tags}
        </head>
        <body>
            <h1>{metadata['og_title']}</h1>
            {page_content}
        </body>
        </html>
        """)
    print(f"Generated page: {page_path}")
    return page_name

# Function to generate a sitemap.xml file
def generate_sitemap(pages):
    sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap-image/1.1">\n'
    for page in pages:
        sitemap_content += f'  <url>\n    <loc>http://yourdomain.com/{page}</loc>\n  </url>\n'
    sitemap_content += '</urlset>'
    
    with open(SITEMAP_FILE_PATH, "w") as f:
        f.write(sitemap_content)
    print(f"Sitemap generated: {SITEMAP_FILE_PATH}")

# Function to generate a robots.txt file
def generate_robots_txt():
    robots_content = "User-agent: *\nDisallow: /generated_pages/\nAllow: /\n"
    with open(ROBOTS_FILE_PATH, "w") as f:
        f.write(robots_content)
    print(f"Robots.txt generated: {ROBOTS_FILE_PATH}")

# Main function to create SEO metadata, generate pages, update index.html, and generate sitemap and robots.txt
def auto_update():
    if not os.path.exists(PAGES_DIR):
        os.makedirs(PAGES_DIR)

    # Track generated pages
    generated_pages = []

    for query in SEARCH_QUERIES:
        metadata = generate_seo_metadata(query)
        if metadata:
            page_name = create_seo_page(query, metadata)
            generated_pages.append(page_name)

    # Update main index.html with links to generated pages
    update_main_html(generated_pages)

    # Generate sitemap and robots.txt
    generate_sitemap(generated_pages)
    generate_robots_txt()

    print(f"SEO update complete: {datetime.datetime.now()}")

# Run the update script
if __name__ == "__main__":
    auto_update()
