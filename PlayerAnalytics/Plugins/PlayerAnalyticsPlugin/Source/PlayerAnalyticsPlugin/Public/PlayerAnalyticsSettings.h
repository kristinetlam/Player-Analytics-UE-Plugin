#pragma once

#include "CoreMinimal.h"
#include "Engine/DeveloperSettings.h"
#include "PlayerAnalyticsSettings.generated.h"

UCLASS(Config = Game, DefaultConfig, meta = (DisplayName = "Player Analytics Settings"))
class PLAYERANALYTICSPLUGIN_API UPlayerAnalyticsSettings : public UDeveloperSettings
{
    GENERATED_BODY()

public:
    UPlayerAnalyticsSettings();  // Declare the constructor

    // Server IP address setting
    UPROPERTY(Config, EditAnywhere, BlueprintReadOnly, Category = "Player Analytics")
    FString ServerIP = TEXT("http://127.0.0.1:5000");

    // Authentication token setting
    UPROPERTY(Config, EditAnywhere, BlueprintReadOnly, Category = "Player Analytics")
    FString AuthToken = TEXT("your_secure_token_here");
};
