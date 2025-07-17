import requests
import time

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://generativelanguage.googleapis.com/v1beta"

# Static model fallback order
MODEL_CHAIN = [
    "models/gemini-2.5-flash",
    "models/gemini-2.5-pro",
    "models/gemini-2.0-flash",
    "models/gemini-1.5-flash",
    "models/gemini-1.5-pro",
]


def call_gemini(text, retries=3):
    headers = {"Content-Type": "application/json"}
    payload = {"contents": [{"parts": [{"text": text}]}]}

    for model in MODEL_CHAIN:
        url = f"{BASE_URL}/{model}:generateContent?key={API_KEY}"
        print(f"\n➡️ Trying: {model}")
        for attempt in range(retries):
            response = requests.post(url, headers=headers, json=payload)
            if response.status_code == 200:
                print(f"✅ Success with {model}")
                return response.json()

            if response.status_code == 429:
                try:
                    retry_info = response.json()fu
                    retry_delay = 10  # default
                    for detail in retry_info["error"].get("details", []):
                        if (
                            detail.get("@type")
                            == "type.googleapis.com/google.rpc.RetryInfo"
                        ):
                            retry_delay = int(
                                detail.get("retryDelay", "10s").replace("s", "")
                            )
                            break
                    print(
                        f"⚠️ Quota hit on {model}, retrying in {retry_delay}s (attempt {attempt+1})..."
                    )
                    time.sleep(retry_delay)
                    continue
                except Exception as e:
                    print(f"⚠️ Retry parse failed: {e}. Sleeping 10s.")
                    time.sleep(10)
                    continue

            print(f"❌ Error {response.status_code} on {model}: {response.text}")
            break  # Break inner loop, try next model

        print(f"🔁 Giving up on {model} after {retries} attempts.")

    raise Exception("❌ All fallback models exhausted or quota blocked.")


# 🔍 Example Usage
result = call_gemini(
    "Explain the difference between CPU and GPU in plain English.", retries=2
)
print(result)
