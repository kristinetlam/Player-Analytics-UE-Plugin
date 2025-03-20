#include "ServerFunctions.h"
#include "PlayerAnalyticsSettings.h"
#include "HttpModule.h"
#include "Interfaces/IHttpRequest.h"
#include "Interfaces/IHttpResponse.h"
#include "Json.h"

void UServerFunctions::SendPlayerData()
{
    // Get settings
    const UPlayerAnalyticsSettings* Settings = GetDefault<UPlayerAnalyticsSettings>();
    if (!Settings)
    {
        UE_LOG(LogTemp, Error, TEXT("Failed to get PlayerAnalyticsSettings"));
        return;
    }

    // Read the JSON file from the project directory
    FString FilePath = FPaths::ProjectSavedDir() + TEXT("PlayerData.json");
    FString JsonString;
    if (!FFileHelper::LoadFileToString(JsonString, *FilePath))
    {
        UE_LOG(LogTemp, Error, TEXT("Failed to load PlayerData.json"));
        return;
    }

    // Create HTTP request
    TSharedRef<IHttpRequest, ESPMode::ThreadSafe> Request = FHttpModule::Get().CreateRequest();
    Request->SetURL(Settings->ServerIP + "/add-data");
    Request->SetVerb("POST");
    Request->SetHeader("Content-Type", "application/json");
    Request->SetHeader("Authorization", "Bearer " + Settings->AuthToken);
    Request->SetContentAsString(JsonString);

    // Bind response handler
    Request->OnProcessRequestComplete().BindLambda([](FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful)
        {
            if (bWasSuccessful && Response.IsValid())
            {
                UE_LOG(LogTemp, Log, TEXT("Server Response: %s"), *Response->GetContentAsString());
            }
            else
            {
                UE_LOG(LogTemp, Error, TEXT("Failed to send request"));
            }
        });

    // Send request
    Request->ProcessRequest();
}
