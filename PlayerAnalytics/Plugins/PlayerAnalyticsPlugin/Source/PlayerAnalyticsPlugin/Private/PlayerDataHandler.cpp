#include "PlayerDataHandler.h"
#include "PlayerData.h"
#include "Misc/Guid.h"
#include "Serialization/JsonWriter.h"
#include "Serialization/JsonSerializer.h"
#include "Misc/Paths.h"
#include "Misc/FileHelper.h"
#include "GenericPlatform/GenericPlatformMemory.h"
#include "GenericPlatform/GenericPlatformTime.h"

/**
 * @brief  Constructor for the UPlayerDataHandler class.
 * 
 * This constructor initializes the playerData object.
 */
UPlayerDataHandler::UPlayerDataHandler()
{
    playerData = NewObject<UPlayerData>();
}

/**
 * @brief  Adds an interaction to the playerData object.
 * 
 * @param InteractionDescription A description of the interaction.
 * @param InteractionLocation The location of the interaction.
 */
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

/**
 * @brief  Adds an inventory to the playerData object.
 * 
 * @param size The size of the inventory.
 * @param capacity The capacity of the inventory.
 * @param itemNames The names of the items in the inventory.
 * @param itemAmounts The amounts of the items in the inventory.
 */
void UPlayerDataHandler::AddInventory(int size, int capacity, TArray<FString> itemNames, TArray<int> itemAmounts)
{
    FinventoryData inventory;
    inventory.Size = size;
    inventory.Capacity = capacity;
    inventory.Timestamp = FDateTime::Now().ToString();

    inventory.Items.SetNum(size); // Allocate memory

    for (int i = 0; i < size; i++) {
        inventory.Items[i].ItemName = itemNames[i];
        inventory.Items[i].Amount = itemAmounts[i];
    }
    playerData->Inventories.Add(inventory);
}

/** 
* @brief  Adds a position to the playerData object.
* 
* @param Position The position of the player.
*/  
void UPlayerDataHandler::AddPosition(FVector Position)
{
    FpositionData position;
    position.PlayerID = playerData->playerID;
    position.SessionID = playerData->sessionID;
    position.Position = Position;
    position.Timestamp = FDateTime::Now().ToString();
    playerData->positions.Add(position);
}

/**
 * @brief  Adds an average FPS data point to the playerData object.
 * 
 * @param AVGfps The average FPS value.
 */
void UPlayerDataHandler::AddAVGfps(int AVGfps) {
    FfpsData fpsData;
    fpsData.PlayerID = playerData->playerID;
    fpsData.SessionID = playerData->sessionID;
    fpsData.AverageFPS = AVGfps;
    fpsData.Timestamp = FDateTime::Now().ToString();
    playerData->AvgFPSPoints.Add(fpsData);
}

/**
 * @brief  Adds a session to the playerData object.
 * 
 * @param SessionName The name of the session.
 * @param StartTime The start time of the session.
 * @param EndTime The end time of the session.
 * @param EndType The end type of the session.
 */
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

/**
 * @brief  Adds a UI interaction to the playerData object.
 * 
 * @param elementName The name of the UI element.
 * @param actionType The type of action performed on the UI element.
 */
void  UPlayerDataHandler::AddUiInteraction(FString elementName, FString actionType) {
    FuiInteractionData interaction;
    interaction.PlayerID = playerData->playerID;
    interaction.SessionID = playerData->sessionID;
    interaction.UIElementName = elementName;
    interaction.ActionType = actionType;
    playerData->uiInteractions.Add(interaction);
}

/**
 * @brief  Adds a screen visit to the playerData object.
 * 
 * @param screenName The name of the screen visited.
 * @param duration The duration of the visit.
 */
void  UPlayerDataHandler::AddScreenVisit(FString screenName, float duration) {
    FuiScreenVisitData visit;
    visit.PlayerID = playerData->playerID;
    visit.SessionID = playerData->sessionID;
    visit.ScreenName = screenName;
    visit.Duration = duration;
    playerData->screenVisits.Add(visit);
}

/**
 * @brief  Adds a memory usage data point to the playerData object.
 * 
 * @param ActorName The name of the actor.
 * @param RAM The amount of RAM used.
 */
void UPlayerDataHandler::AddMemory() {
    FmemoryUsage RAMData;
    RAMData.PlayerID = playerData->playerID;
    RAMData.SessionID = playerData->sessionID;
    RAMData.RAMUsed = static_cast<double>(FPlatformMemory::GetStats().UsedPhysical) / (1024 * 1024);
    RAMData.Timestamp = FDateTime::Now().ToString();
    playerData->MemoryPoints.Add(RAMData);
}

/**
 * @brief  Adds a CPU usage data point to the playerData object.
 * 
 * @param ActorName The name of the actor.
 * @param CPU The amount of CPU used.
 */
void UPlayerDataHandler::AddCPUUsage() {
    FCPUUsage CPUData;
    CPUData.PlayerID = playerData->playerID;
    CPUData.SessionID = playerData->sessionID;
    CPUData.CPUUsed = FPlatformTime::GetCPUTime().CPUTimePct;
    CPUData.Timestamp = FDateTime::Now().ToString();
    playerData->CPUPoints.Add(CPUData);
}

/**
 * @brief  Adds a moment to the playerData object.
 * 
 * @param position The position of the moment.
 * @param CPU The CPU usage at the moment.
 * @param RAM The RAM usage at the moment.
 * @param FPS The FPS at the moment.
 */
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

/**
 * @brief  Updates the player's health in the playerData object.
 * 
 * @param newHealth The new health value.
 */
void UPlayerDataHandler::UpdatePlayerHealth(int newHealth) {
    playerData->playerHealth = newHealth;
} 

/**
 * @brief  Saves the player data to a JSON file.
 * 
 * @return FString The name of the saved file.
 */
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