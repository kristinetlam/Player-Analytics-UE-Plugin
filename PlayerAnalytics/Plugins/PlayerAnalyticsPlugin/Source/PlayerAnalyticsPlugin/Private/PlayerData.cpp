#include "PlayerData.h"
#include "Misc/DateTime.h"
#include "Misc/Guid.h"
#include "Serialization/JsonWriter.h"
#include "Serialization/JsonSerializer.h"


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