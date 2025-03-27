#include "PlayerDataHandler.h"
#include "PlayerData.h"
#include "Misc/Guid.h"
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
void UPlayerDataHandler::AddInteraction(FString InteractionDescription, FVector InteractionLocation)
{
    FinteractionData interaction;
    interaction.PlayerID = playerData->playerID;
    interaction.InteractionDescription = InteractionDescription;
    interaction.InteractionLocation = InteractionLocation;
    interaction.Timestamp = FDateTime::Now().ToString();
    playerData->interactions.Add(interaction);
}

/// <summary>
/// Adds a position to the playerData object
/// </summary>
/// <param name="ActorName"></param>
/// <param name="Position"></param>
void UPlayerDataHandler::AddPosition(FVector Position)
{
    FpositionData position;
    position.PlayerID = playerData->playerID;
    position.Position = Position;
    position.Timestamp = FDateTime::Now().ToString();
    playerData->positions.Add(position);
}

void UPlayerDataHandler::AddAVGfps(int AVGfps) {
    FfpsData fpsData;
    fpsData.PlayerID = playerData->playerID;
    fpsData.AverageFPS = AVGfps;
    fpsData.Timestamp = FDateTime::Now().ToString();
    playerData->AvgFPSPoints.Add(fpsData);
}

void UPlayerDataHandler::AddSession(FString StartTime, FString EndTime, FString EndType) {
    FsessionData session;
    session.PlayerID = playerData->playerID;
    session.StartTime = StartTime;
    session.EndTime = EndTime;
    session.EndType = EndType;
    playerData->Sessions.Add(session);
}

void UPlayerDataHandler::AddCPUSpecs(FString cpuName, FString cpuBrand) {
    FcpuSpecs cpuspecs;
    cpuspecs.PlayerID = playerData->playerID;
    cpuspecs.cpuName = cpuName;
    cpuspecs.cpuBrand = cpuBrand;
    playerData->cpuSpecs.Add(cpuspecs);
}

/// <summary>
/// Saves player data to a JSON file 
/// </summary>
FString UPlayerDataHandler::SaveToJSON() {

    TSharedPtr<FJsonObject> JsonObject = playerData->ToJson();

    // Convert JSON object to string
    FString OutputString;
    TSharedRef<TJsonWriter<TCHAR>> Writer = TJsonWriterFactory<>::Create(&OutputString);
    FJsonSerializer::Serialize(JsonObject.ToSharedRef(), Writer);

    //get the time in string format
    FString DateString = FDateTime::Now().ToString(TEXT("%Y-%m-%d-%H-%M-%S"));

    // Save JSON string to file, giving a unique filename
    FString SaveDirectory = FPaths::ProjectSavedDir() + DateString;
    FString FileName = ".json";
    FString AbsoluteFilePath = SaveDirectory + FileName;

    if (FFileHelper::SaveStringToFile(OutputString, *AbsoluteFilePath))
    {
        UE_LOG(LogTemp, Log, TEXT("Successfully saved interactions to file: %s"), *AbsoluteFilePath);
    }
    else
    {
        UE_LOG(LogTemp, Error, TEXT("Failed to save interactions to file."));
    }

    return DateString + FileName;
}