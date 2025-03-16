#include "CustomVariableTracking.h"

void UCustomVariableTracking::LogVariable(const FString& VariableName, const FString& VariableValue)
{
    UE_LOG(LogTemp, Log, TEXT("Logged %s: %s"), *VariableName, *VariableValue);
}

void UCustomVariableTracking::LogVariable_Bool(const FString& VariableName, bool VariableValue)
{
    UE_LOG(LogTemp, Log, TEXT("Logged %s: %s"), *VariableName, VariableValue ? TEXT("True") : TEXT("False"));
}

void UCustomVariableTracking::LogVariable_Int(const FString& VariableName, int32 VariableValue)
{
    UE_LOG(LogTemp, Log, TEXT("Logged %s: %d"), *VariableName, VariableValue);
}

void UCustomVariableTracking::LogVariable_Float(const FString& VariableName, float VariableValue)
{
    UE_LOG(LogTemp, Log, TEXT("Logged %s: %f"), *VariableName, VariableValue);
}

void UCustomVariableTracking::LogVariable_Vector(const FString& VariableName, FVector VariableValue)
{
    UE_LOG(LogTemp, Log, TEXT("Logged %s: X=%.2f, Y=%.2f, Z=%.2f"), *VariableName, VariableValue.X, VariableValue.Y, VariableValue.Z);
}

void UCustomVariableTracking::LogVariable_Rotator(const FString& VariableName, FRotator VariableValue)
{
    UE_LOG(LogTemp, Log, TEXT("Logged %s: Pitch=%.2f, Yaw=%.2f, Roll=%.2f"), *VariableName, VariableValue.Pitch, VariableValue.Yaw, VariableValue.Roll);
}
