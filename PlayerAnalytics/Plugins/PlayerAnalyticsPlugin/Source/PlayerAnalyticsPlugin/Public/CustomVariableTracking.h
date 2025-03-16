#pragma once

#include "CoreMinimal.h"
#include "Kismet/BlueprintFunctionLibrary.h"
#include "CustomVariableTracking.generated.h"

UCLASS()
class PLAYERANALYTICSPLUGIN_API UCustomVariableTracking : public UBlueprintFunctionLibrary
{
    GENERATED_BODY()

public:
    // Overloads for various data types with explicit variable name parameter
    UFUNCTION(BlueprintCallable, Category = "PlayerAnalyticsPlugin")
    static void LogVariable(const FString& VariableName, const FString& VariableValue);

    UFUNCTION(BlueprintCallable, Category = "PlayerAnalyticsPlugin")
    static void LogVariable_Bool(const FString& VariableName, bool VariableValue);

    UFUNCTION(BlueprintCallable, Category = "PlayerAnalyticsPlugin")
    static void LogVariable_Int(const FString& VariableName, int32 VariableValue);

    UFUNCTION(BlueprintCallable, Category = "PlayerAnalyticsPlugin")
    static void LogVariable_Float(const FString& VariableName, float VariableValue);

    UFUNCTION(BlueprintCallable, Category = "PlayerAnalyticsPlugin")
    static void LogVariable_Vector(const FString& VariableName, FVector VariableValue);

    UFUNCTION(BlueprintCallable, Category = "PlayerAnalyticsPlugin")
    static void LogVariable_Rotator(const FString& VariableName, FRotator VariableValue);
};
