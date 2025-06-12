#!/bin/bash

# ===========================================
# Serenity AI Agent Environment Setup Script
# ===========================================

echo "🚀 Serenity AI Agent Environment Setup"
echo "======================================"

# Check if templates exist
if [ ! -f "env.development.template" ]; then
    echo "❌ Error: env.development.template not found"
    exit 1
fi

if [ ! -f "env.production.template" ]; then
    echo "❌ Error: env.production.template not found"
    exit 1
fi

# Create development environment
echo "📝 Creating development environment (.env)..."
if [ -f ".env" ]; then
    echo "⚠️  .env already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

cp env.development.template .env
echo "✅ Created .env from template"

# Create production environment
echo "📝 Creating production environment (.env.production)..."
if [ -f ".env.production" ]; then
    echo "⚠️  .env.production already exists. Backing up to .env.production.backup"
    cp .env.production .env.production.backup
fi

cp env.production.template .env.production
echo "✅ Created .env.production from template"

# Generate secure keys
echo "🔐 Generating secure keys..."

# Generate API key
API_KEY="dev_serenity_$(date +%s)_$(openssl rand -hex 8)"
echo "Generated API_KEY: $API_KEY"

# Generate secret key
SECRET_KEY=$(openssl rand -hex 32)
echo "Generated SECRET_KEY: ${SECRET_KEY:0:16}..."

# Update development environment
echo "🔧 Updating development environment..."
sed -i.bak "s/API_KEY=dev_serenity_12345/API_KEY=$API_KEY/" .env
sed -i.bak "s/SECRET_KEY=development_secret_key_minimum_32_characters_long/SECRET_KEY=$SECRET_KEY/" .env
rm .env.bak

echo "✅ Updated .env with generated keys"

# Prompt for OpenAI API key
echo ""
echo "🤖 OpenAI API Key Setup"
echo "====================="
echo "To enable AI chat functionality, you need an OpenAI API key."
echo "Get one from: https://platform.openai.com/api-keys"
echo ""
read -p "Enter your OpenAI API key (or press Enter to skip): " OPENAI_KEY

if [ ! -z "$OPENAI_KEY" ]; then
    sed -i.bak "s/OPENAI_API_KEY=sk-your-openai-api-key-here/OPENAI_API_KEY=$OPENAI_KEY/" .env
    rm .env.bak
    echo "✅ Updated OpenAI API key"
else
    echo "⚠️  Skipped OpenAI API key. AI chat will not work until configured."
fi

# Set file permissions
echo "🔒 Setting secure file permissions..."
chmod 600 .env .env.production
echo "✅ Set secure permissions (600) on environment files"

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p agency_profiles
echo "✅ Created logs and agency_profiles directories"

# Summary
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo "✅ Created .env (development)"
echo "✅ Created .env.production (production)" 
echo "✅ Generated secure API and secret keys"
if [ ! -z "$OPENAI_KEY" ]; then
    echo "✅ Configured OpenAI API key"
else
    echo "⚠️  OpenAI API key not configured"
fi
echo "✅ Set secure file permissions"
echo "✅ Created necessary directories"
echo ""
echo "📚 Next Steps:"
echo "1. Review and edit .env file if needed"
echo "2. Install dependencies: pip install -r requirements.txt"
echo "3. Start the API: python run_api.py"
echo "4. Test at: http://localhost:8000/docs"
echo ""
echo "📖 For detailed configuration help, see:"
echo "   - CONFIGURATION_SUMMARY.md (quick reference)"
echo "   - ENVIRONMENT_SETUP_GUIDE.md (detailed guide)" 