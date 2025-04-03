#pragma once

#include "CoreMinimal.h"
#include "UObject/NoExportTypes.h"
#include "PlayerData.generated.h"


USTRUCT(BlueprintType)
struct FinteractionData
{
    GENERATED_BODY()
    
    UPROPERTY(BlueprintReadWrite)
    FString PlayerID;
    
    UPROPERTY(BlueprintReadWrite)
    FString InteractionDescription;

    UPROPERTY(BlueprintReadWrite)
    FString Timestamp;

    UPROPERTY(BlueprintReadWrite)
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

    UPROPERTY(BlueprintReadWrite)
    FString PlayerID;

    UPROPERTY(BlueprintReadWrite)
    FString Timestamp;

    UPROPERTY(BlueprintReadWrite)
    FVector Position;
};

USTRUCT(BlueprintType)
struct FfpsData
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite)
    FString PlayerID;

    UPROPERTY(BlueprintReadWrite)
    FString Timestamp;

    UPROPERTY(BlueprintReadWrite)
    int AverageFPS;
};

USTRUCT(BlueprintType)
struct FsessionData 
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite)
    FString PlayerID;

    UPROPERTY(BlueprintReadWrite)
    FString SessionID;

    UPROPERTY(BlueprintReadWrite)
    FString SessionName;

    UPROPERTY(BlueprintReadWrite)
    FString StartTime;

    UPROPERTY(BlueprintReadWrite)
    FString EndTime;

    //Example types are "crash" and "exit"
    UPROPERTY(BlueprintReadWrite)
    FString EndType;
};

USTRUCT(BlueprintType)
struct FcpuSpecs 
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite)
    FString PlayerID;

    UPROPERTY(BlueprintReadWrite)
    FString cpuName;

    UPROPERTY(BlueprintReadWrite)
    FString cpuBrand;

    UPROPERTY(BlueprintReadWrite)
    int32 cpuCores;
};

USTRUCT(BlueprintType)
struct FgpuSpecs 
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite)
    FString PlayerID;

    UPROPERTY(BlueprintReadWrite)
    FString gpuName;
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

    UPROPERTY(BlueprintReadWrite, Category = "CPU Specs")
    TArray<FcpuSpecs> cpuSpecs;

    UPROPERTY(BlueprintReadWrite, Category = "GPU Specs");
    TArray<FgpuSpecs> gpuSpecs;

    // Convert to JSON
    TSharedPtr<FJsonObject> ToJson();

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
