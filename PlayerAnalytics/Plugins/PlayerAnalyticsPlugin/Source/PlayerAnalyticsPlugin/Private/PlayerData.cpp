#include "PlayerData.h"
#include "Misc/DateTime.h"
#include "Misc/Guid.h"
#include "Misc/SecureHash.h"
#include "Serialization/JsonWriter.h"
#include "Serialization/JsonSerializer.h"

//Computer Specification-related includes
#include "GenericPlatform/GenericPlatformMisc.h"
#include "GenericPlatform/GenericPlatformDriver.h"
#include "GenericPlatform/GenericPlatformMemory.h"

FString GetMD5HashedMachineId()
{
    // Get machine ID
    //FGuid MachineId = ;
    FString MachineIdString = FPlatformMisc::GetLoginId();

    // Generate MD5 hash
    FString MD5Hash = FMD5::HashAnsiString(*MachineIdString);

    return MD5Hash;
}

UPlayerData::UPlayerData()
{
    playerID = FGuid::NewGuid().ToString();
    FGuid SessionID = FGuid::NewGuid();
    sessionID = SessionID.ToString(EGuidFormats::DigitsWithHyphens);
}


TSharedPtr<FJsonObject, ESPMode::ThreadSafe> UPlayerData::ToJson()
{
    // Create a JSON object
    TSharedPtr<FJsonObject> JsonObject = MakeShared<FJsonObject>();

    // Add game metadata

    TArray<TSharedPtr<FJsonValue>> gameDataPoint;
    TSharedPtr<FJsonObject> GameDataObject = MakeShared<FJsonObject>();
    GameDataObject->SetStringField("Game Title", gameTitle);
    GameDataObject->SetStringField("Game Version", gameVersion);
    gameDataPoint.Add(MakeShared<FJsonValueObject>(GameDataObject));
    JsonObject->SetArrayField("Game Data", gameDataPoint);

    // Add interactions to JSON
    TArray<TSharedPtr<FJsonValue>> InteractionsArray;
    for (int i = 0; i < interactions.Num(); i++)
    {
        TSharedPtr<FJsonObject> InteractionObject = MakeShared<FJsonObject>();
        InteractionObject->SetStringField("PlayerID", interactions[i].PlayerID);
        InteractionObject->SetStringField("SessionID", interactions[i].SessionID);
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

    // Add inventory to JSON
    TArray<TSharedPtr<FJsonValue>> InventoryArray;
    for (int i = 0; i < Inventories.Num(); i++)
    {
        TSharedPtr<FJsonObject> InventoryObject = MakeShared<FJsonObject>();
        InventoryObject->SetNumberField("Size", Inventories[i].Size);
        InventoryObject->SetNumberField("Capacity", Inventories[i].Capacity);
        InventoryObject->SetStringField("Timestamp", Inventories[i].Timestamp);

        // Convert TArray to JSON array
        TArray<TSharedPtr<FJsonValue>> ItemsArray;
        for (int j = 0; j < Inventories[i].Size; j++) {
            ItemsArray.Add(MakeShared<FJsonValueNumber>(Inventories[i].Items[j].Amount));
            ItemsArray.Add(MakeShared<FJsonValueString>(Inventories[i].Items[j].ItemName));
        }
        InventoryObject->SetArrayField("Items", ItemsArray);
        
        InventoryArray.Add(MakeShared<FJsonValueObject>(InventoryObject));
    }
    JsonObject->SetArrayField("Inventories", InventoryArray);

    // Add positions to JSON
    TArray<TSharedPtr<FJsonValue>> PositionsArray;
    for (int i = 0; i < positions.Num(); i++)
    {
        TSharedPtr<FJsonObject> PositionObject = MakeShared<FJsonObject>();
        PositionObject->SetStringField("PlayerID", positions[i].PlayerID);
        PositionObject->SetStringField("SessionID", positions[i].SessionID);
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
        FPSObject->SetStringField("SessionID", AvgFPSPoints[i].SessionID);
        FPSObject->SetNumberField("AverageFPS", AvgFPSPoints[i].AverageFPS);

        FPSAveragesArray.Add(MakeShared<FJsonValueObject>(FPSObject));
    }
    JsonObject->SetArrayField("FPS (Frames Per Second)", FPSAveragesArray);

    // Add Session data to JSON
    TArray<TSharedPtr<FJsonValue>> SessionArray;
    for (int i = 0; i < Sessions.Num(); i++)
    {
        TSharedPtr<FJsonObject> SessionObject = MakeShared<FJsonObject>();
        SessionObject->SetStringField("PlayerID", Sessions[i].PlayerID);
        SessionObject->SetStringField("SessionID", Sessions[i].SessionID);
        SessionObject->SetStringField("StartTime", Sessions[i].StartTime);
        SessionObject->SetStringField("EndTime", Sessions[i].EndTime);
        SessionObject->SetStringField("EndType", Sessions[i].EndType);

        SessionArray.Add(MakeShared<FJsonValueObject>(SessionObject));
    }
    JsonObject->SetArrayField("Sessions", SessionArray);

    // Add RAM data to JSON
    TArray<TSharedPtr<FJsonValue>> RAMArray;
    for (int i = 0; i < MemoryPoints.Num(); i++)
    {
        TSharedPtr<FJsonObject> RAMObject = MakeShared<FJsonObject>();
        RAMObject->SetStringField("PlayerID", MemoryPoints[i].PlayerID);
        RAMObject->SetStringField("Timestamp", MemoryPoints[i].Timestamp);
        RAMObject->SetStringField("SessionID", MemoryPoints[i].SessionID);
        RAMObject->SetNumberField("MemoryMB", MemoryPoints[i].RAMUsed);

        RAMArray.Add(MakeShared<FJsonValueObject>(RAMObject));
    }
    JsonObject->SetArrayField("RAM Usage", RAMArray);



    // Add Computer Specs data to JSON
    TArray<TSharedPtr<FJsonValue>> SpecsArray;

        TSharedPtr<FJsonObject> SpecsObject = MakeShared<FJsonObject>();
        SpecsObject->SetStringField("PlayerID", playerID);

        // Operating System Version (numeric OS version)
        SpecsObject->SetStringField("OSLabel", FPlatformMisc::GetOSVersion());

        // RAM Maximum available for UE5 to use
        SpecsObject->SetNumberField("RAMPhysMaxMB", static_cast<double>(FPlatformMemory::GetStats().AvailablePhysical) / (1024 * 1024));
        SpecsObject->SetNumberField("RAMVirtMaxMB", static_cast<double>(FPlatformMemory::GetStats().AvailableVirtual) / (1024 * 1024));
        
        // CPU Specs
        SpecsObject->SetStringField("CPUName", FPlatformMisc::GetCPUBrand());
        SpecsObject->SetStringField("CPUBrand", FPlatformMisc::GetCPUVendor());
        SpecsObject->SetNumberField("CPUCoreNo", FPlatformMisc::NumberOfCores());

        // GPU Specs
        FGPUDriverInfo GPUInfo = FPlatformMisc::GetGPUDriverInfo(FPlatformMisc::GetPrimaryGPUBrand());
        SpecsObject->SetStringField("GPUName", GPUInfo.DeviceDescription);
        SpecsObject->SetStringField("GPUDriverVersion", GPUInfo.UserDriverVersion);
        SpecsObject->SetStringField("GPUDriverVersionInternal", GPUInfo.InternalDriverVersion);
        SpecsObject->SetStringField("GPUDriverDate", GPUInfo.DriverDate);

        SpecsArray.Add(MakeShared<FJsonValueObject>(SpecsObject));

    JsonObject->SetArrayField("Computer Specifications", SpecsArray);

    return JsonObject;
}
