#include "PlayerDataHandler.h"
#include "PlayerData.h"
#include "Misc/Guid.h"
#include "Serialization/JsonWriter.h"
#include "Serialization/JsonSerializer.h"
#include "Misc/Paths.h"
#include "Misc/FileHelper.h"
#include "GenericPlatform/GenericPlatformMemory.h"
#include "GenericPlatform/GenericPlatformTime.h"


UPlayerDataHandler::UPlayerDataHandler()
{
    playerData = NewObject<UPlayerData>();
}

/// <summary>
/// Adds an interaction to the playerData class
/// </summary>
/// <param name="ActorName"></param>
/// <param name="InteractionDescription"></param>
/// <param name="InteractionLocation"></param>
/// <param name="InteractionID"></param>
void UPlayerDataHandler::AddInteraction(FString InteractionDescription, FVector InteractionLocation)
{
    FinteractionData interaction;
    interaction.PlayerID = playerData->playerID;
    interaction.SessionID = playerData->sessionID;
    interaction.InteractionDescription = InteractionDescription;
    interaction.InteractionLocation = InteractionLocation;
    interaction.Timestamp = FDateTime::Now().ToString();
    playerData->interactions.Add(interaction);
}

/// <summary>
/// Adds an inventory to the playerData class. Inventory is specified by two arrays of equal size, one listing item names, and one listing corresponding amounts of those items.
/// </summary>
/// <param name="Size"></param>
/// <param name="Capacity"></param>
/// <param name="ItemNames"></param>
/// <param name="ItemAmounts"></param>
void UPlayerDataHandler::AddInventory(int size, int capacity, TArray<FString> itemNames, TArray<int> itemAmounts)
{
    FinventoryData inventory;
    inventory.Size = size;
    inventory.Capacity = capacity;
    inventory.Timestamp = FDateTime::Now().ToString();
    for (int i = 0; i < size; i++) {
        inventory.Items[i].ItemName = itemNames[i];
        inventory.Items[i].Amount = itemAmounts[i];
    }
    playerData->Inventories.Add(inventory);
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
    position.SessionID = playerData->sessionID;
    position.Position = Position;
    position.Timestamp = FDateTime::Now().ToString();
    playerData->positions.Add(position);
}

/// <summary>
/// Adds FPS data point to the playerData object
/// </summary>
/// <param name="ActorName"></param>
/// <param name="Position"></param>
void UPlayerDataHandler::AddAVGfps(int AVGfps) {
    FfpsData fpsData;
    fpsData.PlayerID = playerData->playerID;
    fpsData.SessionID = playerData->sessionID;
    fpsData.AverageFPS = AVGfps;
    fpsData.Timestamp = FDateTime::Now().ToString();
    playerData->AvgFPSPoints.Add(fpsData);
}

/// <summary>
/// Adds a Session data point to the playerData object
/// </summary>
/// <param name="ActorName"></param>
/// <param name="Position"></param>
void UPlayerDataHandler::AddSession(FString SessionName, FString StartTime, FString EndTime, FString EndType) {
    FsessionData session;
    session.PlayerID = playerData->playerID;
    session.SessionName = SessionName;
    session.SessionID = playerData->sessionID;
    session.TimeStamp = FDateTime::Now().ToString();
    session.StartTime = StartTime;
    session.EndTime = EndTime;
    session.EndType = EndType;
    playerData->Sessions.Add(session);
}

void  UPlayerDataHandler::AddUiInteraction(FString elementName, FString actionType) {
    FuiInteractionData interaction;
    interaction.PlayerID = playerData->playerID;
    interaction.SessionID = playerData->sessionID;
    interaction.UIElementName = elementName;
    interaction.ActionType = actionType;
    playerData->uiInteractions.Add(interaction);
}

void  UPlayerDataHandler::AddScreenVisit(FString screenName, float duration) {
    FuiScreenVisitData visit;
    visit.PlayerID = playerData->playerID;
    visit.SessionID = playerData->sessionID;
    visit.ScreenName = screenName;
    visit.Duration = duration;
    playerData->screenVisits.Add(visit);
}

/// <summary>
/// Adds a RAM usage data point to the playerData object
/// </summary>
/// <param name="ActorName"></param>
/// <param name="RAM"></param>
void UPlayerDataHandler::AddMemory() {
    FmemoryUsage RAMData;
    RAMData.PlayerID = playerData->playerID;
    RAMData.SessionID = playerData->sessionID;
    RAMData.RAMUsed = static_cast<double>(FPlatformMemory::GetStats().UsedPhysical) / (1024 * 1024);
    RAMData.Timestamp = FDateTime::Now().ToString();
    playerData->MemoryPoints.Add(RAMData);
}

/// <summary>
/// Adds a CPU usage data point to the playerData object
/// </summary>
/// <param name="ActorName"></param>
/// <param name="CPU"></param>
void UPlayerDataHandler::AddCPUUsage() {
    FCPUUsage CPUData;
    CPUData.PlayerID = playerData->playerID;
    CPUData.SessionID = playerData->sessionID;
    CPUData.CPUUsed = FPlatformTime::GetCPUTime().CPUTimePct;
    CPUData.Timestamp = FDateTime::Now().ToString();
    playerData->CPUPoints.Add(CPUData);
}

void UPlayerDataHandler::AddMoment(FVector position, FString CPU, FString RAM, FString FPS) {
    Fmoment moment;
    moment.PlayerID = playerData->playerID;
    moment.Position = position;
    moment.GameVersion = playerData->gameVersion;
    moment.CPU = CPU;
    moment.RAM = RAM;
    moment.SessionID = playerData->sessionID;
    moment.TimeStamp = FDateTime::Now().ToString();
    moment.FPS = FPS;
    playerData->Moments.Add(moment);
}

void UPlayerDataHandler::UpdatePlayerHealth(int newHealth) {
    playerData->playerHealth = newHealth;
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