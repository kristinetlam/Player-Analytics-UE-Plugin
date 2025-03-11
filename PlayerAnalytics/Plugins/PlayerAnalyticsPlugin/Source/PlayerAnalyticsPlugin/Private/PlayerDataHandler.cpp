#include "PlayerDataHandler.h"
#include "PlayerData.h"
#include "Serialization/JsonWriter.h"
#include "Serialization/JsonSerializer.h"

UPlayerDataHandler::UPlayerDataHandler()
{
    playerData = NewObject<UPlayerData>();
}

/// <summary>
/// Adds an interaction to the playerD ata class
/// </summary>
/// <param name="ActorName"></param>
/// <param name="InteractionDescription"></param>
/// <param name="InteractionLocation"></param>
/// <param name="InteractionID"></param>
void UPlayerDataHandler::AddInteraction(FString ActorName, FString InteractionDescription, FVector InteractionLocation, int32 InteractionID)
{
    FinteractionData interaction;
    interaction.ActorName = ActorName;
    interaction.InteractionDescription = InteractionDescription;
    interaction.InteractionLocation = InteractionLocation;
    interaction.InteractionID = InteractionID;
    playerData->interactions.Add(interaction);
}

/// <summary>
/// Adds a position to the playerData object
/// </summary>
/// <param name="ActorName"></param>
/// <param name="Position"></param>
void UPlayerDataHandler::AddPosition(FString ActorName, FVector Position)
{
    FpositionData position;
    position.ActorName = ActorName;
    position.Position = Position;
    playerData->positions.Add(position);
}


void UPlayerDataHandler::SaveToJSON() {

    TSharedPtr<FJsonObject> JsonObject = playerData->ToJson();

    // Convert JSON object to string
    FString OutputString;
    TSharedRef<TJsonWriter<TCHAR>> Writer = TJsonWriterFactory<>::Create(&OutputString);
    FJsonSerializer::Serialize(JsonObject.ToSharedRef(), Writer);

    //get the time in string format
    FString DateString = FDateTime::Now().ToString(TEXT("%Y-%m-%d-%H-%M-%S"));

    // Save JSON string to file, giving a unique filename
    FString SaveDirectory = FPaths::ProjectSavedDir() + DateString;
    FString FileName = "json";
    FString AbsoluteFilePath = SaveDirectory + FileName;

    if (FFileHelper::SaveStringToFile(OutputString, *AbsoluteFilePath))
    {
        UE_LOG(LogTemp, Log, TEXT("Successfully saved interactions to file: %s"), *AbsoluteFilePath);
    }
    else
    {
        UE_LOG(LogTemp, Error, TEXT("Failed to save interactions to file."));
    }
}