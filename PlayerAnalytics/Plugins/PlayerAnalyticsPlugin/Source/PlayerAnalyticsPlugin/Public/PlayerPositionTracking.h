#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "PlayerTracker.generated.h"

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

private:
    void TrackPlayerPosition();

    TArray<FVector> PlayerPositions;
    
    UPROPERTY(EditAnywhere, Category="Tracking")
    float TrackingInterval = 1.0f; // Time in seconds

    FTimerHandle TrackingTimer;
};
