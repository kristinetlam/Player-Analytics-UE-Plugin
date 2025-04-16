#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "MomentTracking.generated.h"

UCLASS(ClassGroup = (Custom), meta = (BlueprintSpawnableComponent))
class PLAYERANALYTICSPLUGIN_API UMomentTracking : public UActorComponent
{
    GENERATED_BODY()

public:
    UMomentTracking();

protected:
    virtual void BeginPlay() override;

public:
    virtual void TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction) override;

    UFUNCTION(BlueprintCallable, Category = "MomentTracking")
    void StartMomentTracking();

    UFUNCTION(BlueprintCallable, Category = "MomentTracking")
    void StopMomentTracking();
private:
    void TrackMoment();


    UPROPERTY(EditAnywhere, Category = "MomentTracking")
    float TrackingInterval = 1.0f; // Time in seconds
    bool bIsTracking = false;

    FTimerHandle TrackingTimer;
};
