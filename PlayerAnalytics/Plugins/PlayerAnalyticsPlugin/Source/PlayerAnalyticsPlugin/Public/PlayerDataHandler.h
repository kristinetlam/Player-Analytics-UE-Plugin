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
    FString SaveToJSON();

    UFUNCTION(BlueprintCallable, Category = "DataSaving")
    void AddInteraction(FString InteractionDescription, FVector InteractionLocation);
    
    UFUNCTION(BlueprintCallable, Category = "DataSaving")
    void AddPosition(FVector Position);
    
    UFUNCTION(BlueprintCallable, Category = "DataSaving")
    void AddAVGfps(int AVGfps);

    UFUNCTION(BlueprintCallable, Category = "DataSaving")
    void AddSession(FString StartTime, FString EndTime, FString EndType);

    UFUNCTION(BlueprintCallable, Category = "DataSaving")
    void AddCPUSpecs(FString cpuName, FString cpuBrand);

    

    UPROPERTY(BlueprintReadWrite, Category = "DataSaving")
    UPlayerData* playerData;
protected:
private:
};