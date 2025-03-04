// Copyright Epic Games, Inc. All Rights Reserved.

#include "PlayerAnalyticsPlugin.h"

#define LOCTEXT_NAMESPACE "FPlayerAnalyticsPluginModule"

void FPlayerAnalyticsPluginModule::StartupModule()
{
	// This code will execute after your module is loaded into memory; the exact timing is specified in the .uplugin file per-module
	UE_LOG(LogTemp, Warning, TEXT("PlayerAnalyticsPlugin has started!"));
}

void FPlayerAnalyticsPluginModule::ShutdownModule()
{
	// This function may be called during shutdown to clean up your module.  For modules that support dynamic reloading,
	// we call this function before unloading the module.
	UE_LOG(LogTemp, Warning, TEXT("PlayerAnalyticsPlugin has shut down."));
}

#undef LOCTEXT_NAMESPACE
	
IMPLEMENT_MODULE(FPlayerAnalyticsPluginModule, PlayerAnalyticsPlugin)