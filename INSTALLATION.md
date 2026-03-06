# 🚀 Installation Guide

## Prerequisites
- Python 3.8+
- pip package manager
- Internet connection

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Setup API Key
```bash
mkdir -p .streamlit
cp secrets_template.toml .streamlit/secrets.toml
```

Edit `.streamlit/secrets.toml` and add:
```toml
GEMINI_API_KEY = "your-key-from-makersuite.google.com"
```

Get free key: https://makersuite.google.com/app/apikey

### 3. Run Application
```bash
streamlit run app.py
```

Visit: http://localhost:8501

## Verify Installation
```bash
python test_simulation.py
```

Should show: **✅ TOTAL: 15/15 tests passed (100%)**

## Troubleshooting

**"ModuleNotFoundError"**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**"No games found"**
- Check internet connection
- Verify date range
- Check sport selection

**"GEMINI_API_KEY error"**
- Get key from: https://makersuite.google.com/app/apikey
- Make sure `.streamlit/secrets.toml` exists
- API key must be valid

## Support
Check README.md for full documentation
