#pragma once

#include "CoreMinimal.h"
#include "Kismet/BlueprintFunctionLibrary.h"
#include "TestClass.generated.h"

UCLASS()
class PLAYERANALYTICSPLUGIN_API UTestClass : public UBlueprintFunctionLibrary
{
    GENERATED_BODY()

public:
    // Expose PrintMessage to Blueprints
    UFUNCTION(BlueprintCallable, Category = "PlayerAnalyticsPlugin")
    static void PrintHelloWorld();

    UFUNCTION(BlueprintCallable, Category = "PlayerAnalyticsPlugin")
    static void PrintHelloWorld2();
};