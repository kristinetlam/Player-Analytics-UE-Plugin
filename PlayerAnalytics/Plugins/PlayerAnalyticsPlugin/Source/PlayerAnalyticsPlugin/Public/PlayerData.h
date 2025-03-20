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
    int fps;
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

    UPROPERTY(BlueprintReadWrite, Category = "FPS")
    TArray<FpositionData> fpsPoints;

    // UPROPERTY(BlueprintReadWrite, Category = "Interaction")
    // FString ActorName;

    // UPROPERTY(BlueprintReadWrite, Category = "Interaction")
    // FString InteractionDescription;

     UPROPERTY(BlueprintReadWrite, Category = "Interaction")
     FString Timestamp;

    // UPROPERTY(BlueprintReadWrite, Category = "Interaction")
    // FVector InteractionLocation;

    // UPROPERTY(BlueprintReadWrite, Category = "Interaction")
    // int32 InteractionID;

    // UFUNCTION(BlueprintCallable, Category = "File")
    // static void SaveToJSON();

    // // Constructor
    // UPlayerData();

     // Convert to JSON
     TSharedPtr<FJsonObject> ToJson();

     FString playerID;

    // UFUNCTION(BlueprintCallable, Category = "PlayerData")
    //static void AddInteraction(UPlayerData* NewInteraction);

    // UFUNCTION(BlueprintCallable, Category = "PlayerData")
    // static void AddInteraction(UPlayerData* NewInteraction);

private:
    //static TArray<UPlayerData*> StoredInteractions;

};
