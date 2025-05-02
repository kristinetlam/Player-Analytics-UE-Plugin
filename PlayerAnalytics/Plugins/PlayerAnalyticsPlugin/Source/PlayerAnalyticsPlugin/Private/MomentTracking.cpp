#include "MomentTracking.h"
#include "PlayerData.h"
#include "PlayerDataHandler.h"
#include "GameFramework/Actor.h"
#include "Engine/World.h"
#include "TimerManager.h"
#include "Misc/App.h"

/**
 * @brief Construct a new UMomentTracking::UMomentTracking object
 * 
 */
UMomentTracking::UMomentTracking()
{
    PrimaryComponentTick.bCanEverTick = true;
}

/**
 * @brief Called when the game starts
 * 
 */
void UMomentTracking::BeginPlay()
{
    Super::BeginPlay();

}

/**
 * @brief Called every frame
 * 
 * @param DeltaTime Time since last frame
 * @param TickType Type of tick
 * @param ThisTickFunction Pointer to the tick function
 */
void UMomentTracking::TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
    Super::TickComponent(DeltaTime, TickType, ThisTickFunction);
}

/**
 * @brief Starts tracking the player's position at set intervals
 * 
 */
void UMomentTracking::StartMomentTracking()
{
    if (!bIsTracking)
    {
        bIsTracking = true;

        // Start tracking the player's position at set intervals
        GetWorld()->GetTimerManager().SetTimer(TrackingTimer, this, &UMomentTracking::TrackMoment, TrackingInterval, true);
    }
}

/**
 * @brief Stops tracking the player's position
 * 
 */
void UMomentTracking::StopMomentTracking()
{
    if (bIsTracking)
    {
        bIsTracking = false;
        GetWorld()->GetTimerManager().ClearTimer(TrackingTimer);
    }
}

/**
 * @brief Tracks the player's position and other data
 * 
 */
void UMomentTracking::TrackMoment()
{
    if (AActor* Owner = GetOwner())
    {
        FVector currentPosition = Owner->GetActorLocation();

        //Grabs the player character's data handler
        UPlayerDataHandler* dataHandler = Owner->FindComponentByClass<UPlayerDataHandler>();
        
        float RAMUsed = static_cast<double>(FPlatformMemory::GetStats().UsedPhysical) / (1024 * 1024);
        FString RAMUsedString = FString::SanitizeFloat(RAMUsed);
        FString CPUUsedString = FString::SanitizeFloat(FPlatformTime::GetCPUTime().CPUTimePct);

        //GET FPS
        double fps = 1.0 / FApp::GetDeltaTime();
        FString fpsString = FString::SanitizeFloat(fps);

        dataHandler->AddMoment(currentPosition, CPUUsedString, RAMUsedString, fpsString);


        UE_LOG(LogTemp, Log, TEXT("Player Position Tracked: %s"), *currentPosition.ToString());
    }
}
