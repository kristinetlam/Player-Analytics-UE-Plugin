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

    UPROPERTY(BlueprintReadWrite, Category = "Frames Per Second")
    FString PlayerID;

    UPROPERTY(BlueprintReadWrite, Category = "Frames Per Second")
    FString SessionID;

    UPROPERTY(BlueprintReadWrite, Category = "Frames Per Second")
    FString SessionName;

    UPROPERTY(BlueprintReadWrite, Category = "Frames Per Second")
    FString StartTime;

    UPROPERTY(BlueprintReadWrite, Category = "Frames Per Second")
    FString EndTime;

    //Example types are "crash" and "exit"
    UPROPERTY(BlueprintReadWrite, Category = "Frames Per Second")
    FString EndType;
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
