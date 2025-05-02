#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "PlayerPositionTracking.generated.h"

UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class PLAYERANALYTICSPLUGIN_API UPlayerPositionTracking : public UActorComponent
{
    GENERATED_BODY()

public:
    UPlayerPositionTracking();

protected:
    virtual void BeginPlay() override;

public:
    virtual void TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction) override;
    
    UFUNCTION(BlueprintCallable, Category = "PositionTracking",
        meta=(DisplayName = "Start Position Tracking", ToolTip="Starts tracking the player's position at set intervals"))
    void StartPositionTracking();

    UFUNCTION(BlueprintCallable, Category = "PositionTracking",
        meta=(DisplayName = "Stop Position Tracking", ToolTip="Stops tracking the player's position"))
    void StopPositionTracking();
private:
    void TrackPlayerPosition();

    TArray<FVector> PlayerPositions;
    
    UPROPERTY(EditAnywhere, Category="PositionTracking")
    float TrackingInterval = 1.0f; // Time in seconds
    bool bIsTracking = false;

    FTimerHandle TrackingTimer;
};
