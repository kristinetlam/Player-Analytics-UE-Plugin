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

    UFUNCTION(BlueprintCallable, Category = "DataSaving",meta=(DisplayName = "Save Data to JSON",ToolTip="Saves the player data to a JSON file"))
    FString SaveToJSON();

    UFUNCTION(BlueprintCallable, Category = "Interaction",meta=(DisplayName = "Add Interaction",ToolTip="Adds an interaction to the player data"))
    void AddInteraction(FString InteractionDescription, FVector InteractionLocation);

    UFUNCTION(BlueprintCallable, Category = "Interaction",meta=(DisplayName = "Add Inventory",ToolTip="Adds an inventory to the player data"))
    void AddInventory(int size, int capacity, TArray<FString> itemNames, TArray<int> itemAmounts);
    
    UFUNCTION(BlueprintCallable, Category = "Position",meta=(DisplayName = "Add Position",ToolTip="Adds a position to the player data"))
    void AddPosition(FVector Position);
    
    UFUNCTION(BlueprintCallable, Category = "FPS",meta=(DisplayName = "Add Average FPS",ToolTip="Adds an average FPS data point to the player data"))
    void AddAVGfps(int AVGfps);

    UFUNCTION(BlueprintCallable, Category = "Session",meta=(DisplayName = "Add Session",ToolTip="Adds a session to the player data"))
    void AddSession(FString SessionName, FString StartTime, FString EndTime, FString EndType);

    UFUNCTION(BlueprintCallable, Category = "Interaction",meta=(DisplayName = "Add UI Interaction",ToolTip="Adds a UI interaction to the player data"))
    void AddUiInteraction(FString elementName, FString actionType);

    UFUNCTION(BlueprintCallable, Category = "Interaction",meta=(DisplayName = "Add Screen Visit",ToolTip="Adds a screen visit to the player data"))
    void AddScreenVisit(FString screenName, float duration);
    
    UFUNCTION(BlueprintCallable, Category = "Memory",meta=(DisplayName = "Add Memory",ToolTip="Adds a memory usage data point to the player data"))
    void AddMemory();

    UFUNCTION(BlueprintCallable, Category = "CPU",meta=(DisplayName = "Add CPU Usage",ToolTip="Adds a CPU usage data point to the player data"))
    void AddCPUUsage();

    UFUNCTION(BlueprintCallable, Category = "Moment",meta=(DisplayName = "Add Moment",ToolTip="Adds a moment to the player data"))
    void AddMoment(FVector position, FString CPU, FString RAM, FString FPS);

    UFUNCTION(BlueprintCallable, Category = "PlayerHealth",meta=(DisplayName = "Update Player Health",ToolTip="Updates the player's health in the player data"))
    void UpdatePlayerHealth(int newHealth);

    UPROPERTY(BlueprintReadWrite, Category = "DataSaving",meta=(DisplayName = "Player Data",ToolTip="The player data object"))
    UPlayerData* playerData;

protected:
private:
};