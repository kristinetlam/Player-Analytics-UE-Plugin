#include "ServerFunctions.h"
#include "PlayerAnalyticsSettings.h"
#include "HttpModule.h"
#include "Interfaces/IHttpRequest.h"
#include "Interfaces/IHttpResponse.h"
#include "Json.h"
#include "Misc/FileHelper.h"
#include "HAL/PlatformFilemanager.h"

void UServerFunctions::SendPlayerData(FString FileName)
{
    FString SavedDir = FPaths::ProjectSavedDir();
    IPlatformFile& PlatformFile = FPlatformFileManager::Get().GetPlatformFile();

    // Lambda to send a single JSON file
    auto SendFile = [&](const FString& FilePath)
        {
            FString JsonString;
            if (!FFileHelper::LoadFileToString(JsonString, *FilePath))
            {
                UE_LOG(LogTemp, Error, TEXT("Failed to load %s"), *FilePath);
                return;
            }

            const UPlayerAnalyticsSettings* Settings = GetDefault<UPlayerAnalyticsSettings>();
            if (!Settings)
            {
                UE_LOG(LogTemp, Error, TEXT("Failed to get PlayerAnalyticsSettings"));
                return;
            }

            TSharedRef<IHttpRequest, ESPMode::ThreadSafe> Request = FHttpModule::Get().CreateRequest();
            Request->SetURL(Settings->ServerIP + "/add-data");
            Request->SetVerb("POST");
            Request->SetHeader("Content-Type", "application/json");
            Request->SetHeader("Authorization", "Bearer " + Settings->AuthToken);
            Request->SetContentAsString(JsonString);

            Request->OnProcessRequestComplete().BindLambda([FilePath](FHttpRequestPtr Request, FHttpResponsePtr Response, bool bWasSuccessful)
                {
                    if (bWasSuccessful && Response.IsValid() && Response->GetResponseCode() >= 200 && Response->GetResponseCode() < 300)
                    {
                        UE_LOG(LogTemp, Log, TEXT("Server Response: %s"), *Response->GetContentAsString());

                        if (FPlatformFileManager::Get().GetPlatformFile().DeleteFile(*FilePath))
                        {
                            UE_LOG(LogTemp, Log, TEXT("Successfully deleted file: %s"), *FilePath);
                        }
                        else
                        {
                            UE_LOG(LogTemp, Error, TEXT("Failed to delete file: %s"), *FilePath);
                        }
                    }
                    else
                    {
                        UE_LOG(LogTemp, Error, TEXT("Failed to send request or server returned error"));
                    }
                });

            Request->ProcessRequest();
        };

    // Send the specified file first
    SendFile(SavedDir + FileName);

    // Check for other JSON files in the saved directory
    TArray<FString> Files;
    PlatformFile.FindFiles(Files, *SavedDir, TEXT(".json"));

    for (const FString& File : Files)
    {
        if (File != SavedDir + FileName) // Avoid resending the specified file
        {
            SendFile(File);
        }
    }
}
