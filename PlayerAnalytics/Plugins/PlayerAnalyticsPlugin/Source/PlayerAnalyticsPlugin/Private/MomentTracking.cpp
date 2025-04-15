#include "MomentTracking.h"
#include "PlayerData.h"
#include "PlayerDataHandler.h"
#include "GameFramework/Actor.h"
#include "Engine/World.h"
#include "TimerManager.h"
#include "Misc/App.h"

UMomentTracking::UMomentTracking()
{
    PrimaryComponentTick.bCanEverTick = true;
}

void UMomentTracking::BeginPlay()
{
    Super::BeginPlay();

}

void UMomentTracking::TickComponent(float DeltaTime, ELevelTick TickType, FActorComponentTickFunction* ThisTickFunction)
{
    Super::TickComponent(DeltaTime, TickType, ThisTickFunction);
}

void UMomentTracking::StartMomentTracking()
{
    if (!bIsTracking)
    {
        bIsTracking = true;

        // Start tracking the player's position at set intervals
        GetWorld()->GetTimerManager().SetTimer(TrackingTimer, this, &UMomentTracking::TrackMoment, TrackingInterval, true);
    }
}

void UMomentTracking::StopMomentTracking()
{
    if (bIsTracking)
    {
        bIsTracking = false;
        GetWorld()->GetTimerManager().ClearTimer(TrackingTimer);
    }
}

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
        double fps = FApp::GetTimecodeFrameRate().AsDecimal();
        FString fpsString = FString::SanitizeFloat(fps);

        dataHandler->AddMoment(currentPosition, RAMUsedString, CPUUsedString, fpsString);


        UE_LOG(LogTemp, Log, TEXT("Player Position Tracked: %s"), *currentPosition.ToString());
    }
}
