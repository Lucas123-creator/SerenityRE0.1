# ===========================================
# Serenity AI Agent Environment Setup Script (PowerShell)
# ===========================================

Write-Host "🚀 Serenity AI Agent Environment Setup" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

# Check if templates exist
if (-not (Test-Path "env.development.template")) {
    Write-Host "❌ Error: env.development.template not found" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "env.production.template")) {
    Write-Host "❌ Error: env.production.template not found" -ForegroundColor Red
    exit 1
}

# Create development environment
Write-Host "📝 Creating development environment (.env)..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "⚠️  .env already exists. Backing up to .env.backup" -ForegroundColor Yellow
    Copy-Item ".env" ".env.backup"
}

Copy-Item "env.development.template" ".env"
Write-Host "✅ Created .env from template" -ForegroundColor Green

# Create production environment
Write-Host "📝 Creating production environment (.env.production)..." -ForegroundColor Yellow
if (Test-Path ".env.production") {
    Write-Host "⚠️  .env.production already exists. Backing up to .env.production.backup" -ForegroundColor Yellow
    Copy-Item ".env.production" ".env.production.backup"
}

Copy-Item "env.production.template" ".env.production"
Write-Host "✅ Created .env.production from template" -ForegroundColor Green

# Generate secure keys
Write-Host "🔐 Generating secure keys..." -ForegroundColor Yellow

# Generate API key
$timestamp = [System.DateTimeOffset]::Now.ToUnixTimeSeconds()
$randomBytes = New-Object byte[] 8
[System.Security.Cryptography.RandomNumberGenerator]::Fill($randomBytes)
$randomHex = ($randomBytes | ForEach-Object { $_.ToString("x2") }) -join ""
$apiKey = "dev_serenity_$timestamp" + "_$randomHex"
Write-Host "Generated API_KEY: $apiKey" -ForegroundColor Cyan

# Generate secret key (64 characters)
$secretBytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Fill($secretBytes)
$secretKey = ($secretBytes | ForEach-Object { $_.ToString("x2") }) -join ""
$secretKeyPreview = $secretKey.Substring(0, 16) + "..."
Write-Host "Generated SECRET_KEY: $secretKeyPreview" -ForegroundColor Cyan

# Update development environment
Write-Host "🔧 Updating development environment..." -ForegroundColor Yellow
$envContent = Get-Content ".env"
$envContent = $envContent -replace "API_KEY=dev_serenity_12345", "API_KEY=$apiKey"
$envContent = $envContent -replace "SECRET_KEY=development_secret_key_minimum_32_characters_long", "SECRET_KEY=$secretKey"
$envContent | Set-Content ".env"
Write-Host "✅ Updated .env with generated keys" -ForegroundColor Green

# Prompt for OpenAI API key
Write-Host ""
Write-Host "🤖 OpenAI API Key Setup" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host "To enable AI chat functionality, you need an OpenAI API key."
Write-Host "Get one from: https://platform.openai.com/api-keys"
Write-Host ""
$openaiKey = Read-Host "Enter your OpenAI API key (or press Enter to skip)"

if ($openaiKey -and $openaiKey.Trim() -ne "") {
    $envContent = Get-Content ".env"
    $envContent = $envContent -replace "OPENAI_API_KEY=sk-your-openai-api-key-here", "OPENAI_API_KEY=$openaiKey"
    $envContent | Set-Content ".env"
    Write-Host "✅ Updated OpenAI API key" -ForegroundColor Green
} else {
    Write-Host "⚠️  Skipped OpenAI API key. AI chat will not work until configured." -ForegroundColor Yellow
}

# Create necessary directories
Write-Host "📁 Creating necessary directories..." -ForegroundColor Yellow
if (-not (Test-Path "logs")) { New-Item -ItemType Directory -Path "logs" | Out-Null }
if (-not (Test-Path "agency_profiles")) { New-Item -ItemType Directory -Path "agency_profiles" | Out-Null }
Write-Host "✅ Created logs and agency_profiles directories" -ForegroundColor Green

# Summary
Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "=================="
Write-Host "✅ Created .env (development)" -ForegroundColor Green
Write-Host "✅ Created .env.production (production)" -ForegroundColor Green
Write-Host "✅ Generated secure API and secret keys" -ForegroundColor Green
if ($openaiKey -and $openaiKey.Trim() -ne "") {
    Write-Host "✅ Configured OpenAI API key" -ForegroundColor Green
} else {
    Write-Host "⚠️  OpenAI API key not configured" -ForegroundColor Yellow
}
Write-Host "✅ Created necessary directories" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Review and edit .env file if needed"
Write-Host "2. Install dependencies: pip install -r requirements.txt"
Write-Host "3. Start the API: python run_api.py"
Write-Host "4. Test at: http://localhost:8000/docs"
Write-Host ""
Write-Host "📖 For detailed configuration help, see:" -ForegroundColor Cyan
Write-Host "   - CONFIGURATION_SUMMARY.md (quick reference)"
Write-Host "   - ENVIRONMENT_SETUP_GUIDE.md (detailed guide)" 