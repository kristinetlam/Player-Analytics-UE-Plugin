#pragma once

#include "CoreMinimal.h"
#include "PlayerData.h"
#include "Components/ActorComponent.h"
#include "PlayerDataHandler.generated.h"

UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class PLAYERANALYTICSPLUGIN_API UPlayerDataHandler : public UActorComponent
{
    GENERATED_BODY()
public:
    UPlayerDataHandler();

    UFUNCTION(BlueprintCallable, Category = "DataSaving")
    void SaveToJSON();

    UFUNCTION(BlueprintCallable, Category = "DataSaving")
    void AddInteraction(FString ActorName, FString InteractionDescription, FVector InteractionLocation, int32 InteractionID);
    
    UFUNCTION(BlueprintCallable, Category = "DataSaving")
    void AddPosition(FString ActorName, FVector Position);
    
    UPROPERTY(BlueprintReadWrite, Category = "DataSaving")
    UPlayerData* playerData;
protected:
private:
};