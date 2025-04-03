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
    void AddInventory(int size, int capacity, TArray<FString> itemNames, TArray<int> itemAmounts);
    
    UFUNCTION(BlueprintCallable, Category = "DataSaving")
    void AddPosition(FVector Position);
    
    UFUNCTION(BlueprintCallable, Category = "DataSaving")
    void AddAVGfps(int AVGfps);

    UFUNCTION(BlueprintCallable, Category = "DataSaving")
    void AddSession(FString SessionName, FString StartTime, FString EndTime, FString EndType);

    UFUNCTION(BlueprintCallable, Category = "DataSaving")
    void AddCPUSpecs(FString cpuName, FString cpuBrand, int32 cpuCores);

    UFUNCTION(BlueprintCallable, Category = "DataSaving")
    void AddGPUSpecs(FString gpuName);

    

    UPROPERTY(BlueprintReadWrite, Category = "DataSaving")
    UPlayerData* playerData;
protected:
private:
};