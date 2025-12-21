#!/bin/bash

echo "🎓 CampusSpace - NJIT Real Data Setup"
echo "======================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ Created .env file"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🔐 To enable real NJIT data, edit .env and add your credentials:"
echo ""
echo "   nano .env"
echo ""
echo "   Then set:"
echo "   NJIT_USERNAME=your_ucid"
echo "   NJIT_PASSWORD=your_password"
echo ""
echo "----------------------------------------"
echo ""
echo "📦 Installing required packages..."
npm install dotenv csv-parser

echo ""
echo "🔧 Optional: Install Puppeteer for automated scraping"
echo "   (This downloads a Chrome browser, ~300MB)"
echo ""
read -p "Install Puppeteer for automatic NJIT login? (y/N): " install_puppeteer

if [[ $install_puppeteer =~ ^[Yy]$ ]]; then
    echo "📥 Installing Puppeteer..."
    npm install puppeteer
    if [ $? -eq 0 ]; then
        echo "✅ Puppeteer installed successfully!"
    else
        echo "⚠️  Puppeteer installation failed. You can:"
        echo "   - Use CSV upload instead (no automation needed)"
        echo "   - Try: export PUPPETEER_SKIP_DOWNLOAD=true && npm install puppeteer-core"
    fi
else
    echo "⏭️  Skipping Puppeteer. You can use CSV upload for data."
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Edit .env with your NJIT credentials (or skip for sample data)"
echo "   2. Run: npm start"
echo "   3. Visit: http://localhost:3000"
echo ""
echo "📚 For more info, see docs/REAL-DATA-SETUP.md"
