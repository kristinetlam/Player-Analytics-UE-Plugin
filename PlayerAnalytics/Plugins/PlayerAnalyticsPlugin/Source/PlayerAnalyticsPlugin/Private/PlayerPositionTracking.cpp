#include "PlayerPositionTracking.h"
#include "PlayerData.h"
#include "PlayerDataHandler.h"
#include "GameFramework/Actor.h"
#include "Engine/World.h"
#include "TimerManager.h"

UPlayerPositionTracking::UPlayerPositionTracking()
{
    PrimaryComponentTick.bCanEverTick = true;
}

void UPlayerPositionTracking::BeginPlay()
{
    Super::BeginPlay();
    
}

void UPlayerPositionTracking::TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
    Super::TickComponent(DeltaTime, TickType, ThisTickFunction);
}

void UPlayerPositionTracking::StartPositionTracking()
{
    if (!bIsTracking)
    {
        bIsTracking = true;

        // Start tracking the player's position at set intervals
        GetWorld()->GetTimerManager().SetTimer(TrackingTimer, this, &UPlayerPositionTracking::TrackPlayerPosition, TrackingInterval, true);
    }
}

void UPlayerPositionTracking::StopPositionTracking()
{
    if (bIsTracking)
    {
        bIsTracking = false;
        GetWorld()->GetTimerManager().ClearTimer(TrackingTimer);
    }
}

void UPlayerPositionTracking::TrackPlayerPosition()
{
    if (AActor* Owner = GetOwner())
    {
        FVector CurrentPosition = Owner->GetActorLocation();
        PlayerPositions.Add(CurrentPosition);

        //Grabs the player character's data handler
        UPlayerDataHandler* dataHandler = Owner->FindComponentByClass<UPlayerDataHandler>();
        //dataHandler->AddPosition(Owner->GetActorLabel(), CurrentPosition);

        UE_LOG(LogTemp, Log, TEXT("Player Position Tracked: %s"), *CurrentPosition.ToString());
    }
}
