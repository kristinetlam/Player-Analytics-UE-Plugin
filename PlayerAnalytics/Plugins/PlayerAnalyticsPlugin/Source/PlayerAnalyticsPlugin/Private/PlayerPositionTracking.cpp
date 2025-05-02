#include "PlayerPositionTracking.h"
#include "PlayerData.h"
#include "PlayerDataHandler.h"
#include "GameFramework/Actor.h"
#include "Engine/World.h"
#include "TimerManager.h"

/**
 * @brief  Constructor for the UPlayerPositionTracking class.
 * 
 * This constructor initializes the component and sets it to tick every frame.
 */
UPlayerPositionTracking::UPlayerPositionTracking()
{
    PrimaryComponentTick.bCanEverTick = true;
}

/**
 * @brief  Called when the game starts.
 * 
 * This function is called when the game starts or when the actor is spawned.
 */
void UPlayerPositionTracking::BeginPlay()
{
    Super::BeginPlay();
    
}

/**
 * @brief  Called every frame.
 * 
 * This function is called every frame, and it can be used to update the component's state.
 * 
 * @param DeltaTime Time since last frame
 * @param TickType Type of tick
 * @param ThisTickFunction Pointer to the tick function
 */
void UPlayerPositionTracking::TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
    Super::TickComponent(DeltaTime, TickType, ThisTickFunction);
}

/**
 * @brief  Starts tracking the player's position at set intervals.
 * 
 * This function starts tracking the player's position at set intervals.
 */
void UPlayerPositionTracking::StartPositionTracking()
{
    if (!bIsTracking)
    {
        bIsTracking = true;

        // Start tracking the player's position at set intervals
        GetWorld()->GetTimerManager().SetTimer(TrackingTimer, this, &UPlayerPositionTracking::TrackPlayerPosition, TrackingInterval, true);
    }
}

/**
 * @brief  Stops tracking the player's position.
 * 
 * This function stops tracking the player's position.
 */
void UPlayerPositionTracking::StopPositionTracking()
{
    if (bIsTracking)
    {
        bIsTracking = false;
        GetWorld()->GetTimerManager().ClearTimer(TrackingTimer);
    }
}

/**
 * @brief  Tracks the player's position and stores it in the PlayerPositions array.
 * 
 * This function tracks the player's position and stores it in the PlayerPositions array.
 */
void UPlayerPositionTracking::TrackPlayerPosition()
{
    if (AActor* Owner = GetOwner())
    {
        FVector CurrentPosition = Owner->GetActorLocation();
        PlayerPositions.Add(CurrentPosition);

        //Grabs the player character's data handler
        UPlayerDataHandler* dataHandler = Owner->FindComponentByClass<UPlayerDataHandler>();
        dataHandler->AddPosition(CurrentPosition);

        UE_LOG(LogTemp, Log, TEXT("Player Position Tracked: %s"), *CurrentPosition.ToString());
    }
}
