#pragma once

#include "CoreMinimal.h"
#include "UObject/NoExportTypes.h"
#include "PlayerData.generated.h"

UCLASS(Blueprintable, EditInlineNew)
class PLAYERANALYTICSPLUGIN_API UPlayerData : public UObject
{
    GENERATED_BODY()

public:
    UPROPERTY(BlueprintReadWrite, Category = "Interaction")
    FString ActorName;

    UPROPERTY(BlueprintReadWrite, Category = "Interaction")
    FString InteractionDescription;

    UPROPERTY(BlueprintReadWrite, Category = "Interaction")
    FString Timestamp;

    UPROPERTY(BlueprintReadWrite, Category = "Interaction")
    FVector InteractionLocation;

    UPROPERTY(BlueprintReadWrite, Category = "Interaction")
    int32 InteractionID;

    UFUNCTION(BlueprintCallable, Category = "File")
    static void SaveToJSON();

    // Constructor
    UPlayerData();

    // Convert to JSON
    TSharedPtr<FJsonObject> ToJson() const;

    UFUNCTION(BlueprintCallable, Category = "File")
    static void AddInteraction(UPlayerData* NewInteraction);

private:
    static TArray<UPlayerData*> StoredInteractions;

};
