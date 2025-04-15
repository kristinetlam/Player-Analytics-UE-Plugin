#pragma once

#include "CoreMinimal.h"
#include "UObject/NoExportTypes.h"

#include "Serialization/JsonWriter.h"
#include "Serialization/JsonReader.h"
#include "Dom/JsonObject.h"  
#include "Templates/SharedPointer.h"
#include "PlayerData.generated.h"



USTRUCT(BlueprintType)
struct FinteractionData
{
    GENERATED_BODY()
    
    UPROPERTY(BlueprintReadWrite, Category = "Interaction")
    FString PlayerID;

    UPROPERTY(BlueprintReadWrite, Category = "Interaction")
    FString SessionID;
    
    UPROPERTY(BlueprintReadWrite, Category = "Interaction")
    FString InteractionDescription;

    UPROPERTY(BlueprintReadWrite, Category = "Interaction")
    FString Timestamp;

    UPROPERTY(BlueprintReadWrite, Category = "Interaction")
    FVector InteractionLocation;

    /*UPROPERTY(BlueprintReadWrite)
    int32 InteractionID;*/
};

USTRUCT(BlueprintType)
struct FinventoryItem
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite)
    int Amount;

    UPROPERTY(BlueprintReadWrite)
    FString ItemName;
};

USTRUCT(BlueprintType)
struct FinventoryData
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite)
    int Size;

    UPROPERTY(BlueprintReadWrite)
    int Capacity;

    UPROPERTY(BlueprintReadWrite)
    TArray<FinventoryItem> Items;

    UPROPERTY(BlueprintReadWrite)
    FString Timestamp;
};

USTRUCT(BlueprintType)
struct FpositionData
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, Category = "Position")
    FString PlayerID;

    UPROPERTY(BlueprintReadWrite, Category = "Interaction")
    FString SessionID;

    UPROPERTY(BlueprintReadWrite, Category = "Position")
    FString Timestamp;

    UPROPERTY(BlueprintReadWrite, Category = "Position")
    FVector Position;
};

USTRUCT(BlueprintType)
struct FfpsData
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, Category = "Frames Per Second")
    FString PlayerID;

    UPROPERTY(BlueprintReadWrite, Category = "Interaction")
    FString SessionID;

    UPROPERTY(BlueprintReadWrite, Category = "Frames Per Second")
    FString Timestamp;

    UPROPERTY(BlueprintReadWrite, Category = "Frames Per Second")
    int AverageFPS;
};

USTRUCT(BlueprintType)
struct FsessionData 
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, Category = "Session")
    FString PlayerID;

    UPROPERTY(BlueprintReadWrite, Category = "Session")
    FString SessionID;

    UPROPERTY(BlueprintReadWrite, Category = "Session")
    FString SessionName;

    UPROPERTY(BlueprintReadWrite, Category = "Session")
    FString TimeStamp;

    UPROPERTY(BlueprintReadWrite, Category = "Session")
    FString StartTime;

    UPROPERTY(BlueprintReadWrite, Category = "Session")
    FString EndTime;

    //Example types are "crash" and "exit"
    UPROPERTY(BlueprintReadWrite, Category = "Session")
    FString EndType;
};

USTRUCT(BlueprintType)
struct FuiInteractionData
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, Category = "UI_UX")
    FString PlayerID;

    UPROPERTY(BlueprintReadWrite, Category = "UI_UX")
    FString SessionID;

    UPROPERTY(BlueprintReadWrite, Category = "UI_UX")
    FString UIElementName;

    UPROPERTY(BlueprintReadWrite, Category = "UI_UX")
    FString ActionType;
    
};

USTRUCT(BlueprintType)
struct FuiScreenVisitData
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, Category = "UI_UX")
    FString PlayerID;

    UPROPERTY(BlueprintReadWrite, Category = "UI_UX")
    FString SessionID;

    UPROPERTY(BlueprintReadWrite, Category = "UI_UX")
    FString ScreenName;

    UPROPERTY(BlueprintReadWrite, Category = "UI_UX")
    float Duration; //NOTE: may want to consider a different data type (such as a double)

};

