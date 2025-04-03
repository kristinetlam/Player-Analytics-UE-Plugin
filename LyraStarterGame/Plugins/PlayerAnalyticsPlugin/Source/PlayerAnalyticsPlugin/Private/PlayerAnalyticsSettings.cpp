#include "PlayerAnalyticsSettings.h"

UPlayerAnalyticsSettings::UPlayerAnalyticsSettings()
{
    // Load default values from the config file
    ServerIP = TEXT("http://127.0.0.1:5000");
    AuthToken = TEXT("your_secure_token_here");
}
