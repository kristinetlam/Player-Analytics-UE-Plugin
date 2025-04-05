#include "PlayerInteraction.h"
#include "GameFramework/Actor.h"
#include "Misc/OutputDeviceDebug.h"

void UPlayerInteraction::LogPlayerInteraction(AActor* InteractingActor, FString InteractionDescription)
{
    if (!InteractingActor)
    {
        UE_LOG(LogTemp, Warning, TEXT("Interaction attempted with a null actor!"));
        return;
    }

    // Get current timestamp
    FDateTime Now = FDateTime::Now();
    FString Timestamp = Now.ToString(TEXT("%Y-%m-%d %H:%M:%S"));

    // Get the actor's name
    FString ActorName = InteractingActor->GetName();
    
    // Create log message with timestamp
    FString LogMessage = FString::Printf(TEXT("[%s] %s interacted: %s"), *Timestamp, *ActorName, *InteractionDescription);

    // Print to Unreal's output log
    UE_LOG(LogTemp, Log, TEXT("%s"), *LogMessage);

    // Display on-screen for debugging
    // if (GEngine)
    // {
    //     GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Cyan, LogMessage);
    // }
}

void UPlayerInteraction::LogPlayerHealthChange(AActor* InteractingActor, FString InteractionDescription, int health)
{
    //actor that is changing the health (Enemy, Bullet, Spikes on the ground, Health Potion, etc.)
    if (!InteractingActor)
    {
        UE_LOG(LogTemp, Warning, TEXT("Interaction attempted with a null actor!"));
        return;
    }

    // Get current timestamp
    FDateTime Now = FDateTime::Now();
    FString Timestamp = Now.ToString(TEXT("%Y-%m-%d %H:%M:%S"));

    // Get the actor's name
    FString ActorName = InteractingActor->GetName();

    // Create log message with timestamp
    FString LogMessage = FString::Printf(TEXT("[%s] %s interacted: %s"), *Timestamp, *ActorName, *InteractionDescription, health);

    // Print to Unreal's output log
    UE_LOG(LogTemp, Log, TEXT("%s"), *LogMessage);
}