import requests
from bs4 import BeautifulSoup
from bs4.element import Tag
from urllib.parse import urlparse
import re

# Allowed Wikipedia domains
WIKI_DOMAINS = ("wikipedia.org", "m.wikipedia.org")


def _is_wikipedia_url(url: str) -> bool:
    """Check if the URL belongs to Wikipedia."""
    try:
        parsed = urlparse(url)
        return any(domain in parsed.netloc for domain in WIKI_DOMAINS)
    except Exception:
        return False


def _clean_soup(soup: BeautifulSoup) -> None:
    """Remove unnecessary tags such as tables, reference markers, edit links."""
    # Remove tables (infobox, nav templates)
    for table in soup.find_all("table"):
        table.decompose()

    # Remove reference superscripts [1], [2], etc.
    for sup in soup.find_all("sup"):
        sup.decompose()

    # Remove edit links
    for span in soup.select(".mw-editsection"):
        span.decompose()

    # Remove entire References section
    ref_head = soup.find(id="References") or soup.find(id="References_and_notes")
    if ref_head:
        parent = ref_head.find_parent()
        if parent:
            parent.decompose()


def _get_text_from_content(content_div: Tag) -> str:
    """Extract clean readable text from Wikipedia content area."""
    paragraphs: list[str] = []

    for elem in content_div.find_all(["p", "h2", "h3", "h4", "li"]):
        text = elem.get_text(separator=" ", strip=True)

        if not text:
            continue

        # Remove citation patterns like [1], [23]
        text = re.sub(r"\[\d+\]", "", text)

        paragraphs.append(text)

    return "\n\n".join(paragraphs)


def scrape_wikipedia(url: str):
    """Fetch and clean main article text & title from Wikipedia."""
    if not _is_wikipedia_url(url):
        raise ValueError(f"Invalid Wikipedia URL: {url}")

    # Add browser headers to avoid 403 Forbidden
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0 Safari/537.36"
        )
    }

    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    # Extract title
    title_tag = soup.find(id="firstHeading") or soup.find("h1")
    title = title_tag.get_text(strip=True) if title_tag else "Untitled"

    # Locate main content area
    content = soup.find(id="mw-content-text") or soup.find(class_="mw-parser-output")

    if content is None:
        content = soup.find("article") or soup.find("body")

    # Clean and extract text
    cleaned_html = BeautifulSoup(str(content), "html.parser")
    _clean_soup(cleaned_html)

    cleaned_text = _get_text_from_content(cleaned_html)

    return title, cleaned_text


def parse_wikipedia_html(html: str):
    """Offline version for local testing without internet."""
    soup = BeautifulSoup(html, "html.parser")

    title_tag = soup.find(id="firstHeading") or soup.find("h1")
    title = title_tag.get_text(strip=True) if title_tag else "Untitled"

    content = (
        soup.find(id="mw-content-text")
        or soup.find(class_="mw-parser-output")
        or soup.find("article")
        or soup.find("body")
    )

    cleaned_html = BeautifulSoup(str(content), "html.parser")
    _clean_soup(cleaned_html)

    cleaned_text = _get_text_from_content(cleaned_html)

    return title, cleaned_text


if __name__ == "__main__":
    # Local test
    sample_html = """
    <html><body>
        <h1 id="firstHeading">Sample Article</h1>
        <div id="mw-content-text">
            <p>First paragraph [1]</p>
            <p>Second paragraph <sup>[2]</sup></p>
            <h2>History</h2>
            <p>History paragraph</p>
        </div>
    </body></html>
    """

    title, text = parse_wikipedia_html(sample_html)
    print("TITLE:", title)
    print("CLEANED:", text)
