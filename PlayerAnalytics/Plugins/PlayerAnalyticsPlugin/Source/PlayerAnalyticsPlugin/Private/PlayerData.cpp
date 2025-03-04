#include "PlayerData.h"
#include "Misc/DateTime.h"
#include "Serialization/JsonWriter.h"
#include "Serialization/JsonSerializer.h"

UPlayerData::UPlayerData()
{
    Timestamp = FDateTime::Now().ToString(TEXT("%Y-%m-%d %H:%M:%S"));
    InteractionID = FMath::Rand();  // Generate a random ID
}

TSharedPtr<FJsonObject> UPlayerData::ToJson() const
{
    TSharedPtr<FJsonObject> JsonObject = MakeShared<FJsonObject>();
    JsonObject->SetStringField("ActorName", ActorName);
    JsonObject->SetStringField("InteractionDescription", InteractionDescription);
    JsonObject->SetStringField("Timestamp", Timestamp);
    JsonObject->SetNumberField("InteractionID", InteractionID);

    // Convert FVector to JSON array
    TArray<TSharedPtr<FJsonValue>> LocationArray;
    LocationArray.Add(MakeShared<FJsonValueNumber>(InteractionLocation.X));
    LocationArray.Add(MakeShared<FJsonValueNumber>(InteractionLocation.Y));
    LocationArray.Add(MakeShared<FJsonValueNumber>(InteractionLocation.Z));
    JsonObject->SetArrayField("InteractionLocation", LocationArray);

    return JsonObject;
}

TArray<UPlayerData*> UPlayerData::StoredInteractions;


void UPlayerData::AddInteraction(UPlayerData* NewInteraction)
{
    if (NewInteraction)
    {
        StoredInteractions.Add(NewInteraction);
        UE_LOG(LogTemp, Log, TEXT("Interaction added. Total interactions: %d"), StoredInteractions.Num());
    }
}


void UPlayerData::SaveToJSON(){
    

    

    if (StoredInteractions.Num() == 0)
    {
        UE_LOG(LogTemp, Warning, TEXT("No interactions to save."));
        return;
    }

    // Create JSON array
    TArray<TSharedPtr<FJsonValue>> JsonArray;
    for (const UPlayerData* Interaction : StoredInteractions)
    {
        JsonArray.Add(MakeShared<FJsonValueObject>(Interaction->ToJson()));
    }

    TSharedPtr<FJsonObject> JsonObject = MakeShared<FJsonObject>();
    JsonObject->SetArrayField("Interactions", JsonArray);

    // Convert JSON object to string
    FString OutputString;
    TSharedRef<TJsonWriter<>> Writer = TJsonWriterFactory<>::Create(&OutputString);
    FJsonSerializer::Serialize(JsonObject.ToSharedRef(), Writer);

    // Define the file path
    FString FilePath = FPaths::ProjectSavedDir() + TEXT("Interactions.json");

    // Save to file
    if (FFileHelper::SaveStringToFile(OutputString, *FilePath))
    {
        UE_LOG(LogTemp, Log, TEXT("Successfully saved interactions to file: %s"), *FilePath);
    }
    else
    {
        UE_LOG(LogTemp, Error, TEXT("Failed to save interactions to file."));
    }
}