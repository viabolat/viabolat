from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as ec
from webdriver_manager.chrome import ChromeDriverManager
from urllib.parse import unquote, urlparse
import pandas as pd
import time

# Setup Chrome options
options = Options()
options.headless = False  # Keep visible
options.add_argument("--start-maximized")
options.add_argument("--disable-blink-features=AutomationControlled")
options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

# Launch browser
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# Remove navigator.webdriver flag
driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
    "source": "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
})

# Load Yelp search
driver.get("https://www.yelp.com/search?find_desc=Roofing&find_loc=Miami%2C+FL")

# Solve CAPTCHA manually if shown
input("⏳ Solve the CAPTCHA if needed, then press Enter to continue...")

# Wait until business links appear
WebDriverWait(driver, 20).until(
    ec.presence_of_element_located((By.CSS_SELECTOR, 'a[href^="/biz/"]'))
)

# Scroll to trigger lazy loading
driver.execute_script("window.scrollTo(0, document.body.scrollHeight * 0.5);")
time.sleep(2)
driver.execute_script("window.scrollTo(0, 0);")
time.sleep(2)

# Collect business links
biz_links = []
cards = driver.find_elements(By.CSS_SELECTOR, 'a[href^="/biz/"]')
for a in cards:
    href = a.get_attribute("href")
    if "/adredir?" not in href and href.startswith("https://www.yelp.com/biz/") and href not in biz_links:
        biz_links.append(href)

print(f"🔗 Found {len(biz_links)} business links")

# Visit each business page
leads = []

for link in biz_links:
    try:
        driver.get(link)
        time.sleep(3)

        name = driver.find_element(By.TAG_NAME, "h1").text.strip()

        try:
            phone = driver.find_element(By.XPATH, '//p[text()="Phone number"]/following-sibling::p').text.strip()
        except:
            phone = "N/A"

        try:
            website_link = driver.find_element(By.XPATH, '//p[text()="Business website"]/following-sibling::p/a')
            raw_url = website_link.get_attribute("href")
            redirect_url = unquote(raw_url.split("url=")[1].split("&")[0])
            website = urlparse(redirect_url).netloc
        except:
            website = "N/A"

        categories = [el.text.lower() for el in driver.find_elements(By.CSS_SELECTOR, '[data-font-weight="semibold"]')]
        if not any("roof" in c for c in categories):
            continue  # Skip non-roofing businesses

        leads.append({
            "Business Name": name,
            "Phone": phone,
            "Website": website,
            "Yelp URL": link
        })

    except Exception as e:
        print(f"❌ Error at {link}: {e}")

# Save to CSV
df = pd.DataFrame(leads)
df.to_csv("roofing_leads.csv", index=False)
print(f"\n✅ Saved {len(leads)} roofing leads to 'roofing_leads.csv'")
print(df.head())

driver.quit()
