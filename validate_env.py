#!/usr/bin/env python3
"""
Environment Variable Validation Script for Serenity AI Agent
Checks if all required and optional API keys are properly configured
"""

import os
import sys
from pathlib import Path

def check_color(check_passed: bool) -> str:
    """Return colored status indicator"""
    if check_passed:
        return "✅"
    else:
        return "❌"

def validate_environment():
    """Validate all environment variables"""
    print("🔍 Serenity AI Agent - Environment Validation")
    print("=" * 50)
    
    # Load environment variables
    try:
        from api.env_config import config
        print("✅ Environment configuration loaded successfully")
    except ImportError as e:
        print(f"❌ Failed to load environment configuration: {e}")
        return False
    
    validation_results = {}
    
    # Required variables
    print("\n🔑 REQUIRED CONFIGURATION:")
    required_vars = {
        'OPENAI_API_KEY': config.OPENAI_API_KEY,
        'API_KEY': config.API_KEY,
        'SECRET_KEY': config.SECRET_KEY
    }
    
    for var_name, var_value in required_vars.items():
        is_valid = bool(var_value and var_value.strip() and not var_value.startswith('your-') and not var_value.startswith('sk-your-'))
        validation_results[var_name] = is_valid
        status = check_color(is_valid)
        
        if var_name == 'OPENAI_API_KEY':
            if is_valid and var_value.startswith('sk-'):
                print(f"{status} {var_name}: {var_value[:20]}...")
            else:
                print(f"{status} {var_name}: Not configured or invalid format")
        elif var_name in ['API_KEY', 'SECRET_KEY']:
            if is_valid:
                print(f"{status} {var_name}: {var_value[:16]}...")
            else:
                print(f"{status} {var_name}: Not configured")
    
    # Optional but recommended
    print("\n🟡 RECOMMENDED CONFIGURATION:")
    recommended_vars = {
        'SUPABASE_URL': config.SUPABASE_URL,
        'SUPABASE_KEY': config.SUPABASE_KEY,
        'SMTP_USERNAME': config.SMTP_USERNAME,
        'SMTP_PASSWORD': config.SMTP_PASSWORD
    }
    
    for var_name, var_value in recommended_vars.items():
        is_configured = bool(var_value and var_value.strip() and not var_value.startswith('your-'))
        status = "✅" if is_configured else "⚠️"
        
        if is_configured:
            if 'URL' in var_name:
                print(f"{status} {var_name}: {var_value}")
            else:
                print(f"{status} {var_name}: {var_value[:16]}...")
        else:
            print(f"{status} {var_name}: Not configured (optional)")
    
    # Optional integrations
    print("\n🔗 INTEGRATION CONFIGURATION:")
    integration_vars = {
        'BITRIX_WEBHOOK_URL': config.BITRIX_WEBHOOK_URL,
        'PIPEDRIVE_API_KEY': config.PIPEDRIVE_API_KEY,
        'GOOGLE_CLIENT_ID': config.GOOGLE_CLIENT_ID,
        'WHATSAPP_API_KEY': config.WHATSAPP_API_KEY,
        'AWS_ACCESS_KEY_ID': config.AWS_ACCESS_KEY_ID
    }
    
    for var_name, var_value in integration_vars.items():
        is_configured = bool(var_value and var_value.strip() and not var_value.startswith('your-'))
        status = "✅" if is_configured else "➖"
        
        if is_configured:
            if 'URL' in var_name:
                print(f"{status} {var_name}: {var_value}")
            else:
                print(f"{status} {var_name}: {var_value[:20]}...")
        else:
            print(f"{status} {var_name}: Not configured")
    
    # Server configuration
    print("\n⚙️  SERVER CONFIGURATION:")
    server_vars = {
        'API_HOST': config.API_HOST,
        'API_PORT': config.API_PORT,
        'NODE_ENV': config.NODE_ENV,
        'DEBUG': config.DEBUG,
        'LOG_LEVEL': config.LOG_LEVEL
    }
    
    for var_name, var_value in server_vars.items():
        print(f"ℹ️  {var_name}: {var_value}")
    
    # File checks
    print("\n📁 FILE SYSTEM CHECKS:")
    file_checks = {
        '.env': Path('.env').exists(),
        'logs/': Path('logs').exists(),
        'agency_profiles/': Path('agency_profiles').exists(),
        'requirements.txt': Path('requirements.txt').exists()
    }
    
    for file_name, exists in file_checks.items():
        status = check_color(exists)
        print(f"{status} {file_name}: {'Found' if exists else 'Missing'}")
    
    # Summary
    print("\n📊 VALIDATION SUMMARY:")
    required_passed = all(validation_results.values())
    
    if required_passed:
        print("✅ All required configuration is valid")
        print("🚀 API should start successfully")
        print("📖 Visit http://localhost:8000/docs after starting")
    else:
        print("❌ Some required configuration is missing or invalid")
        print("🔧 Please check your .env file and configure missing keys")
        missing_keys = [k for k, v in validation_results.items() if not v]
        print(f"📝 Missing/invalid keys: {', '.join(missing_keys)}")
    
    print(f"\n🎯 Configuration completion: {sum(validation_results.values())}/{len(validation_results)} required")
    
    return required_passed

def print_setup_help():
    """Print help for setting up missing configuration"""
    print("\n💡 SETUP HELP:")
    print("1. Run the setup script: ./setup_env.ps1 (Windows) or ./setup_env.sh (Linux/Mac)")
    print("2. Edit .env file manually: notepad .env (Windows) or nano .env (Linux/Mac)")
    print("3. Get OpenAI API key: https://platform.openai.com/api-keys")
    print("4. See ENVIRONMENT_SETUP_GUIDE.md for detailed instructions")
    print("5. See CONFIGURATION_SUMMARY.md for quick reference")

if __name__ == "__main__":
    try:
        is_valid = validate_environment()
        if not is_valid:
            print_setup_help()
            sys.exit(1)
        else:
            print("\n🎉 Environment validation passed!")
            sys.exit(0)
    except Exception as e:
        print(f"❌ Validation failed with error: {e}")
 