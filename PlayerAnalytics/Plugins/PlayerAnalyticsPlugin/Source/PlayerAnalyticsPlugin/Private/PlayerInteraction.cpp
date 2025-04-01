#include "PlayerInteraction.h"
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

void UPlayerInteraction::LogAlterInventory(AActor* InteractingActor, FString InteractionDescription, int newAmount)
{
    // Actor that is adding to or taking from the inventory (floating coin on the ground, chest, npc, crafting, etc.)
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
    FString LogMessage = FString::Printf(TEXT("[%s] %s interacted: %s"), *Timestamp, *ActorName, *InteractionDescription, newAmount);

    // Print to Unreal's output log
    UE_LOG(LogTemp, Log, TEXT("%s"), *LogMessage);
}

void UPlayerInteraction::LogInventory(const TArray<FString>& ItemNames, const TArray<int32>& ItemQuantities)
{
    // Check that lengths match
    if (ItemNames.Num() != ItemQuantities.Num())
    {
        UE_LOG(LogTemp, Warning, TEXT("Logged Inventory: Invalid inventory data."));
        return;
    }

    // Check if Inventory is empty
    if (ItemNames.Num() == 0)
    {
        UE_LOG(LogTemp, Log, TEXT("Logged Inventory: Empty"));
        return;
    }

    // Log inventory contents
    UE_LOG(LogTemp, Log, TEXT("Logged Inventory:"));

    for (int32 i = 0; i < ItemNames.Num(); i++)
    {
        UE_LOG(LogTemp, Log, TEXT(" - %s: %d"), *ItemNames[i], ItemQuantities[i]);
    }
}