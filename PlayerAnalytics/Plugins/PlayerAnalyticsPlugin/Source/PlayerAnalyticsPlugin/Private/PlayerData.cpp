#include "PlayerData.h"
#include "Misc/DateTime.h"
#include "Misc/Guid.h"
#include "Misc/SecureHash.h"
#include "Serialization/JsonWriter.h"
#include "Serialization/JsonSerializer.h"

FString GetMD5HashedMachineId()
{
    // Get machine ID
    FGuid MachineId = FPlatformMisc::GetMachineId();
    FString MachineIdString = MachineId.ToString(EGuidFormats::Digits);

    // Generate MD5 hash
    FString MD5Hash = FMD5::HashAnsiString(*MachineIdString);

    return MD5Hash;
}

UPlayerData::UPlayerData()
{
    playerID = FGuid::NewGuid().ToString();
}


TSharedPtr<FJsonObject> UPlayerData::ToJson()
{
    // Create a JSON object
    TSharedPtr<FJsonObject> JsonObject = MakeShared<FJsonObject>();


    // Add interactions to JSON
    TArray<TSharedPtr<FJsonValue>> InteractionsArray;
    for (int i = 0; i < interactions.Num(); i++)
    {
        TSharedPtr<FJsonObject> InteractionObject = MakeShared<FJsonObject>();
        InteractionObject->SetStringField("PlayerID", interactions[i].PlayerID);
        InteractionObject->SetStringField("Timestamp", interactions[i].Timestamp);
        InteractionObject->SetStringField("InteractionDescription", interactions[i].InteractionDescription);

        // Convert FVector to JSON array
        TArray<TSharedPtr<FJsonValue>> LocationArray;
        LocationArray.Add(MakeShared<FJsonValueNumber>(interactions[i].InteractionLocation.X));
        LocationArray.Add(MakeShared<FJsonValueNumber>(interactions[i].InteractionLocation.Y));
        LocationArray.Add(MakeShared<FJsonValueNumber>(interactions[i].InteractionLocation.Z));
        InteractionObject->SetArrayField("InteractionLocation", LocationArray);

        InteractionsArray.Add(MakeShared<FJsonValueObject>(InteractionObject));
    }
    JsonObject->SetArrayField("Interactions", InteractionsArray);

    // Add positions to JSON
    TArray<TSharedPtr<FJsonValue>> PositionsArray;
    for (int i = 0; i < positions.Num(); i++)
    {
        TSharedPtr<FJsonObject> PositionObject = MakeShared<FJsonObject>();
        PositionObject->SetStringField("PlayerID", positions[i].PlayerID);
        PositionObject->SetStringField("Timestamp", positions[i].Timestamp);

        // Convert FVector to JSON array
        TArray<TSharedPtr<FJsonValue>> PositionArray;
        PositionArray.Add(MakeShared<FJsonValueNumber>(positions[i].Position.X));
        PositionArray.Add(MakeShared<FJsonValueNumber>(positions[i].Position.Y));
        PositionArray.Add(MakeShared<FJsonValueNumber>(positions[i].Position.Z));
        PositionObject->SetArrayField("Position", PositionArray);

        PositionsArray.Add(MakeShared<FJsonValueObject>(PositionObject));
    }
    JsonObject->SetArrayField("Positions", PositionsArray);

    // Add FPS data to JSON
    TArray<TSharedPtr<FJsonValue>> FPSAveragesArray;
    for (int i = 0; i < AvgFPSPoints.Num(); i++)
    {
        TSharedPtr<FJsonObject> FPSObject = MakeShared<FJsonObject>();
        FPSObject->SetStringField("PlayerID", AvgFPSPoints[i].PlayerID);
        FPSObject->SetStringField("Timestamp", AvgFPSPoints[i].Timestamp);
        FPSObject->SetNumberField("AverageFPS", AvgFPSPoints[i].AverageFPS);

        FPSAveragesArray.Add(MakeShared<FJsonValueObject>(FPSObject));
    }
    JsonObject->SetArrayField("AVG FPS", FPSAveragesArray);

    // Add Session data to JSON
    TArray<TSharedPtr<FJsonValue>> SessionArray;
    for (int i = 0; i < Sessions.Num(); i++)
    {
        TSharedPtr<FJsonObject> FPSObject = MakeShared<FJsonObject>();
        FPSObject->SetStringField("PlayerID", Sessions[i].PlayerID);
        FPSObject->SetStringField("StartTime", Sessions[i].StartTime);
        FPSObject->SetStringField("EndTime", Sessions[i].EndTime);
        FPSObject->SetStringField("EndType", Sessions[i].EndType);

        SessionArray.Add(MakeShared<FJsonValueObject>(FPSObject));
    }
    JsonObject->SetArrayField("Sessions", SessionArray);

    // Add CPU spec data to JSON
    TArray<TSharedPtr<FJsonValue>> cpuSpecsArray;
    for (int i = 0; i < cpuSpecs.Num(); i++)
    {
        TSharedPtr<FJsonObject> CPUObject = MakeShared<FJsonObject>();
        CPUObject->SetStringField("PlayerID", cpuSpecs[i].PlayerID);
        CPUObject->SetStringField("CPUName", cpuSpecs[i].cpuName);
        CPUObject->SetStringField("CPUBrand", cpuSpecs[i].cpuBrand);
        CPUObject->SetNumberField("CPUCoreNo", cpuSpecs[i].cpuCores);

        CPUObject->SetStringField("GPUName", gpuSpecs[i].gpuName);

        cpuSpecsArray.Add(MakeShared<FJsonValueObject>(CPUObject));
    }
    JsonObject->SetArrayField("Computer Specifications", cpuSpecsArray);

    return JsonObject;

}