USTRUCT(BlueprintType)
struct FmemoryUsage 
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, Category = "Frames Per Second")
    FString PlayerID;

    UPROPERTY(BlueprintReadWrite, Category = "Interaction")
    FString SessionID;

    UPROPERTY(BlueprintReadWrite, Category = "Frames Per Second")
    FString Timestamp;

    UPROPERTY(BlueprintReadWrite, Category = "Frames Per Second")
    float RAMUsed;
};

USTRUCT(BlueprintType)
struct FCPUUsage 
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, Category = "Frames Per Second")
    FString PlayerID;

    UPROPERTY(BlueprintReadWrite, Category = "Interaction")
    FString SessionID;

    UPROPERTY(BlueprintReadWrite, Category = "Frames Per Second")
    FString Timestamp;

    UPROPERTY(BlueprintReadWrite, Category = "Frames Per Second")
    float CPUUsed;
};

USTRUCT(BlueprintType)
struct Fmoment
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, Category = "Moment")
    FString PlayerID;

    UPROPERTY(BlueprintReadWrite, Category = "Moment")
    FString SessionID;

    UPROPERTY(BlueprintReadWrite, Category = "Moment")
    FString GameVersion;

    UPROPERTY(BlueprintReadWrite, Category = "Moment")
    FString TimeStamp;

    UPROPERTY(BlueprintReadWrite, Category = "Moment")
    FVector Position;

    UPROPERTY(BlueprintReadWrite, Category = "Moment")
    FString CPU;

    UPROPERTY(BlueprintReadWrite, Category = "Moment")
    FString RAM;
};


UCLASS(Blueprintable, EditInlineNew)
class PLAYERANALYTICSPLUGIN_API UPlayerData : public UObject
{
    GENERATED_BODY()

public:
    UPlayerData();

    UPROPERTY(BlueprintReadWrite, Category = "Interaction")
    TArray<FinteractionData> interactions;

    UPROPERTY(BlueprintReadWrite, Category = "Position")
    TArray<FpositionData> positions;

    UPROPERTY(BlueprintReadWrite, Category = "Frames Per Second")
    TArray<FfpsData> AvgFPSPoints;

    UPROPERTY(BlueprintReadWrite, Category = "Session")
    TArray<FsessionData> Sessions;

    UPROPERTY(BlueprintReadWrite, Category = "Interaction")
    FString Timestamp;

    UPROPERTY(BlueprintReadWrite, Category = "Inventory")
    TArray<FinventoryData> Inventories;

    UPROPERTY(BlueprintReadWrite, Category = "Memory Usage")
    TArray<FmemoryUsage> MemoryPoints;
    UPROPERTY(BlueprintReadWrite, Category = "UI_UX")
    TArray<FuiInteractionData> uiInteractions;

    UPROPERTY(BlueprintReadWrite, Category = "UI_UX")
    TArray<FuiScreenVisitData> screenVisits;


    UPROPERTY(BlueprintReadWrite, Category = "CPU Usage")
    TArray<FCPUUsage> CPUPoints;

    UPROPERTY(BlueprintReadWrite, Category = "Moment")
    TArray<Fmoment> Moments;

    // Convert to JSON
    TSharedPtr<FJsonObject, ESPMode::ThreadSafe> ToJson();

    FString playerID;
    FString sessionID;

    // Basic Game Data
    FString gameTitle = "Default Game Title";
    FString gameVersion = "0.0.0";


    // UFUNCTION(BlueprintCallable, Category = "PlayerData")
    //static void AddInteraction(UPlayerData* NewInteraction);

    // UFUNCTION(BlueprintCallable, Category = "PlayerData")
    // static void AddInteraction(UPlayerData* NewInteraction);

private:
    //static TArray<UPlayerData*> StoredInteractions;

};
