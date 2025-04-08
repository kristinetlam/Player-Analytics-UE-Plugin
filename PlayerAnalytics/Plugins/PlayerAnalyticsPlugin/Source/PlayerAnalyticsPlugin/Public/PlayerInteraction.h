#pragma once

#include "CoreMinimal.h"
#include "Kismet/BlueprintFunctionLibrary.h"
#include "PlayerInteraction.generated.h"

UCLASS()
class PLAYERANALYTICSPLUGIN_API UPlayerInteraction : public UBlueprintFunctionLibrary
{
    GENERATED_BODY()

public:
    // Expose PrintMessage to Blueprints
    UFUNCTION(BlueprintCallable, Category = "Interaction")
    static void LogPlayerInteraction(AActor* InteractingActor, FString InteractionDescription);
    
    UFUNCTION(BlueprintCallable, Category = "Interaction")
    static void LogPlayerHealthChange(AActor* InteractingActor, FString InteractionDescription, int health);
};