// UPlayerData::UPlayerData()
// {
//     Timestamp = FDateTime::Now().ToString(TEXT("%Y-%m-%d %H:%M:%S"));
//     InteractionID = FMath::Rand();  // Generate a random ID
//     InteractionLocation = FVector::ZeroVector;
//     ActorName = "";
//     InteractionDescription = "";
// }

// TSharedPtr<FJsonObject> UPlayerData::ToJson() const
// {
//     TSharedPtr<FJsonObject> JsonObject = MakeShared<FJsonObject>();
//     JsonObject->SetStringField("ActorName", ActorName.IsEmpty() ? TEXT("Unknown") : ActorName);
//     JsonObject->SetStringField("InteractionDescription", InteractionDescription.IsEmpty() ? TEXT("None"):InteractionDescription);
//     JsonObject->SetStringField("Timestamp", Timestamp);
//     JsonObject->SetNumberField("InteractionID", InteractionID);

//     // Convert FVector to JSON array
//     TArray<TSharedPtr<FJsonValue>> LocationArray;
//     LocationArray.Add(MakeShared<FJsonValueNumber>(InteractionLocation.X));
//     LocationArray.Add(MakeShared<FJsonValueNumber>(InteractionLocation.Y));
//     LocationArray.Add(MakeShared<FJsonValueNumber>(InteractionLocation.Z));
//     JsonObject->SetArrayField("InteractionLocation", LocationArray);

//     return JsonObject;
// }


// TArray<UPlayerData*> UPlayerData::StoredInteractions;


// void UPlayerData::AddInteraction(UPlayerData* NewInteraction)
// {
//     if (NewInteraction)
//     {
//         StoredInteractions.Add(NewInteraction);
//         UE_LOG(LogTemp, Log, TEXT("Interaction added. Total interactions: %d"), StoredInteractions.Num());
//     }
// }


// void UPlayerData::SaveToJSON(){
    

//     StoredInteractions.RemoveAll([](UPlayerData* Interaction)
//     {
//         return Interaction == nullptr;
//     });

//     if (StoredInteractions.Num() == 0)
//     {
//         UE_LOG(LogTemp, Warning, TEXT("No interactions to save."));
//         return;
//     }

//     // Create JSON array
//     TArray<TSharedPtr<FJsonValue>> JsonArray;
//     for (const UPlayerData* Interaction : StoredInteractions)
//     {
//         if (!Interaction)
//         {
//             UE_LOG(LogTemp, Error, TEXT("Null pointer detected in StoredInteractions!"));
//             return;
//         }
//         JsonArray.Add(MakeShared<FJsonValueObject>(Interaction->ToJson()));
//     }

//     TSharedPtr<FJsonObject> JsonObject = MakeShared<FJsonObject>();
//     JsonObject->SetArrayField("Interactions", JsonArray);
    

//     // Convert JSON object to string
//     FString OutputString;
//     TSharedRef<TJsonWriter<>> Writer = TJsonWriterFactory<>::Create(&OutputString);
//     FJsonSerializer::Serialize(JsonObject.ToSharedRef(), Writer);

//     // Define the file path
//     FString FilePath = FPaths::ProjectSavedDir() + TEXT("json");

//     // Save to file
//     if (FFileHelper::SaveStringToFile(OutputString, *FilePath))
//     {
//         UE_LOG(LogTemp, Log, TEXT("Successfully saved interactions to file: %s"), *FilePath);
//     }
//     else
//     {
//         UE_LOG(LogTemp, Error, TEXT("Failed to save interactions to file."));
//     }
// }