// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "Kismet/BlueprintFunctionLibrary.h"
#include "ServerFunctions.generated.h"

/**
 * 
 */
UCLASS()
class PLAYERANALYTICSPLUGIN_API UServerFunctions : public UBlueprintFunctionLibrary
{
    GENERATED_BODY()

public:

    UFUNCTION(BlueprintCallable, Category = "Player Analytics")
    static void SendPlayerData();
};
